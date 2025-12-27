export type Priority = 'low' | 'normal' | 'critical';
export type RequestStatus = 'new' | 'in_progress' | 'repaired' | 'scrap';
export type RequestType = 'corrective' | 'preventive';

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  department: string;
  location: string;
  warrantyExpiry: string;
  status: 'active' | 'inactive' | 'scrapped';
  assignedTo?: string;
  qrCode: string;
  openRequestsCount: number;
  purchaseDate: string;
  manufacturer: string;
  model: string;
  imageUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  specialization: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  hourlyRate: number;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description: string;
  type: RequestType;
  priority: Priority;
  status: RequestStatus;
  equipmentId: string;
  equipmentName: string;
  category: string;
  teamId: string;
  teamName: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  assignedTechnicianAvatar?: string;
  createdAt: string;
  dueDate: string;
  completedAt?: string;
  laborHours: number;
  spareParts: SparePart[];
  checklist?: ChecklistItem[];
  isOverdue: boolean;
  isUnassignedCritical: boolean;
}

export interface SparePart {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface DashboardStats {
  totalEquipment: number;
  activeEquipment: number;
  openRequests: number;
  criticalRequests: number;
  overdueRequests: number;
  completedThisMonth: number;
  totalCost: number;
}
