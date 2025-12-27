from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float, Enum, Table
from sqlalchemy.orm import relationship
from .database import Base
import enum
import datetime

class UserRole(str, enum.Enum):
    employee = "employee"
    manager = "manager"
    technician = "technician"

class RequestStatus(str, enum.Enum):
    new = "new"
    in_progress = "in_progress"
    repaired = "repaired"
    scrap = "scrap"

class RequestType(str, enum.Enum):
    corrective = "corrective"
    preventive = "preventive"

class RequestPriority(str, enum.Enum):
    low = "low"
    normal = "normal"
    critical = "critical"

class EquipmentStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    scrapped = "scrapped"

class RequestPart(Base):
    __tablename__ = 'request_parts'
    
    request_id = Column(Integer, ForeignKey('maintenance_requests.id'), primary_key=True)
    part_id = Column(Integer, ForeignKey('spare_parts.id'), primary_key=True)
    quantity_used = Column(Integer, default=1)

    part = relationship("SparePart")
    request = relationship("MaintenanceRequest", back_populates="parts_usage")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(Enum(UserRole))
    hourly_rate = Column(Float, nullable=True)
    avatar_url = Column(String, nullable=True)

    # Relationships
    assigned_equipment = relationship("Equipment", back_populates="assigned_user")
    created_requests = relationship("MaintenanceRequest", foreign_keys="[MaintenanceRequest.created_by_id]", back_populates="created_by")
    assigned_requests = relationship("MaintenanceRequest", foreign_keys="[MaintenanceRequest.assigned_technician_id]", back_populates="assigned_technician")
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    team = relationship("Team", back_populates="members")

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    specialization = Column(String)

    members = relationship("User", back_populates="team")
    requests = relationship("MaintenanceRequest", back_populates="team")

class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    serial_number = Column(String, unique=True, index=True)
    category = Column(String)
    department = Column(String)
    location = Column(String)
    warranty_expiry = Column(DateTime)
    status = Column(Enum(EquipmentStatus), default=EquipmentStatus.active)
    purchase_date = Column(DateTime)
    manufacturer = Column(String)
    model = Column(String)
    image_url = Column(String, nullable=True)
    qr_code = Column(String, unique=True, nullable=True)

    assigned_to_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_user = relationship("User", back_populates="assigned_equipment")
    
    requests = relationship("MaintenanceRequest", back_populates="equipment")

    @property
    def open_requests_count(self):
        return 0 # Placeholder

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String)
    description = Column(String)
    type = Column(Enum(RequestType))
    priority = Column(Enum(RequestPriority))
    status = Column(Enum(RequestStatus), default=RequestStatus.new)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    due_date = Column(DateTime)
    completed_at = Column(DateTime, nullable=True)
    labor_hours = Column(Float, default=0.0)

    equipment_id = Column(Integer, ForeignKey("equipment.id"))
    equipment = relationship("Equipment", back_populates="requests")

    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    team = relationship("Team", back_populates="requests")

    created_by_id = Column(Integer, ForeignKey("users.id"))
    created_by = relationship("User", foreign_keys=[created_by_id], back_populates="created_requests")

    assigned_technician_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_technician = relationship("User", foreign_keys=[assigned_technician_id], back_populates="assigned_requests")

    checklist = relationship("ChecklistItem", back_populates="request", cascade="all, delete-orphan")
    parts_usage = relationship("RequestPart", back_populates="request", cascade="all, delete-orphan")

class SparePart(Base):
    __tablename__ = "spare_parts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    quantity = Column(Integer)
    unit_cost = Column(Float)

class ChecklistItem(Base):
    __tablename__ = "checklist_items"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("maintenance_requests.id"))
    label = Column(String)
    completed = Column(Boolean, default=False)
    
    request = relationship("MaintenanceRequest", back_populates="checklist")