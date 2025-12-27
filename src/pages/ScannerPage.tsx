import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BarcodeScanner } from "@/components/BarcodeScanner";

export default function ScannerPage() {
  const navigate = useNavigate();
  const { equipment } = useApp();
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = (result: string) => {
    setScannedCode(result);
    setScanning(false);
    
    // Check if equipment exists immediately
    const found = equipment.find(eq => eq.serialNumber === result || eq.qrCode === result);
    if (!found) {
      setError(`No equipment found for code: ${result}`);
    } else {
      setError(null);
    }
  };

  const handleCreateRequest = () => {
    // Search by serialNumber OR qrCode
    const matchedEquipment = equipment.find(eq => eq.serialNumber === scannedCode || eq.qrCode === scannedCode);
    if (matchedEquipment) {
      navigate(`/maintenance?equipment=${matchedEquipment.id}&newRequest=true`);
    }
  };

  const matchedEquipment = scannedCode 
    ? equipment.find(eq => eq.serialNumber === scannedCode || eq.qrCode === scannedCode)
    : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">QR Scanner</h1>
        <p className="text-muted-foreground mt-0.5 sm:mt-1 text-sm sm:text-base">
          Scan equipment QR codes or Barcodes to quickly create maintenance requests
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Scanner Area */}
        <Card className="glass-card">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square max-w-sm mx-auto bg-secondary/30 rounded-xl overflow-hidden flex items-center justify-center">
              {scanning ? (
                <BarcodeScanner 
                  onScan={handleScan} 
                  onClose={() => setScanning(false)}
                  className="w-full h-full absolute inset-0"
                />
              ) : (
                <div className="text-center space-y-3 sm:space-y-4 p-4 sm:p-8">
                  <QrCode className="h-16 w-16 sm:h-24 sm:w-24 text-muted-foreground/50 mx-auto" />
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Position the QR code or Barcode within the frame
                  </p>
                  <Button onClick={() => setScanning(true)} className="gap-2 w-full sm:w-auto">
                    <Camera className="h-4 w-4" />
                    Start Scanning
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Result Area */}
        <Card className="glass-card">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <QrCode className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Scan Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {matchedEquipment ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-status-success/10 border border-status-success/20 text-status-success text-sm">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Equipment found!</span>
                </div>

                <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="text-[10px] sm:text-sm text-muted-foreground">Equipment Name</p>
                    <p className="font-semibold text-sm sm:text-base">{matchedEquipment.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-sm text-muted-foreground">Serial Number</p>
                    <p className="font-mono text-sm">{matchedEquipment.serialNumber}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <p className="text-[10px] sm:text-sm text-muted-foreground">Location</p>
                      <p className="text-sm">{matchedEquipment.location}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-sm text-muted-foreground">Category</p>
                      <p className="text-sm">{matchedEquipment.category}</p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleCreateRequest} className="w-full gap-2">
                  Create Maintenance Request
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                <QrCode className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                <p className="text-sm">Scan a QR code or Barcode to see equipment details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="glass-card">
        <CardContent className="py-4 sm:pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary font-bold text-xs sm:text-sm flex-shrink-0">
                1
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm sm:text-base">Position QR Code</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Align the equipment QR code within the scanner frame
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary font-bold text-xs sm:text-sm flex-shrink-0">
                2
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm sm:text-base">Verify Equipment</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Confirm the scanned equipment details are correct
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary font-bold text-xs sm:text-sm flex-shrink-0">
                3
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm sm:text-base">Create Request</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Click to create a new maintenance request
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
