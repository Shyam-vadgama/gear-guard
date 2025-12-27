from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, models, schemas, database
from . import auth

router = APIRouter(
    prefix="/equipment",
    tags=["equipment"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[schemas.Equipment])
def read_equipment(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_equipments(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.Equipment)
def create_equipment(equipment: schemas.EquipmentCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Optional: Check if user is manager
    # if current_user.role != models.UserRole.manager:
    #     raise HTTPException(status_code=403, detail="Not authorized")
    return crud.create_equipment(db=db, equipment=equipment)
