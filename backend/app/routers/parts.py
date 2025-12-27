from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, models, schemas, database
from . import auth

router = APIRouter(
    prefix="/parts",
    tags=["parts"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[schemas.SparePart])
def read_parts(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.SparePart).offset(skip).limit(limit).all()
