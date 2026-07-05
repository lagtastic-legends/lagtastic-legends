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
import { Switch } from "@/components/ui/switch";
import {
  type RingtoneFormat,
  createRingtone,
} from "@/lib/ringtone/ringtonePipeline";
import { validateTrim } from "@/lib/validation/ringtoneValidation";
import { Download, Loader2, Pause, Play, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function WaveformEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(30);
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeInDuration, setFadeInDuration] = useState(1);
  const [fadeOutDuration, setFadeOutDuration] = useState(1);
  const [format, setFormat] = useState<RingtoneFormat>("mp3");
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
        setEndTime(Math.min(30, audio.duration));
      });

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setOutputBlob(null);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleExport = async () => {
    if (!file) {
      setError("Please select an audio or video file first");
      return;
    }

    const validationError = validateTrim(
      startTime,
      endTime,
      duration,
      fadeIn,
      fadeOut,
      fadeInDuration,
      fadeOutDuration,
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const blob = await createRingtone(
        file,
        startTime,
        endTime,
        fadeIn ? fadeInDuration : 0,
        fadeOut ? fadeOutDuration : 0,
        format,
        (p) => setProgress(p),
      );
      setOutputBlob(blob);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob || !file) return;

    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}_ringtone.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="animate-fade-in">
          <Label htmlFor="audio-file">Audio/Video File</Label>
          <div className="mt-2">
            <input
              ref={fileInputRef}
              id="audio-file"
              type="file"
              accept="audio/*,video/*"
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
              {file ? file.name : "Choose Audio/Video File"}
            </Button>
          </div>
        </div>

        {audioUrl && (
          <div className="p-4 border rounded-lg bg-muted/30 animate-fade-in">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
            >
              <track kind="captions" />
            </audio>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                onClick={togglePlayPause}
                className="transition-all duration-200 hover:scale-110"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <div className="flex-1">
                <p className="text-sm font-medium">Preview Audio</p>
                <p className="text-xs text-muted-foreground">
                  Duration: {duration.toFixed(1)}s
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 animate-fade-in animation-delay-50">
          <div>
            <Label htmlFor="start-time">Start Time (s)</Label>
            <Input
              id="start-time"
              type="number"
              value={startTime}
              onChange={(e) =>
                setStartTime(Number.parseFloat(e.target.value) || 0)
              }
              disabled={!file || isProcessing}
              min="0"
              max={duration}
              step="0.1"
              className="transition-all duration-150 focus:scale-[1.01]"
            />
          </div>
          <div>
            <Label htmlFor="end-time">End Time (s)</Label>
            <Input
              id="end-time"
              type="number"
              value={endTime}
              onChange={(e) =>
                setEndTime(Number.parseFloat(e.target.value) || 0)
              }
              disabled={!file || isProcessing}
              min="0"
              max={duration}
              step="0.1"
              className="transition-all duration-150 focus:scale-[1.01]"
            />
          </div>
        </div>

        <div className="space-y-3 animate-fade-in animation-delay-100">
          <div className="flex items-center justify-between">
            <Label htmlFor="fade-in">Fade In</Label>
            <Switch
              id="fade-in"
              checked={fadeIn}
              onCheckedChange={setFadeIn}
              disabled={isProcessing}
              className="transition-all duration-150"
            />
          </div>
          {fadeIn && (
            <div className="animate-fade-in">
              <Input
                type="number"
                value={fadeInDuration}
                onChange={(e) =>
                  setFadeInDuration(Number.parseFloat(e.target.value) || 0)
                }
                disabled={isProcessing}
                min="0.1"
                max="5"
                step="0.1"
                placeholder="Fade in duration (s)"
                className="transition-all duration-150 focus:scale-[1.01]"
              />
            </div>
          )}
        </div>

        <div className="space-y-3 animate-fade-in animation-delay-150">
          <div className="flex items-center justify-between">
            <Label htmlFor="fade-out">Fade Out</Label>
            <Switch
              id="fade-out"
              checked={fadeOut}
              onCheckedChange={setFadeOut}
              disabled={isProcessing}
              className="transition-all duration-150"
            />
          </div>
          {fadeOut && (
            <div className="animate-fade-in">
              <Input
                type="number"
                value={fadeOutDuration}
                onChange={(e) =>
                  setFadeOutDuration(Number.parseFloat(e.target.value) || 0)
                }
                disabled={isProcessing}
                min="0.1"
                max="5"
                step="0.1"
                placeholder="Fade out duration (s)"
                className="transition-all duration-150 focus:scale-[1.01]"
              />
            </div>
          )}
        </div>

        <div className="animate-fade-in animation-delay-200">
          <Label htmlFor="output-format">Output Format</Label>
          <Select
            value={format}
            onValueChange={(v) => setFormat(v as RingtoneFormat)}
            disabled={isProcessing}
          >
            <SelectTrigger
              id="output-format"
              className="transition-all duration-150"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp3">MP3</SelectItem>
              <SelectItem value="m4r">M4R (iPhone)</SelectItem>
              <SelectItem value="ogg">OGG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isProcessing && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-sm">
            <span>Creating ringtone...</span>
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
          onClick={handleExport}
          disabled={!file || isProcessing}
          className="flex-1 transition-all duration-200 hover:scale-[1.02]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            "Export Ringtone"
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
