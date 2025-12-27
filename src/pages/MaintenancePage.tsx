import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useApp } from "@/context/AppContext";
import { MaintenanceRequest, RequestStatus } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  User,
  Wrench,
  Box,
  DollarSign,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const columns: { id: RequestStatus; title: string; color: string }[] = [
  { id: "new", title: "New", color: "bg-kanban-new" },
  { id: "in_progress", title: "In Progress", color: "bg-kanban-progress" },
  { id: "repaired", title: "Repaired", color: "bg-kanban-repaired" },
  { id: "scrap", title: "Scrap", color: "bg-kanban-scrap" },
];

export default function MaintenancePage() {
  const [searchParams] = useSearchParams();
  const { requests, updateRequestStatus, teams, equipment, user } = useApp();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [initialEquipmentId, setInitialEquipmentId] = useState<string | null>(null);

  useEffect(() => {
    const newRequest = searchParams.get('newRequest');
    const eqId = searchParams.get('equipment');
    if (newRequest === 'true') {
        if (eqId) setInitialEquipmentId(eqId);
        setIsCreateOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isCreateOpen) {
        setInitialEquipmentId(null);
    }
  }, [isCreateOpen]);

  const handleDragEnd = (result: DropResult) => {
    if (user?.role === 'employee') return;
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as RequestStatus;
    
    updateRequestStatus(draggableId, newStatus);
  };

  const getColumnRequests = (status: RequestStatus) => {
    return requests.filter((r) => r.status === status);
  };

  return (
    <div className="space-y-4 sm:space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground mt-0.5 sm:mt-1 text-sm sm:text-base">
            Manage maintenance requests and workflow
          </p>
        </div>
        {user?.role !== 'technician' && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle>Create Maintenance Request</DialogTitle>
                <DialogDescription>
                  Identify the equipment to create a request.
                </DialogDescription>
              </DialogHeader>
              <NewRequestWizard 
                equipment={equipment} 
                teams={teams} 
                onClose={() => setIsCreateOpen(false)} 
                initialEquipmentId={initialEquipmentId}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="relative">
          <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-thin">
            {columns.map((column) => (
              <div 
                key={column.id} 
                className="flex flex-col min-w-[280px] sm:min-w-[300px] lg:min-w-0 flex-shrink-0 lg:flex-shrink"
              >
                <div className="flex items-center gap-2 mb-2 sm:mb-3 sticky top-0 bg-background/95 backdrop-blur-sm py-1 z-10">
                  <div className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full", column.color)} />
                  <h3 className="font-semibold text-sm sm:text-base">{column.title}</h3>
                  <span className="text-xs sm:text-sm text-muted-foreground ml-auto bg-secondary/50 px-2 py-0.5 rounded-full">
                    {getColumnRequests(column.id).length}
                  </span>
                </div>
                <Droppable droppableId={column.id} isDropDisabled={user?.role === 'employee'}>
                  {(provided, snapshot) => (
                    <ScrollArea 
                      className={cn(
                        "flex-1 rounded-lg sm:rounded-xl border border-border/50 p-2 transition-colors min-h-[300px] lg:min-h-[calc(100vh-280px)]",
                        snapshot.isDraggingOver && "bg-primary/5 border-primary/30"
                      )}
                    >
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-2 min-h-[200px]"
                      >
                        {getColumnRequests(column.id).map((request, index) => (
                          <Draggable
                            key={request.id}
                            draggableId={request.id.toString()}
                            index={index}
                            isDragDisabled={user?.role === 'employee'}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedRequest(request)}
                                className="select-none"
                              >
                                <RequestCard
                                  request={request}
                                  isDragging={snapshot.isDragging}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </ScrollArea>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
          <div className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 w-8 h-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </DragDropContext>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
          {selectedRequest && (
            <RequestDetailView 
              request={requests.find(r => r.id === selectedRequest.id) || selectedRequest} 
              teams={teams}
              onClose={() => setSelectedRequest(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RequestCard({ request, isDragging }: { request: MaintenanceRequest; isDragging: boolean }) {
  return (
    <Card className={cn(
      "kanban-card cursor-pointer active:scale-[0.98] transition-all duration-200",
      isDragging && "shadow-lg ring-2 ring-primary/50 rotate-1",
      request.isOverdue && "kanban-card-overdue",
      request.priority === "critical" && !request.isOverdue && "kanban-card-critical"
    )}>
      <CardContent className="p-2.5 sm:p-3 space-y-2 sm:space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-xs sm:text-sm line-clamp-2 flex-1">{request.subject}</h4>
          <StatusBadge variant={request.priority} size="sm">{request.priority}</StatusBadge>
        </div>
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
          <Box className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
          <span className="truncate">{request.equipmentName}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/50 gap-2">
          {request.assignedTechnicianName ? (
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <Avatar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0">
                <AvatarFallback className="text-[9px] sm:text-[10px] bg-primary/10 text-primary">
                  {request.assignedTechnicianName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[60px] sm:max-w-[80px]">
                {request.assignedTechnicianName}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Unassigned</span>
            </div>
          )}
          {request.isOverdue && (
            <div className="flex items-center gap-1 text-status-overdue text-[10px] sm:text-xs font-medium flex-shrink-0">
              <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden xs:inline">Overdue</span>
            </div>
          )}
          {request.isUnassignedCritical && (
            <div className="flex items-center gap-1 text-status-critical text-[10px] sm:text-xs font-medium animate-pulse flex-shrink-0">
              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>&gt;4h</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RequestDetailView({ request, teams, onClose }: { 
  request: MaintenanceRequest;
  teams: typeof import("@/data/mockData").mockTeams;
  onClose: () => void;
}) {
  const { assignTechnician, setRequests, user, updateRequestDetails } = useApp();
  const [availableParts, setAvailableParts] = useState<any[]>([]);
  const [selectedParts, setSelectedParts] = useState(() => {
      // @ts-ignore
      const parts = request.parts_usage || [];
      return parts.map((p: any) => ({
          id: p.part_id.toString(),
          name: p.part?.name || 'Unknown Part',
          unitCost: p.part?.unit_cost || 0,
          quantity: p.quantity_used
      }));
  });
  const [laborHours, setLaborHours] = useState(request.laborHours);
  const [description, setDescription] = useState(request.description);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const fetchParts = async () => {
          try {
              const parts = await api.spareParts.list();
              setAvailableParts(parts);
          } catch (e) {
              console.error("Failed to fetch parts", e);
          }
      };
      fetchParts();
  }, []);

  const team = teams.find(t => t.id === request.teamId) || teams[0];
  const technicians = team ? team.members : [];
  const hourlyRate = team?.members[0]?.hourlyRate || 50;

  const handleChecklistToggle = (checklistId: string) => {
    if (user?.role === 'employee') return;
    setRequests(prev => prev.map(r => {
      if (r.id === request.id && r.checklist) {
        return {
          ...r,
          checklist: r.checklist.map(item => 
            item.id === checklistId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return r;
    }));
  };

  const handleAddPart = (partId: string) => {
      const part = availableParts.find(p => p.id.toString() === partId);
      if (part) {
          setSelectedParts(prev => [...prev, { 
              id: part.id.toString(), 
              name: part.name,
              unitCost: part.unit_cost, 
              quantity: 1 
          }]);
      }
  };

  const handleSave = async () => {
      setLoading(true);
      try {
          await updateRequestDetails(request.id, {
              laborHours,
              description,
              // @ts-ignore
              parts: selectedParts.map(p => ({
                  part_id: parseInt(p.id),
                  quantity_used: p.quantity
              }))
          });
          onClose();
      } catch (error) {
          console.error("Failed to save", error);
      } finally {
          setLoading(false);
      }
  };

  const calculateTCO = () => {
    const laborCost = laborHours * hourlyRate;
    const partsCost = selectedParts.reduce((sum, part) => sum + (part.quantity * part.unitCost), 0);
    return { laborCost, partsCost, total: laborCost + partsCost };
  };

  const tco = calculateTCO();

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            request.type === 'preventive' ? 'bg-status-info/10' : 'bg-status-warning/10'
          )}>
            <Wrench className={cn(
              "h-5 w-5",
              request.type === 'preventive' ? 'text-status-info' : 'text-status-warning'
            )} />
          </div>
          <div>
            <DialogTitle>{request.subject}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 mt-1">
              <StatusBadge variant={request.type === 'preventive' ? 'info' : 'warning'} size="sm">
                {request.type}
              </StatusBadge>
              <StatusBadge variant={request.priority} size="sm">
                {request.priority}
              </StatusBadge>
              <StatusBadge variant={request.status} size="sm">
                {request.status.replace('_', ' ')}
              </StatusBadge>
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <Tabs defaultValue="details" className="mt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="checklist" disabled={request.type !== 'preventive'}>Checklist</TabsTrigger>
          <TabsTrigger value="parts">Parts</TabsTrigger>
          <TabsTrigger value="cost">Cost</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Equipment</Label>
              <p className="font-medium">{request.equipmentName}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Category</Label>
              <p className="font-medium">{request.category}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Team</Label>
              <p className="font-medium">{request.teamName || team?.name}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Due Date</Label>
              <p className={cn("font-medium", request.isOverdue && "text-status-overdue")}>
                {new Date(request.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Description</Label>
            <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                readOnly={user?.role === 'employee'}
                className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Assign Technician</Label>
            <Select 
              value={request.assignedTechnicianId?.toString() || ""}
              onValueChange={(value) => assignTechnician(request.id, value)}
              disabled={user?.role !== 'manager'}
            >
              <SelectTrigger>
                <SelectValue placeholder={user?.role === 'manager' ? "Select technician" : "Unassigned"} />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Labor Hours</Label>
            <Input 
              type="number" 
              value={laborHours}
              onChange={(e) => setLaborHours(parseFloat(e.target.value))}
              className="w-32"
              readOnly={user?.role === 'employee'}
            />
          </div>
        </TabsContent>

        <TabsContent value="checklist" className="mt-4">
          {request.checklist && request.checklist.length > 0 ? (
            <div className="space-y-3">
              {request.checklist.map((item) => (
                <div key={item.id} className={cn("flex items-center gap-3 p-3 rounded-lg border transition-colors", item.completed ? "bg-status-success/5 border-status-success/20" : "bg-secondary/30")}>
                  <Checkbox 
                    id={item.id}
                    checked={item.completed}
                    onCheckedChange={() => handleChecklistToggle(item.id)}
                    disabled={user?.role === 'employee'}
                  />
                  <label htmlFor={item.id} className={cn("flex-1 text-sm cursor-pointer", item.completed && "line-through text-muted-foreground")}>
                    {item.label}
                  </label>
                  {item.completed && <CheckCircle2 className="h-4 w-4 text-status-success" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No checklist items for this request</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="parts" className="mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Add Spare Part</Label>
              <Select disabled={user?.role === 'employee'} onValueChange={handleAddPart}>
                <SelectTrigger>
                  <SelectValue placeholder="Search and select parts..." />
                </SelectTrigger>
                <SelectContent>
                  {availableParts.map((part) => (
                    <SelectItem key={part.id} value={part.id.toString()}>
                      {part.name} - ${part.unit_cost}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Added Parts</Label>
              {selectedParts.length > 0 ? (
                <div className="space-y-2">
                  {selectedParts.map((part, idx) => (
                    <div key={`${part.id}-${idx}`} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div>
                        <p className="font-medium text-sm">{part.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {part.quantity} × ${part.unitCost}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${part.quantity * part.unitCost}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" disabled={user?.role === 'employee'}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No parts added yet</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cost" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-status-success" />
                Total Cost of Ownership (TCO)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="text-sm text-muted-foreground">Labor Cost</p>
                    <p className="text-xs text-muted-foreground">{laborHours} hours × ${hourlyRate}/hr</p>
                  </div>
                  <span className="font-semibold">${tco.laborCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="text-sm text-muted-foreground">Spare Parts Cost</p>
                    <p className="text-xs text-muted-foreground">{selectedParts.length} items</p>
                  </div>
                  <span className="font-semibold">${tco.partsCost.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10 border-2 border-primary/20">
                <span className="font-semibold text-primary">Total TCO</span>
                <span className="text-xl font-bold text-primary">${tco.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Close</Button>
        {user?.role !== 'employee' && (
          <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        )}
      </div>
    </>
  );
}

function NewRequestWizard({ equipment, teams, onClose, initialEquipmentId }: {
  equipment: any[];
  teams: any[];
  onClose: () => void;
  initialEquipmentId: string | null;
}) {
  const [step, setStep] = useState<'identify' | 'form'>(initialEquipmentId ? 'form' : 'identify');
  const [identifiedEquipmentId, setIdentifiedEquipmentId] = useState<string>(initialEquipmentId || "");
  const [serialInput, setSerialInput] = useState("");
  const [scanError, setScanError] = useState<string | null>(null);

  const handleIdentify = (serial: string) => {
      const found = equipment.find((e: any) => e.serialNumber === serial || e.qrCode === serial);
      if (found) {
          setIdentifiedEquipmentId(found.id.toString());
          setStep('form');
          setScanError(null);
      } else {
          setScanError(`Equipment with serial/code '${serial}' not found.`);
      }
  };

  if (step === 'identify') {
      return (
          <div className="space-y-6 py-2">
               <Tabs defaultValue="scan" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="scan">Scan Barcode</TabsTrigger>
                      <TabsTrigger value="manual">Enter Serial</TabsTrigger>
                  </TabsList>
                  <TabsContent value="scan" className="space-y-4 pt-4">
                       <div className="h-64 relative bg-black rounded-lg overflow-hidden border border-border">
                          <BarcodeScanner onScan={handleIdentify} className="h-full w-full" />
                       </div>
                       <p className="text-xs text-center text-muted-foreground">Position the barcode within the frame</p>
                  </TabsContent>
                   <TabsContent value="manual" className="space-y-4 pt-4">
                      <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>Serial Number / QR Code</Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={serialInput} 
                                    onChange={(e) => setSerialInput(e.target.value)} 
                                    placeholder="e.g. EQ-2024-001"
                                    onKeyDown={(e) => e.key === 'Enter' && handleIdentify(serialInput)}
                                />
                                <Button onClick={() => handleIdentify(serialInput)}>Find</Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Enter the serial number found on the equipment tag.
                          </p>
                      </div>
                  </TabsContent>
               </Tabs>
               
               {scanError && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                      <AlertTriangle className="h-4 w-4" />
                      {scanError}
                  </div>
               )}

               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue without scanning</span>
                  </div>
                </div>
               
               <Button variant="outline" className="w-full" onClick={() => setStep('form')}>
                  Select from List
               </Button>
          </div>
      )
  }

  return (
      <RequestForm 
          equipment={equipment} 
          teams={teams} 
          onClose={onClose} 
          defaultEquipmentId={identifiedEquipmentId}
      />
  )
}

function RequestForm({ equipment, teams, onClose, defaultEquipmentId }: { 
  equipment: typeof import("@/data/mockData").mockEquipment;
  teams: typeof import("@/data/mockData").mockTeams;
  onClose: () => void;
  defaultEquipmentId?: string;
}) {
  const { addRequest } = useApp();
  const [loading, setLoading] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(defaultEquipmentId || "");
  const [requestType, setRequestType] = useState<"corrective" | "preventive">("corrective");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "critical">("normal");
  const [dueDate, setDueDate] = useState("");

  const selectedEq = equipment.find(eq => eq.id === selectedEquipment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment) return;

    setLoading(true);
    try {
      await addRequest({
        subject,
        description,
        type: requestType,
        priority,
        equipmentId: selectedEquipment,
        dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'new',
        teamId: teams[0]?.id || null,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create request", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Request Type</Label>
        <Select value={requestType} onValueChange={(v) => setRequestType(v as any)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="corrective">Corrective (Breakdown)</SelectItem>
            <SelectItem value="preventive">Preventive (Scheduled)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Equipment</Label>
        <Select value={selectedEquipment} onValueChange={setSelectedEquipment} disabled={!!defaultEquipmentId}>
          <SelectTrigger><SelectValue placeholder="Select equipment" /></SelectTrigger>
          <SelectContent>
            {equipment.map((eq) => (
              <SelectItem key={eq.id} value={eq.id.toString()}>{eq.name} - {eq.serialNumber}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {defaultEquipmentId && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-status-success" /> 
                Equipment identified via scan/serial
            </p>
        )}
      </div>
      {selectedEq && (
        <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-secondary/30">
          <div><Label className="text-xs text-muted-foreground">Category</Label><p className="font-medium text-sm">{selectedEq.category}</p></div>
          <div><Label className="text-xs text-muted-foreground">Assigned Team</Label><p className="font-medium text-sm">{teams[0]?.name || 'General Technicians'}</p></div>
        </div>
      )}
      <div className="space-y-2"><Label>Subject</Label><Input value={subject} onChange={e => setSubject(e.target.value)} required placeholder="Brief description of the issue" /></div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} required placeholder="Detailed description of the maintenance request" rows={3} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required /></div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Request"}</Button>
      </div>
    </form>
  );
}
