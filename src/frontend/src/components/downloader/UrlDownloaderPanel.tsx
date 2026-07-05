import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFileManager } from "@/hooks/useFileManager";
import { fetchAndDownload } from "@/lib/downloader/fetchAndDownload";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function UrlDownloaderPanel() {
  const { saveToManager } = useFileManager();
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saveOption, setSaveOption] = useState(false);

  const handleDownload = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }
    setIsDownloading(true);
    setError(null);
    setSuccess(null);
    setProgress(10);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      setProgress(50);
      const blob = await response.blob();
      setProgress(80);
      const urlParts = url.split("/");
      const filename =
        urlParts[urlParts.length - 1].split("?")[0] || `download_${Date.now()}`;

      if (saveOption) {
        const reader = new FileReader();
        reader.onload = () => {
          saveToManager({
            name: filename,
            type: blob.type || "application/octet-stream",
            size: blob.size,
            dataUrl: reader.result as string,
          });
        };
        reader.readAsDataURL(blob);
      }

      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);

      setProgress(100);
      setSuccess(
        `Downloaded: ${filename}${saveOption ? " (saved to File Manager)" : ""}`,
      );
      setUrl("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Download failed — CORS restrictions may be blocking this URL.",
      );
    } finally {
      setIsDownloading(false);
      setTimeout(() => setProgress(0), 1200);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="download-url">Media URL</Label>
          <motion.div
            animate={isFocused ? { scale: 1.01, y: -1 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="mt-2"
            style={
              isFocused
                ? { filter: "drop-shadow(0 0 8px rgba(6,182,212,0.3))" }
                : {}
            }
          >
            <Input
              data-ocid="downloader.url.input"
              id="download-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="https://example.com/video.mp4"
              disabled={isDownloading}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleDownload();
              }}
              className="transition-all duration-150"
            />
          </motion.div>
          <p className="text-sm text-muted-foreground mt-2">
            Works best with direct media links (.mp4, .mp3, .jpg, etc.)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            data-ocid="downloader.save_to_manager.checkbox"
            id="save-to-manager"
            type="checkbox"
            checked={saveOption}
            onChange={(e) => setSaveOption(e.target.checked)}
            className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
          />
          <Label htmlFor="save-to-manager" className="cursor-pointer text-sm">
            Also save to File Manager after download
          </Label>
        </div>
      </div>

      <AnimatePresence>
        {isDownloading && progress > 0 && (
          <motion.div
            data-ocid="downloader.loading_state"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1"
          >
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Downloading…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "#06B6D4" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            data-ocid="downloader.error_state"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <motion.div
            data-ocid="downloader.success_state"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
        <Button
          data-ocid="downloader.primary_button"
          onClick={handleDownload}
          disabled={!url.trim() || isDownloading}
          className="w-full"
          size="lg"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Downloading…
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Media
            </>
          )}
        </Button>
      </motion.div>

      <Alert className="border-amber-500/30 bg-amber-500/5">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-500 text-sm">
          CORS & DRM Limitations
        </AlertTitle>
        <AlertDescription className="text-xs">
          Many platforms (YouTube, Instagram, X/Twitter) block browser downloads
          via CORS, DRM, or authentication. This tool works best with direct,
          publicly-accessible media file URLs.
        </AlertDescription>
      </Alert>
    </div>
  );
}
