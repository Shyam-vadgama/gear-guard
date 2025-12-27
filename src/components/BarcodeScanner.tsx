import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { NotFoundException } from '@zxing/library';
import { Button } from '@/components/ui/button';
import { X, Camera, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onClose?: () => void;
  className?: string;
}

export function BarcodeScanner({ onScan, onClose, className }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let mounted = true;

    async function startScanning() {
      try {
        const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        
        if (videoInputDevices.length === 0) {
          if (mounted) {
            setHasCamera(false);
            setError("No camera found");
          }
          return;
        }

        if (mounted) setHasCamera(true);

        // Select the rear camera if available, otherwise the first one
        const selectedDeviceId = videoInputDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        )?.deviceId || videoInputDevices[0].deviceId;

        if (!videoRef.current) return;

        const controls = await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result && mounted) {
              onScan(result.getText());
              // Stop scanning after success if needed, or let parent handle it
              // controls.stop(); 
            }
            if (err && !(err instanceof NotFoundException)) {
              console.error(err);
            }
          }
        );
        
        controlsRef.current = controls;

      } catch (err) {
        console.error("Error starting scanner:", err);
        if (mounted) setError("Failed to start camera");
      }
    }

    startScanning();

    return () => {
      mounted = false;
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, [onScan]);

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Camera View */}
      <div className="relative aspect-square sm:aspect-video w-full flex items-center justify-center bg-black">
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay guides */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-primary/50 rounded-lg relative">
             <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-primary -ml-1 -mt-1"></div>
             <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-primary -mr-1 -mt-1"></div>
             <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-primary -ml-1 -bt-1"></div>
             <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-primary -mr-1 -bt-1"></div>
          </div>
        </div>

        {/* Status/Error Messages */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-4 text-center">
            <div className="space-y-4">
              <Camera className="h-12 w-12 mx-auto text-destructive" />
              <p>{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="text-black bg-white hover:bg-white/90">
                <RefreshCw className="mr-2 h-4 w-4" /> Retry
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Close Button */}
      {onClose && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      )}
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm pointer-events-none">
        Point camera at a barcode or QR code
      </div>
    </div>
  );
}
