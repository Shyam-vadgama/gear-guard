from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from .. import crud, models, schemas, database
from .auth import SECRET_KEY, ALGORITHM

router = APIRouter(
    tags=["password_reset"],
    responses={404: {"description": "Not found"}},
)

RESET_TOKEN_EXPIRE_MINUTES = 15

def create_reset_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": email, "type": "reset", "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/forgot-password")
def forgot_password(request: schemas.PasswordResetRequest, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, email=request.email)
    if not user:
        # For security, don't reveal if user exists, but for dev we can log
        print(f"Password reset requested for non-existent email: {request.email}")
        return {"message": "If this email is registered, a password reset link has been sent."}
    
    token = create_reset_token(user.email)
    reset_link = f"http://localhost:8080/reset-password?token={token}"
    
    # In production, send email. For testing, print to console.
    print(f"============================================================")
    print(f"PASSWORD RESET LINK FOR {request.email}:")
    print(f"{reset_link}")
    print(f"============================================================")
    
    return {"message": "If this email is registered, a password reset link has been sent."}

@router.post("/reset-password")
def reset_password(request: schemas.PasswordResetConfirm, db: Session = Depends(database.get_db)):
    try:
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if email is None or token_type != "reset":
            raise HTTPException(status_code=400, detail="Invalid token")
            
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update password
    hashed_password = crud.get_password_hash(request.new_password)
    user.hashed_password = hashed_password
    db.commit()
    
    return {"message": "Password has been reset successfully"}
