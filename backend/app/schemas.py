from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from .models import UserRole, RequestStatus, RequestType, RequestPriority, EquipmentStatus

# --- Tokens ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

# --- User ---
class UserBase(BaseModel):
    email: str
    full_name: str
    role: UserRole
    hourly_rate: Optional[float] = None
    avatar_url: Optional[str] = None
    team_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# --- Team ---
class TeamBase(BaseModel):
    name: str
    specialization: str

class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: int
    members: List[User] = []
    class Config:
        from_attributes = True

# --- Equipment ---
class EquipmentBase(BaseModel):
    name: str
    serial_number: str
    category: str
    department: str
    location: str
    warranty_expiry: datetime
    status: EquipmentStatus
    purchase_date: datetime
    manufacturer: str
    model: str
    image_url: Optional[str] = None
    qr_code: Optional[str] = None
    assigned_to_user_id: Optional[int] = None

class EquipmentCreate(EquipmentBase):
    pass

class Equipment(EquipmentBase):
    id: int
    open_requests_count: int = 0 # Computed field
    class Config:
        from_attributes = True

# --- Spare Part ---
class SparePartBase(BaseModel):
    name: str
    quantity: int
    unit_cost: float

class SparePartCreate(SparePartBase):
    pass

class SparePart(SparePartBase):
    id: int
    class Config:
        from_attributes = True

class PartUsageBase(BaseModel):
    part_id: int
    quantity_used: int

class PartUsageCreate(PartUsageBase):
    pass

class PartUsage(PartUsageBase):
    part: Optional[SparePart] = None
    class Config:
        from_attributes = True

# --- Checklist ---
class ChecklistItemBase(BaseModel):
    label: str
    completed: bool = False

class ChecklistItemCreate(ChecklistItemBase):
    pass

class ChecklistItem(ChecklistItemBase):
    id: int
    request_id: int
    class Config:
        from_attributes = True

# --- Maintenance Request ---
class MaintenanceRequestBase(BaseModel):
    subject: str
    description: str
    type: RequestType
    priority: RequestPriority
    status: RequestStatus = RequestStatus.new
    due_date: datetime
    labor_hours: float = 0.0
    equipment_id: int
    team_id: Optional[int] = None
    assigned_technician_id: Optional[int] = None

class MaintenanceRequestCreate(MaintenanceRequestBase):
    checklist: List[ChecklistItemCreate] = []

class MaintenanceRequestUpdate(BaseModel):
    subject: Optional[str] = None
    description: Optional[str] = None
    type: Optional[RequestType] = None
    priority: Optional[RequestPriority] = None
    status: Optional[RequestStatus] = None
    due_date: Optional[datetime] = None
    labor_hours: Optional[float] = None
    equipment_id: Optional[int] = None
    team_id: Optional[int] = None
    assigned_technician_id: Optional[int] = None
    checklist: Optional[List[ChecklistItemCreate]] = None
    parts: Optional[List[PartUsageCreate]] = None

class MaintenanceRequest(MaintenanceRequestBase):
    id: int
    created_at: datetime
    completed_at: Optional[datetime] = None
    created_by_id: int
    checklist: List[ChecklistItem] = []
    parts_usage: List[PartUsage] = [] 
    
    # Nested objects for display
    equipment: Optional[Equipment] = None
    created_by: Optional[User] = None
    assigned_technician: Optional[User] = None
    team: Optional[Team] = None

    class Config:
        from_attributes = True
