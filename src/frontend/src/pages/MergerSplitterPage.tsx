import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mergeMedia, splitMedia } from "@/lib/ffmpeg/videoTools";
import { Combine, Download, Loader2, Scissors, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

interface OutputFile {
  name: string;
  url: string;
}

export function MergerSplitterPage() {
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [mergeProgress, setMergeProgress] = useState(0);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [mergeError, setMergeError] = useState("");

  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [splitMode, setSplitMode] = useState("timepoints");
  const [timepoints, setTimepoints] = useState("0:30,1:00");
  const [equalParts, setEqualParts] = useState("3");
  const [splitProgress, setSplitProgress] = useState(0);
  const [isSplitting, setIsSplitting] = useState(false);
  const [segments, setSegments] = useState<OutputFile[]>([]);
  const [splitError, setSplitError] = useState("");

  const mergeInputRef = useRef<HTMLInputElement>(null);
  const splitInputRef = useRef<HTMLInputElement>(null);

  const addMergeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMergeFiles((prev) => [...prev, ...files]);
    setMergedUrl(null);
  };

  const removeMergeFile = (idx: number) =>
    setMergeFiles((prev) => prev.filter((_, i) => i !== idx));

  const merge = async () => {
    if (mergeFiles.length < 2) return;
    setIsMerging(true);
    setMergeProgress(0);
    setMergeError("");
    try {
      const blob = await mergeMedia(mergeFiles, (p) => setMergeProgress(p));
      setMergedUrl(URL.createObjectURL(blob));
    } catch (e) {
      setMergeError("Merge failed. Ensure all files are the same format.");
      console.error(e);
    } finally {
      setIsMerging(false);
    }
  };

  const split = async () => {
    if (!splitFile) return;
    setIsSplitting(true);
    setSplitProgress(0);
    setSplitError("");
    setSegments([]);
    try {
      const points = timepoints
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const results = await splitMedia(splitFile, points, (done, total) =>
        setSplitProgress(Math.round((done / total) * 100)),
      );
      setSegments(
        results.map((r) => ({
          name: r.name,
          url: URL.createObjectURL(r.blob),
        })),
      );
    } catch (e) {
      setSplitError("Split failed. Please try again.");
      console.error(e);
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-bold tracking-tight">Merger & Splitter</h2>
        <p className="text-muted-foreground">
          Combine multiple files or split one into segments
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Audio &amp; Video Tools</CardTitle>
            <CardDescription>
              Merge multiple files together or split a single file into parts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="merge">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  data-ocid="merger.merge.tab"
                  value="merge"
                  className="flex items-center gap-2"
                >
                  <Combine className="w-4 h-4" /> Merge
                </TabsTrigger>
                <TabsTrigger
                  data-ocid="merger.split.tab"
                  value="split"
                  className="flex items-center gap-2"
                >
                  <Scissors className="w-4 h-4" /> Split
                </TabsTrigger>
              </TabsList>

              <TabsContent value="merge" className="mt-6 space-y-4">
                <button
                  type="button"
                  data-ocid="merger.merge.dropzone"
                  onClick={() => mergeInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-accent/30 transition-all duration-200"
                >
                  <input
                    ref={mergeInputRef}
                    type="file"
                    accept="audio/*,video/*"
                    multiple
                    className="hidden"
                    onChange={addMergeFiles}
                  />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium">Click to add files</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add 2 or more audio/video files
                  </p>
                </button>

                <AnimatePresence>
                  {mergeFiles.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      {mergeFiles.map((f, i) => (
                        <motion.div
                          key={`${f.name}-${i}`}
                          data-ocid={`merger.merge.item.${i + 1}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border"
                        >
                          <span className="text-sm font-medium truncate">
                            {f.name}
                          </span>
                          <Button
                            data-ocid={`merger.merge.delete_button.${i + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMergeFile(i)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  data-ocid="merger.merge.primary_button"
                  onClick={merge}
                  disabled={mergeFiles.length < 2 || isMerging}
                  className="w-full"
                  size="lg"
                >
                  {isMerging ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Merging...
                    </>
                  ) : (
                    "Merge Files"
                  )}
                </Button>

                {isMerging && (
                  <Progress
                    data-ocid="merger.merge.loading_state"
                    value={mergeProgress}
                  />
                )}
                {mergeError && (
                  <p
                    data-ocid="merger.merge.error_state"
                    className="text-destructive text-sm"
                  >
                    {mergeError}
                  </p>
                )}

                {mergedUrl && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <a
                      href={mergedUrl}
                      download={`merged.${mergeFiles[0]?.name.split(".").pop() || "mp4"}`}
                    >
                      <Button
                        data-ocid="merger.merge.secondary_button"
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download Merged
                        File
                      </Button>
                    </a>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="split" className="mt-6 space-y-4">
                <button
                  type="button"
                  data-ocid="merger.split.dropzone"
                  onClick={() => splitInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-accent/30 transition-all duration-200"
                >
                  <input
                    ref={splitInputRef}
                    type="file"
                    accept="audio/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setSplitFile(f);
                        setSegments([]);
                      }
                    }}
                  />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  {splitFile ? (
                    <p className="font-medium">{splitFile.name}</p>
                  ) : (
                    <p className="font-medium">
                      Click to upload a file to split
                    </p>
                  )}
                </button>

                <div className="space-y-3">
                  <Label>Split Mode</Label>
                  <Select value={splitMode} onValueChange={setSplitMode}>
                    <SelectTrigger data-ocid="merger.split.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="timepoints">By Time Points</SelectItem>
                      <SelectItem value="equal">Equal Parts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {splitMode === "timepoints" ? (
                  <div className="space-y-2">
                    <Label>Time Points (e.g. 0:30,1:45)</Label>
                    <Input
                      data-ocid="merger.split.input"
                      value={timepoints}
                      onChange={(e) => setTimepoints(e.target.value)}
                      placeholder="0:30,1:45,3:00"
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated timestamps to split at
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Number of Parts</Label>
                    <Input
                      data-ocid="merger.split.parts.input"
                      type="number"
                      value={equalParts}
                      onChange={(e) => setEqualParts(e.target.value)}
                      min="2"
                      max="20"
                    />
                  </div>
                )}

                <Button
                  data-ocid="merger.split.primary_button"
                  onClick={split}
                  disabled={!splitFile || isSplitting}
                  className="w-full"
                  size="lg"
                >
                  {isSplitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Splitting...
                    </>
                  ) : (
                    "Split File"
                  )}
                </Button>

                {isSplitting && (
                  <Progress
                    data-ocid="merger.split.loading_state"
                    value={splitProgress}
                  />
                )}
                {splitError && (
                  <p
                    data-ocid="merger.split.error_state"
                    className="text-destructive text-sm"
                  >
                    {splitError}
                  </p>
                )}

                <AnimatePresence>
                  {segments.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <p className="font-medium text-sm">Output Segments:</p>
                      {segments.map((seg, i) => (
                        <div
                          key={`${seg.name}-${i}`}
                          data-ocid={`merger.split.item.${i + 1}`}
                          className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border"
                        >
                          <span className="text-sm">{seg.name}</span>
                          <a href={seg.url} download={seg.name}>
                            <Button
                              data-ocid={`merger.split.secondary_button.${i + 1}`}
                              variant="outline"
                              size="sm"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
