import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { muteVideo } from "@/lib/ffmpeg/videoTools";
import { Download, Loader2, Upload, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

export function MuteVideoPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setOutputUrl(null);
      setError("");
    }
  };

  const mute = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    setError("");
    setOutputUrl(null);
    try {
      console.log("[MuteVideoPanel] Starting mute for", file.name);
      const blob = await muteVideo(file, (p) => setProgress(p));
      console.log("[MuteVideoPanel] Mute succeeded. Blob size:", blob.size);
      setOutputUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error("[MuteVideoPanel] Mute failed:", e);
      const msg =
        e instanceof Error
          ? e.message
          : "Failed to mute video. Ensure FFmpeg WASM core is accessible.";
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        data-ocid="mute.dropzone"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary hover:bg-accent/30 transition-all duration-200"
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFile}
        />
        <VolumeX className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
        {file ? (
          <p className="font-medium">{file.name}</p>
        ) : (
          <>
            <p className="font-medium">Click to upload a video</p>
            <p className="text-sm text-muted-foreground mt-1">
              MP4, MOV, AVI, MKV supported
            </p>
          </>
        )}
      </button>

      <Button
        data-ocid="mute.primary_button"
        onClick={mute}
        disabled={!file || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Removing Audio...
          </>
        ) : (
          <>
            <VolumeX className="mr-2 h-4 w-4" />
            Remove Audio Track
          </>
        )}
      </Button>

      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>{progress}%</span>
            </div>
            <Progress data-ocid="mute.loading_state" value={progress} />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p data-ocid="mute.error_state" className="text-destructive text-sm">
          {error}
        </p>
      )}

      <AnimatePresence>
        {outputUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <a href={outputUrl} download={`muted_${file?.name}`}>
              <Button
                data-ocid="mute.secondary_button"
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" /> Download Muted Video
              </Button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
