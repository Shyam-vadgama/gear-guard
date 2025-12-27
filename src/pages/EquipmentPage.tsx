import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Equipment } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { SmartButton } from "@/components/SmartButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Filter, 
  Box, 
  Wrench, 
  QrCode, 
  LayoutGrid, 
  List,
  MapPin,
  Calendar,
  Building2,
  X
} from "lucide-react";
import { equipmentCategories, departments, locations } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { BarcodeScanner } from "@/components/BarcodeScanner";

export default function EquipmentPage() {
  const { equipment, requests, user } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch = 
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || eq.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || eq.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getOpenRequestsCount = (equipmentId: string) => {
    return requests.filter(r => r.equipmentId === equipmentId && r.status !== 'repaired' && r.status !== 'scrap').length;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Equipment</h1>
          <p className="text-muted-foreground mt-0.5 sm:mt-1 text-sm sm:text-base">
            Manage and monitor your asset registry
          </p>
        </div>
        {user?.role === 'manager' && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogDescription>
                  Register a new piece of equipment in the system.
                </DialogDescription>
              </DialogHeader>
              <EquipmentForm onClose={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters and Search */}
      <Card className="glass-card">
        <CardContent className="pt-4 sm:pt-6 pb-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or serial number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 sm:h-10 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full xs:w-[140px] sm:w-[160px] h-9 sm:h-10 text-xs sm:text-sm">
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {equipmentCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[100px] xs:w-[120px] sm:w-[140px] h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="scrapped">Scrapped</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-lg overflow-hidden ml-auto">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none h-9 sm:h-10 w-9 sm:w-10"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-none h-9 sm:h-10 w-9 sm:w-10"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Display */}
      {viewMode === "grid" ? (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEquipment.map((eq) => (
            <EquipmentCard 
              key={eq.id} 
              equipment={eq} 
              openRequests={getOpenRequestsCount(eq.id)}
              onMaintenanceClick={() => navigate(`/maintenance?equipment=${eq.id}`)}
            />
          ))}
        </div>
      ) : (
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm min-w-[120px]">Name</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Serial</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Category</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Location</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm text-center">Requests</TableHead>
                    <TableHead className="text-xs sm:text-sm text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipment.map((eq) => (
                    <TableRow key={eq.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">
                        <div className="min-w-0">
                          <p className="truncate">{eq.name}</p>
                          <p className="text-[10px] text-muted-foreground sm:hidden font-mono">{eq.serialNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs sm:text-sm hidden sm:table-cell">{eq.serialNumber}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden md:table-cell">{eq.category}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{eq.location}</TableCell>
                      <TableCell>
                        <StatusBadge variant={eq.status} size="sm">{eq.status}</StatusBadge>
                      </TableCell>
                      <TableCell className="text-center">
                        {getOpenRequestsCount(eq.id) > 0 ? (
                          <span className="inline-flex items-center justify-center min-w-[20px] h-5 sm:h-6 rounded-full bg-status-warning text-white text-[10px] sm:text-xs font-bold">
                            {getOpenRequestsCount(eq.id)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <QrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigate(`/maintenance?equipment=${eq.id}`)}
                          >
                            <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EquipmentCard({ 
  equipment, 
  openRequests,
  onMaintenanceClick 
}: { 
  equipment: Equipment; 
  openRequests: number;
  onMaintenanceClick: () => void;
}) {
  return (
    <Card className="glass-card overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in card-hover">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Box className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm sm:text-base truncate">{equipment.name}</CardTitle>
              <p className="text-xs sm:text-sm font-mono text-muted-foreground truncate">{equipment.serialNumber}</p>
            </div>
          </div>
          <StatusBadge variant={equipment.status} size="sm">{equipment.status}</StatusBadge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{equipment.department}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{equipment.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">Warranty: {new Date(equipment.warrantyExpiry).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <SmartButton
            icon={Wrench}
            label="Maintenance"
            count={openRequests}
            variant={openRequests > 0 ? "warning" : "default"}
            onClick={onMaintenanceClick}
            className="flex-1"
          />
          <SmartButton
            icon={QrCode}
            label="QR Code"
            className="flex-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function EquipmentForm({ onClose }: { onClose: () => void }) {
  const { addEquipment } = useApp();
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    category: "",
    department: "",
    location: "",
    manufacturer: "",
    model: "",
    purchaseDate: "",
    warrantyExpiry: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleScan = (result: string) => {
    setFormData({ ...formData, serialNumber: result });
    setIsScanning(false);
    toast.success("Serial number scanned");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addEquipment(formData);
      toast.success("Equipment added successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to add equipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md bg-background rounded-lg p-4 relative">
             <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 z-10 text-white"
                onClick={() => setIsScanning(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            <h3 className="text-lg font-bold mb-4">Scan Barcode</h3>
            <BarcodeScanner onScan={handleScan} onClose={() => setIsScanning(false)} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Equipment Name</Label>
          <Input id="name" value={formData.name} onChange={handleChange} required placeholder="CNC Milling Machine" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number</Label>
          <div className="flex gap-2">
            <Input id="serialNumber" value={formData.serialNumber} onChange={handleChange} required placeholder="CNC-2024-001" />
            <Button type="button" size="icon" variant="outline" onClick={() => setIsScanning(true)} title="Scan Barcode">
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={(val) => handleSelectChange('category', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {equipmentCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select onValueChange={(val) => handleSelectChange('department', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select onValueChange={(val) => handleSelectChange('location', val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input id="manufacturer" value={formData.manufacturer} onChange={handleChange} required placeholder="Haas Automation" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" value={formData.model} onChange={handleChange} required placeholder="VF-2SS" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input id="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
          <Input id="warrantyExpiry" type="date" value={formData.warrantyExpiry} onChange={handleChange} required />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Equipment"}
        </Button>
      </div>
    </form>
  );
}
