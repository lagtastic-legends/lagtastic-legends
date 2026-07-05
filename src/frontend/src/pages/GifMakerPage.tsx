import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { makeGif } from "@/lib/ffmpeg/videoTools";
import { Download, ImagePlay, Loader2, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

export function GifMakerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fps, setFps] = useState("10");
  const [width, setWidth] = useState("480");
  const [loop, setLoop] = useState("0");
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setGifUrl(null);
      setError("");
    }
  };

  const convert = async () => {
    if (!file) return;
    setIsConverting(true);
    setProgress(0);
    setError("");
    try {
      const blob = await makeGif(
        file,
        {
          fps: Number(fps),
          width: Number(width),
          loop: Number(loop),
        },
        (p) => setProgress(p),
      );
      setGifUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError("GIF creation failed. Ensure FFmpeg WASM core is accessible.");
      console.error(e);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-bold tracking-tight">GIF Maker</h2>
        <p className="text-muted-foreground">
          Convert video clips into shareable animated GIFs
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImagePlay className="w-5 h-5" /> GIF Creator
            </CardTitle>
            <CardDescription>
              Upload a short video clip and convert it to an animated GIF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <button
              type="button"
              data-ocid="gif.dropzone"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary hover:bg-accent/30 transition-all duration-200"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFile}
              />
              <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              {file ? (
                <p className="font-medium">{file.name}</p>
              ) : (
                <>
                  <p className="font-medium">Click or drop a video file</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    MP4, MOV, AVI, MKV supported
                  </p>
                </>
              )}
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Frame Rate (FPS)</Label>
                <Select value={fps} onValueChange={setFps}>
                  <SelectTrigger data-ocid="gif.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 FPS (Small)</SelectItem>
                    <SelectItem value="10">10 FPS (Balanced)</SelectItem>
                    <SelectItem value="15">15 FPS (Smooth)</SelectItem>
                    <SelectItem value="24">24 FPS (Cinematic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Width</Label>
                <Select value={width} onValueChange={setWidth}>
                  <SelectTrigger data-ocid="gif.width.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="320">320px (Small)</SelectItem>
                    <SelectItem value="480">480px (Medium)</SelectItem>
                    <SelectItem value="640">640px (Large)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Loop</Label>
                <Select value={loop} onValueChange={setLoop}>
                  <SelectTrigger data-ocid="gif.loop.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Infinite Loop</SelectItem>
                    <SelectItem value="1">Loop Once</SelectItem>
                    <SelectItem value="3">Loop 3 Times</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              data-ocid="gif.primary_button"
              onClick={convert}
              disabled={!file || isConverting}
              className="w-full"
              size="lg"
            >
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                "Create GIF"
              )}
            </Button>

            <AnimatePresence>
              {isConverting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span>Converting...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress data-ocid="gif.loading_state" value={progress} />
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <p
                data-ocid="gif.error_state"
                className="text-destructive text-sm text-center"
              >
                {error}
              </p>
            )}

            <AnimatePresence>
              {gifUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div
                    data-ocid="gif.success_state"
                    className="rounded-xl overflow-hidden border border-border"
                  >
                    <img
                      src={gifUrl}
                      alt="Generated GIF"
                      className="w-full h-auto"
                    />
                  </div>
                  <a href={gifUrl} download="output.gif">
                    <Button
                      data-ocid="gif.secondary_button"
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <Download className="mr-2 h-4 w-4" /> Download GIF
                    </Button>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
