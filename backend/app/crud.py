from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# --- User ---
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role,
        hourly_rate=user.hourly_rate,
        avatar_url=user.avatar_url,
        team_id=user.team_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

# --- Team ---
def get_teams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Team).offset(skip).limit(limit).all()

def create_team(db: Session, team: schemas.TeamCreate):
    db_team = models.Team(**team.dict())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

# --- Equipment ---
def get_equipment(db: Session, equipment_id: int):
    return db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()

def get_equipments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Equipment).offset(skip).limit(limit).all()

def create_equipment(db: Session, equipment: schemas.EquipmentCreate):
    db_item = models.Equipment(**equipment.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# --- Requests ---
def get_requests(db: Session, user: models.User, skip: int = 0, limit: int = 100):
    query = db.query(models.MaintenanceRequest)
    if user.role == models.UserRole.employee:
        query = query.filter(models.MaintenanceRequest.created_by_id == user.id)
    elif user.role == models.UserRole.technician:
        query = query.filter(models.MaintenanceRequest.assigned_technician_id == user.id)
    return query.offset(skip).limit(limit).all()

def create_request(db: Session, request: schemas.MaintenanceRequestCreate, user_id: int):
    # Extract checklist data
    checklist_data = request.checklist
    request_data = request.dict()
    request_data.pop('checklist') # remove checklist to create main obj
    
    db_request = models.MaintenanceRequest(**request_data, created_by_id=user_id)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)

    # Create checklist items
    for item in checklist_data:
        db_item = models.ChecklistItem(**item.dict(), request_id=db_request.id)
        db.add(db_item)
    
    db.commit()
    db.refresh(db_request)
    return db_request

def update_request(db: Session, request_id: int, request_update: schemas.MaintenanceRequestUpdate):
    db_req = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.id == request_id).first()
    if not db_req:
        return None
    
    update_data = request_update.dict(exclude_unset=True)
    
    if 'checklist' in update_data:
        update_data.pop('checklist')

    if 'parts' in update_data:
        parts_data = update_data.pop('parts')
        # Clear existing parts
        db.query(models.RequestPart).filter(models.RequestPart.request_id == request_id).delete()
        # Add new parts
        for part in parts_data:
            db_part = models.RequestPart(request_id=request_id, part_id=part['part_id'], quantity_used=part['quantity_used'])
            db.add(db_part)

    for key, value in update_data.items():
        setattr(db_req, key, value)

    db.commit()
    db.refresh(db_req)
    return db_req

def update_request_status(db: Session, request_id: int, status: str):
    db_req = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.id == request_id).first()
    if db_req:
        db_req.status = status
        db.commit()
        db.refresh(db_req)
    return db_req
