import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Equipment, Team, MaintenanceRequest, DashboardStats } from '@/types';
import { api, setAuthToken, removeAuthToken, getAuthToken, ApiError } from '@/lib/api';
import { toast } from "sonner";

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  hourly_rate?: number;
  team_id?: number;
}

interface AppContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  equipment: Equipment[];
  setEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  requests: MaintenanceRequest[];
  setRequests: React.Dispatch<React.SetStateAction<MaintenanceRequest[]>>;
  stats: DashboardStats;
  updateRequestStatus: (requestId: string, newStatus: MaintenanceRequest['status']) => void;
  updateRequestDetails: (requestId: string, updates: Partial<MaintenanceRequest>) => Promise<void>;
  assignTechnician: (requestId: string, technicianId: string) => void;
  addRequest: (request: any) => Promise<void>;
  addEquipment: (equipment: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [teams, setTeams] = useState<Team[]>([]); 
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    activeEquipment: 0,
    openRequests: 0,
    criticalRequests: 0,
    overdueRequests: 0,
    completedThisMonth: 0,
    totalCost: 0,
  });

  useEffect(() => {
    const init = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await api.auth.me();
          setUser(userData);
          fetchData();
        } catch (e: any) {
          if (e instanceof ApiError && e.status === 401) {
            logout();
          } else {
             console.error("Failed to init user session", e);
          }
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    let socket: WebSocket | null = null;

    if (user) {
      // Assuming backend runs on localhost:8000
      const wsUrl = `ws://localhost:8000/ws/${user.id}`;
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("Connected to WebSocket");
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "REQUEST_UPDATED") {
            const data = message.data;
            setRequests((prev) =>
              prev.map((req) =>
                req.id.toString() === data.id.toString()
                  ? { ...req, status: data.status, subject: data.subject, equipmentName: data.equipmentName }
                  : req
              )
            );
            toast.info(`Update: ${data.subject}`, {
                description: `Status changed to ${data.status.replace('_', ' ')}`
            });
            // Refresh full data to get side effects (like stats, or deep nested changes)
            fetchData(); 
          }
        } catch (e) {
          console.error("Failed to parse WS message", e);
        }
      };

      socket.onclose = () => {
        console.log("Disconnected from WebSocket");
      };
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [user]);

  const fetchData = async () => {
    try {
      const [eqData, reqData, userData] = await Promise.all([
        api.equipment.list(),
        api.requests.list(),
        api.users.list()
      ]);
      
      const mappedEquipment = eqData.map((e: any) => ({
        ...e,
        serialNumber: e.serial_number,
        warrantyExpiry: e.warranty_expiry,
        purchaseDate: e.purchase_date,
        openRequestsCount: e.open_requests_count,
        imageUrl: e.image_url,
      }));

      const userMap = new Map(userData.map((u: any) => [u.id, u]));

      const mappedRequests = reqData.map((r: any) => ({
        ...r,
        createdAt: r.created_at,
        dueDate: r.due_date,
        laborHours: r.labor_hours,
        equipmentId: r.equipment_id,
        teamId: r.team_id,
        equipmentName: r.equipment?.name || 'Unknown', 
        assignedTechnicianId: r.assigned_technician_id,
        assignedTechnicianName: r.assigned_technician_id ? userMap.get(r.assigned_technician_id)?.full_name : undefined,
        assignedTechnicianAvatar: r.assigned_technician_id ? userMap.get(r.assigned_technician_id)?.avatar_url : undefined,
        parts_usage: r.parts_usage // Pass through
      }));

      setEquipment(mappedEquipment);
      setRequests(mappedRequests);
      
      const technicians = userData.filter((u: any) => u.role === 'technician' || u.role === 'manager');
      const generalTeam: Team = {
        id: 'team-001',
        name: 'General Technicians',
        specialization: 'General',
        members: technicians.map((u: any) => ({
           id: u.id.toString(),
           name: u.full_name,
           email: u.email,
           avatar: u.avatar_url || '',
           role: u.role,
           hourlyRate: u.hourly_rate || 50 // Default rate
        }))
      };
      setTeams([generalTeam]);

      // Calculate total cost
      const totalCost = mappedRequests.reduce((sum: number, req: any) => {
          const tech = userMap.get(req.assignedTechnicianId);
          const rate = tech?.hourly_rate || 50;
          const laborCost = (req.laborHours || 0) * rate;
          const partsCost = (req.parts_usage || []).reduce((pSum: number, p: any) => pSum + (p.quantity_used * p.part.unit_cost), 0);
          return sum + laborCost + partsCost;
      }, 0);

      setStats({
        totalEquipment: eqData.length,
        activeEquipment: eqData.filter((e: any) => e.status === 'active').length,
        openRequests: reqData.filter((r: any) => r.status !== 'repaired' && r.status !== 'scrap').length,
        criticalRequests: reqData.filter((r: any) => r.priority === 'critical').length,
        overdueRequests: 0,
        completedThisMonth: 0,
        totalCost: totalCost,
      });

    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  };

  const login = async (email: string, pass: string) => {
    const data = await api.auth.login(email, pass);
    setAuthToken(data.access_token);
    const userData = await api.auth.me();
    setUser(userData);
    fetchData();
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setEquipment([]);
    setRequests([]);
    setTeams([]);
  };

  const updateRequestStatus = async (requestId: string, newStatus: MaintenanceRequest['status']) => {
    try {
        setRequests(prev => prev.map(req => req.id.toString() === requestId ? { ...req, status: newStatus } : req));
        await api.requests.update(requestId, { status: newStatus });
    } catch (e) {
        console.error("Failed to update status", e);
        fetchData();
    }
  };

  const updateRequestDetails = async (requestId: string, updates: Partial<MaintenanceRequest>) => {
      try {
          const backendUpdates: any = { ...updates };
          if (updates.laborHours !== undefined) backendUpdates.labor_hours = updates.laborHours;
          
          await api.requests.update(requestId, backendUpdates);
          fetchData();
      } catch (e) {
          console.error("Failed to update request details", e);
      }
  };

  const assignTechnician = async (requestId: string, technicianId: string) => {
    try {
        await api.requests.update(requestId, { assigned_technician_id: parseInt(technicianId) });
        fetchData(); 
    } catch (e) {
        console.error("Failed to assign technician", e);
    }
  };

  const addRequest = async (request: any) => {
    try {
        const backendData = {
            subject: request.subject,
            description: request.description,
            type: request.type,
            priority: request.priority,
            equipment_id: parseInt(request.equipmentId),
            due_date: request.dueDate,
            status: request.status,
            team_id: request.teamId ? parseInt(request.teamId) : null,
        };
        await api.requests.create(backendData);
        fetchData();
    } catch (e) {
        console.error("Failed to add request", e);
        throw e;
    }
  };

  const addEquipment = async (data: any) => {
     try {
         const backendData = {
             name: data.name,
             serial_number: data.serialNumber,
             category: data.category,
             department: data.department,
             location: data.location,
             warranty_expiry: data.warrantyExpiry,
             status: 'active',
             purchase_date: data.purchaseDate,
             manufacturer: data.manufacturer,
             model: data.model
         };
         await api.equipment.create(backendData);
         fetchData();
     } catch(e) {
         console.error("Failed to add equipment", e);
         throw e;
     }
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      equipment,
      setEquipment,
      teams,
      setTeams,
      requests,
      setRequests,
      stats,
      updateRequestStatus,
      updateRequestDetails,
      assignTechnician,
      addRequest,
      addEquipment,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}