import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type VideoFormat, convertVideoFormat } from "@/lib/ffmpeg/videoTools";
import { Download, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

export function VideoConvertPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<VideoFormat>("mp4");
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setOutputBlob(null);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Please select a video file first");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setOutputBlob(null);

    try {
      console.log(
        "[VideoConvertPanel] Starting format conversion for",
        file.name,
        "to",
        format,
      );
      const blob = await convertVideoFormat(file, format, (p) =>
        setProgress(p),
      );
      console.log(
        "[VideoConvertPanel] Format conversion succeeded. Blob size:",
        blob.size,
      );
      setOutputBlob(blob);
      setProgress(100);
    } catch (err) {
      console.error("[VideoConvertPanel] Format conversion failed:", err);
      const msg = err instanceof Error ? err.message : "Conversion failed";
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob || !file) return;

    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="animate-fade-in">
          <Label htmlFor="video-convert-file">Video File</Label>
          <div className="mt-2">
            <input
              ref={fileInputRef}
              id="video-convert-file"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
              disabled={isProcessing}
            >
              <Upload className="w-4 h-4 mr-2" />
              {file ? file.name : "Choose Video File"}
            </Button>
          </div>
        </div>

        <div className="animate-fade-in animation-delay-50">
          <Label htmlFor="video-format">Target Format</Label>
          <Select
            value={format}
            onValueChange={(v) => setFormat(v as VideoFormat)}
            disabled={isProcessing}
          >
            <SelectTrigger
              id="video-format"
              className="transition-all duration-150"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4">MP4</SelectItem>
              <SelectItem value="mov">MOV</SelectItem>
              <SelectItem value="avi">AVI</SelectItem>
              <SelectItem value="mkv">MKV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isProcessing && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-sm">
            <span>Converting...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="progress-smooth" />
        </div>
      )}

      {error && (
        <div className="animate-fade-in">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleConvert}
          disabled={!file || isProcessing}
          className="flex-1 transition-all duration-200 hover:scale-[1.02]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            "Convert Format"
          )}
        </Button>

        {outputBlob && (
          <Button
            onClick={handleDownload}
            variant="secondary"
            className="transition-all duration-200 hover:scale-105 animate-scale-in"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}
      </div>
    </div>
  );
}
