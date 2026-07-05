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
import {
  type AudioFormat,
  type QualityPreset,
  extractAudio,
} from "@/lib/ffmpeg/audioExtractor";
import { Download, Loader2, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

const QUALITY_DESCRIPTIONS: Record<QualityPreset, string> = {
  lossless: "Lossless/Hi-Fi - Uncompressed audio (WAV/FLAC)",
  high: "High Quality - 320kbps MP3 or 256kbps AAC",
  standard: "Standard Quality - 192kbps MP3 (balanced size/quality)",
  low: "Low Quality - 64-128kbps MP3 (smaller file size)",
};

export function AudioExtractPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<AudioFormat>("mp3");
  const [quality, setQuality] = useState<QualityPreset>("high");
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
      console.log("[AudioExtractPanel] Starting conversion for", file.name);
      const blob = await extractAudio(file, format, quality, (p) =>
        setProgress(p),
      );
      console.log(
        "[AudioExtractPanel] Conversion succeeded. Blob size:",
        blob.size,
      );
      setOutputBlob(blob);
      setProgress(100);
    } catch (err) {
      console.error("[AudioExtractPanel] Conversion failed:", err);
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
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Label htmlFor="video-file">Video File</Label>
          <div className="mt-2">
            <input
              ref={fileInputRef}
              id="video-file"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <Label htmlFor="format">Output Format</Label>
          <Select
            value={format}
            onValueChange={(v) => setFormat(v as AudioFormat)}
            disabled={isProcessing}
          >
            <SelectTrigger id="format" className="transition-all duration-150">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp3">MP3</SelectItem>
              <SelectItem value="wav">WAV</SelectItem>
              <SelectItem value="flac">FLAC</SelectItem>
              <SelectItem value="aac">AAC</SelectItem>
              <SelectItem value="ogg">OGG</SelectItem>
              <SelectItem value="m4a">M4A</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Label htmlFor="quality">Quality Preset</Label>
          <Select
            value={quality}
            onValueChange={(v) => setQuality(v as QualityPreset)}
            disabled={isProcessing}
          >
            <SelectTrigger id="quality" className="transition-all duration-150">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lossless">Lossless/Hi-Fi</SelectItem>
              <SelectItem value="high">High Quality</SelectItem>
              <SelectItem value="standard">Standard Quality</SelectItem>
              <SelectItem value="low">Low Quality</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-2">
            {QUALITY_DESCRIPTIONS[quality]}
          </p>
        </motion.div>
      </div>

      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span>Converting...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="progress-smooth" />
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
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
            "Convert to Audio"
          )}
        </Button>

        {outputBlob && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="transition-all duration-200 hover:scale-105"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
