from app.database import SessionLocal, engine
from app import models, crud, schemas
from app.models import UserRole, RequestType, RequestPriority, EquipmentStatus

db = SessionLocal()

def get_or_create(session, model, defaults=None, **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance
    else:
        params = {**kwargs, **(defaults or {})}
        instance = model(**params)
        session.add(instance)
        session.commit()
        session.refresh(instance)
        return instance

def seed():
    print("Starting seeding...")
    
    # Create Team
    team = get_or_create(db, models.Team, name="Mechanical Team", defaults={"specialization": "General Mechanics"})
    print(f"Team '{team.name}' ready.")

    # Create Users
    manager = get_or_create(
        db, models.User, email="manager@example.com",
        defaults={
            "hashed_password": crud.get_password_hash("password"),
            "full_name": "Manager Mike",
            "role": UserRole.manager,
            "team_id": team.id
        }
    )
    print(f"User '{manager.email}' ready.")

    tech = get_or_create(
        db, models.User, email="tech@example.com",
        defaults={
            "hashed_password": crud.get_password_hash("password"),
            "full_name": "Tech Tom",
            "role": UserRole.technician,
            "hourly_rate": 50.0,
            "team_id": team.id
        }
    )
    print(f"User '{tech.email}' ready.")

    employee = get_or_create(
        db, models.User, email="employee@example.com",
        defaults={
            "hashed_password": crud.get_password_hash("password"),
            "full_name": "Employee Emma",
            "role": UserRole.employee
        }
    )
    print(f"User '{employee.email}' ready.")
    
    # Create Equipment
    eq1 = get_or_create(
        db, models.Equipment, serial_number="CNC-001",
        defaults={
            "name": "CNC Machine",
            "category": "Manufacturing",
            "department": "Production",
            "location": "Floor 1",
            "warranty_expiry": "2026-01-01",
            "status": EquipmentStatus.active,
            "purchase_date": "2024-01-01",
            "manufacturer": "Haas",
            "model": "VF-1"
        }
    )
    print(f"Equipment '{eq1.name}' ready.")
    
    # Create Request
    # Requests don't have unique keys easily checkable besides ID, so we'll just check if *any* exist for this equip
    existing_req = db.query(models.MaintenanceRequest).filter_by(equipment_id=eq1.id, subject="Noise in motor").first()
    if not existing_req:
        req = models.MaintenanceRequest(
            subject="Noise in motor",
            description="Loud grinding noise",
            type=RequestType.corrective,
            priority=RequestPriority.critical,
            equipment_id=eq1.id,
            created_by_id=employee.id,
            due_date="2025-01-01"
        )
        db.add(req)
        db.commit()
        print("Maintenance Request created.")
    else:
        print("Maintenance Request already exists.")

    # Create Spare Parts
    parts = [
        {"name": "Bearing SKF 6205", "quantity": 100, "unit_cost": 45.0},
        {"name": "V-Belt A68", "quantity": 50, "unit_cost": 28.0},
        {"name": "Hydraulic Seal Kit", "quantity": 20, "unit_cost": 150.0},
        {"name": "Compressor Oil (L)", "quantity": 200, "unit_cost": 25.0},
        {"name": "Air Filter Element", "quantity": 30, "unit_cost": 35.0},
        {"name": "Electrical Fuse 20A", "quantity": 500, "unit_cost": 8.0},
        {"name": "Lubricant Grease (kg)", "quantity": 100, "unit_cost": 18.0},
        {"name": "Conveyor Belt Section", "quantity": 10, "unit_cost": 220.0},
        {"name": "Motor Coupling", "quantity": 15, "unit_cost": 95.0},
        {"name": "Pressure Gauge", "quantity": 40, "unit_cost": 55.0},
    ]
    
    for p in parts:
        get_or_create(db, models.SparePart, name=p["name"], defaults=p)
    
    print("Spare Parts seeded.")
    print("Seeding complete.")

if __name__ == "__main__":
    # Create tables first if they don't exist
    models.Base.metadata.create_all(bind=engine)
    try:
        seed()
    except Exception as e:
        print(f"Seeding failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()