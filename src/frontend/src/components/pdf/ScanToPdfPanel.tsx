import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Download, Loader2, ScanLine } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { PDFDocument } from "pdf-lib";
import { useEffect, useRef, useState } from "react";

export function ScanToPdfPanel() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    setIsCameraOn(false);
  };

  const startCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraOn(true);
    } catch (e) {
      setCameraError(
        "Camera access denied or not available. Please allow camera permissions.",
      );
      console.error(e);
    }
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const enhanced = Math.min(255, Math.max(0, (gray - 128) * 1.5 + 128));
      data[i] = enhanced;
      data[i + 1] = enhanced;
      data[i + 2] = enhanced;
    }
    ctx.putImageData(imageData, 0, 0);
    setCaptured(canvas.toDataURL("image/jpeg", 0.92));
    stopCamera();
  };

  const convertToPdf = async () => {
    if (!captured) return;
    setIsConverting(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const base64 = captured.split(",")[1];
      const imageBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const image = await pdfDoc.embedJpg(imageBytes);
      const { width, height } = image.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });
      setOutputUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {!isCameraOn ? (
          <Button
            data-ocid="scantopdf.primary_button"
            onClick={startCamera}
            className="flex-1"
            size="lg"
          >
            <Camera className="mr-2 h-4 w-4" /> Start Camera
          </Button>
        ) : (
          <>
            <Button
              data-ocid="scantopdf.capture.button"
              onClick={capture}
              className="flex-1"
              size="lg"
            >
              <ScanLine className="mr-2 h-4 w-4" /> Capture Document
            </Button>
            <Button
              data-ocid="scantopdf.stop.button"
              variant="outline"
              onClick={stopCamera}
            >
              <CameraOff className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {cameraError && (
        <p
          data-ocid="scantopdf.error_state"
          className="text-destructive text-sm"
        >
          {cameraError}
        </p>
      )}

      <AnimatePresence>
        {isCameraOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl overflow-hidden border border-border"
          >
            <video ref={videoRef} className="w-full h-auto" playsInline muted>
              <track kind="captions" />
            </video>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />

      <AnimatePresence>
        {captured && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-xl overflow-hidden border border-border">
              <img
                src={captured}
                alt="Captured document"
                className="w-full h-auto"
              />
            </div>
            <div className="flex gap-3">
              <Button
                data-ocid="scantopdf.convert.button"
                onClick={convertToPdf}
                disabled={isConverting}
                className="flex-1"
                size="lg"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  "Convert to PDF"
                )}
              </Button>
              <Button
                data-ocid="scantopdf.recapture.button"
                variant="outline"
                onClick={() => {
                  setCaptured(null);
                  setOutputUrl(null);
                  startCamera();
                }}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {outputUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <a href={outputUrl} download="scanned-document.pdf">
              <Button
                data-ocid="scantopdf.secondary_button"
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" /> Download Scanned PDF
              </Button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
