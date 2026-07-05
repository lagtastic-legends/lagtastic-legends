import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { compressVideo } from "@/lib/ffmpeg/videoTools";
import { validateBitrate } from "@/lib/validation/videoValidation";
import { Download, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

type Resolution = "1080p" | "720p" | "480p" | "360p";

export function VideoCompressPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [resolution, setResolution] = useState<Resolution>("720p");
  const [bitrate, setBitrate] = useState("1000");
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [inputSize, setInputSize] = useState<number | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setInputSize(selectedFile.size);
      setError(null);
      setOutputBlob(null);
      setOutputSize(null);
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setError("Please select a video file first");
      return;
    }

    const bitrateError = validateBitrate(bitrate);
    if (bitrateError) {
      setError(bitrateError);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setOutputBlob(null);
    setOutputSize(null);

    try {
      console.log(
        "[VideoCompressPanel] Starting compression for",
        file.name,
        "resolution:",
        resolution,
        "bitrate:",
        bitrate,
      );
      const blob = await compressVideo(
        file,
        resolution,
        Number.parseInt(bitrate),
        (p) => setProgress(p),
      );
      console.log(
        "[VideoCompressPanel] Compression succeeded. Blob size:",
        blob.size,
      );
      setOutputBlob(blob);
      setOutputSize(blob.size);
      setProgress(100);
    } catch (err) {
      console.error("[VideoCompressPanel] Compression failed:", err);
      const msg = err instanceof Error ? err.message : "Compression failed";
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
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}_compressed.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="animate-fade-in">
          <Label htmlFor="video-compress-file">Video File</Label>
          <div className="mt-2">
            <input
              ref={fileInputRef}
              id="video-compress-file"
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
          {inputSize && (
            <p className="text-sm text-muted-foreground mt-2">
              Input size: {formatSize(inputSize)}
            </p>
          )}
        </div>

        <div className="animate-fade-in animation-delay-50">
          <Label htmlFor="resolution">Target Resolution</Label>
          <Select
            value={resolution}
            onValueChange={(v) => setResolution(v as Resolution)}
            disabled={isProcessing}
          >
            <SelectTrigger
              id="resolution"
              className="transition-all duration-150"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1080p">1080p (1920x1080)</SelectItem>
              <SelectItem value="720p">720p (1280x720)</SelectItem>
              <SelectItem value="480p">480p (854x480)</SelectItem>
              <SelectItem value="360p">360p (640x360)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="animate-fade-in animation-delay-100">
          <Label htmlFor="bitrate">Target Bitrate (kbps)</Label>
          <Input
            id="bitrate"
            type="number"
            value={bitrate}
            onChange={(e) => setBitrate(e.target.value)}
            placeholder="1000"
            disabled={isProcessing}
            min="100"
            max="10000"
            className="transition-all duration-150 focus:scale-[1.01]"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Recommended: 500-2000 kbps
          </p>
        </div>
      </div>

      {isProcessing && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-sm">
            <span>Compressing...</span>
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

      {outputSize && inputSize && (
        <div className="animate-fade-in">
          <Alert>
            <AlertDescription>
              Compression complete! Output size: {formatSize(outputSize)}(
              {((1 - outputSize / inputSize) * 100).toFixed(1)}% reduction)
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleCompress}
          disabled={!file || isProcessing}
          className="flex-1 transition-all duration-200 hover:scale-[1.02]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Compressing...
            </>
          ) : (
            "Compress Video"
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
