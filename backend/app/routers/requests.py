from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, models, schemas, database
from . import auth
from ..websockets import manager
import json

router = APIRouter(
    prefix="/requests",
    tags=["requests"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[schemas.MaintenanceRequest])
def read_requests(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_requests(db, user=current_user, skip=skip, limit=limit)

@router.post("/", response_model=schemas.MaintenanceRequest)
def create_request(request: schemas.MaintenanceRequestCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role == models.UserRole.technician:
         raise HTTPException(status_code=403, detail="Technicians cannot create requests")
    return crud.create_request(db=db, request=request, user_id=current_user.id)

@router.put("/{request_id}", response_model=schemas.MaintenanceRequest)
async def update_request(request_id: int, request: schemas.MaintenanceRequestUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Fetch existing request to check permissions
    existing_req = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.id == request_id).first()
    if not existing_req:
        raise HTTPException(status_code=404, detail="Request not found")

    if current_user.role == models.UserRole.employee:
        raise HTTPException(status_code=403, detail="Employees cannot update requests")
    
    if current_user.role == models.UserRole.technician:
        if existing_req.assigned_technician_id != current_user.id:
            raise HTTPException(status_code=403, detail="Cannot update unassigned requests")
        if request.assigned_technician_id is not None and request.assigned_technician_id != existing_req.assigned_technician_id:
            raise HTTPException(status_code=403, detail="Technicians cannot reassign tasks")
        # Allow status/checklist/etc updates

    db_request = crud.update_request(db=db, request_id=request_id, request_update=request)
    
    # Broadcast update
    if db_request:
        await manager.broadcast(json.dumps({
            "type": "REQUEST_UPDATED",
            "data": {
                "id": db_request.id,
                "status": db_request.status,
                "subject": db_request.subject,
                "equipmentName": db_request.equipment.name if db_request.equipment else "Unknown",
                "assignedTechnicianName": db_request.assigned_technician.full_name if db_request.assigned_technician else None
            }
        }))

    return db_request
