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
import { Download, Loader2, Tag, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

function encodeText(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function syncsafeInt(n: number): Uint8Array {
  const bytes = new Uint8Array(4);
  bytes[3] = n & 0x7f;
  const a = n >> 7;
  bytes[2] = a & 0x7f;
  const b = a >> 7;
  bytes[1] = b & 0x7f;
  const c = b >> 7;
  bytes[0] = c & 0x7f;
  return bytes;
}

function int32be(n: number): Uint8Array {
  return new Uint8Array([
    (n >> 24) & 0xff,
    (n >> 16) & 0xff,
    (n >> 8) & 0xff,
    n & 0xff,
  ]);
}

function makeTextFrame(id: string, text: string): Uint8Array {
  if (!text) return new Uint8Array(0);
  const idBytes = new TextEncoder().encode(id);
  const textBytes = encodeText(text);
  const size = 1 + textBytes.length;
  const header = new Uint8Array(10);
  header.set(idBytes, 0);
  header.set(int32be(size), 4);
  const frame = new Uint8Array(10 + size);
  frame.set(header, 0);
  frame[10] = 0x00; // encoding
  frame.set(textBytes, 11);
  return frame;
}

async function makeApicFrame(imageFile: File): Promise<Uint8Array> {
  const mime = encodeText(imageFile.type);
  const imgData = new Uint8Array(await imageFile.arrayBuffer());
  const desc = new Uint8Array(1); // empty description + null
  const size = 1 + mime.length + 1 + 1 + desc.length + imgData.length;
  const header = new Uint8Array(10);
  header.set(encodeText("APIC"), 0);
  header.set(int32be(size), 4);
  const frame = new Uint8Array(10 + size);
  let offset = 0;
  frame.set(header, offset);
  offset += 10;
  frame[offset++] = 0x00; // encoding
  frame.set(mime, offset);
  offset += mime.length;
  frame[offset++] = 0x00; // null
  frame[offset++] = 0x03; // front cover
  frame.set(desc, offset);
  offset += desc.length;
  frame.set(imgData, offset);
  return frame;
}

async function writeId3Tags(
  audioFile: File,
  tags: {
    title: string;
    artist: string;
    album: string;
    year: string;
    genre: string;
  },
  coverFile: File | null,
): Promise<Uint8Array> {
  let audioData = new Uint8Array(await audioFile.arrayBuffer());
  // Strip existing ID3v2 header
  if (audioData[0] === 0x49 && audioData[1] === 0x44 && audioData[2] === 0x33) {
    const existingSize =
      ((audioData[6] & 0x7f) << 21) |
      ((audioData[7] & 0x7f) << 14) |
      ((audioData[8] & 0x7f) << 7) |
      (audioData[9] & 0x7f);
    audioData = audioData.slice(10 + existingSize);
  }

  const frames: Uint8Array[] = [
    makeTextFrame("TIT2", tags.title),
    makeTextFrame("TPE1", tags.artist),
    makeTextFrame("TALB", tags.album),
    makeTextFrame("TYER", tags.year),
    makeTextFrame("TCON", tags.genre),
  ].filter((f) => f.length > 0);

  if (coverFile) {
    frames.push(await makeApicFrame(coverFile));
  }

  const framesSize = frames.reduce((acc, f) => acc + f.length, 0);
  const id3Header = new Uint8Array(10);
  id3Header.set(encodeText("ID3"), 0);
  id3Header[3] = 0x03; // version 2.3
  id3Header[4] = 0x00;
  id3Header[5] = 0x00; // flags
  id3Header.set(syncsafeInt(framesSize), 6);

  const result = new Uint8Array(10 + framesSize + audioData.length);
  let offset = 0;
  result.set(id3Header, offset);
  offset += 10;
  for (const frame of frames) {
    result.set(frame, offset);
    offset += frame.length;
  }
  result.set(audioData, offset);
  return result;
}

export function TagEditorPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tags, setTags] = useState({
    title: "",
    artist: "",
    album: "",
    year: "",
    genre: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setAudioFile(f);
      setDownloadUrl(null);
    }
  };

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    }
  };

  const save = async () => {
    if (!audioFile) return;
    setIsSaving(true);
    try {
      const result = await writeId3Tags(audioFile, tags, coverFile);
      const blob = new Blob([result.buffer as ArrayBuffer], {
        type: audioFile.type || "audio/mpeg",
      });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-bold tracking-tight">ID3 Tag Editor</h2>
        <p className="text-muted-foreground">
          Edit metadata tags for MP3 and FLAC audio files
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
              <Tag className="w-5 h-5" /> Metadata Editor
            </CardTitle>
            <CardDescription>
              Upload an audio file and set its title, artist, album, and cover
              art
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Audio upload */}
            <button
              type="button"
              data-ocid="tags.dropzone"
              onClick={() => audioInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-accent/30 transition-all duration-200"
            >
              <input
                ref={audioInputRef}
                type="file"
                accept=".mp3,.flac,audio/*"
                className="hidden"
                onChange={handleAudio}
              />
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              {audioFile ? (
                <p className="font-medium">{audioFile.name}</p>
              ) : (
                <>
                  <p className="font-medium">Click to upload MP3 or FLAC</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports MP3, FLAC formats
                  </p>
                </>
              )}
            </button>

            {/* Tag fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["title", "artist", "album", "year", "genre"] as const).map(
                (field) => (
                  <div key={field} className="space-y-2">
                    <Label className="capitalize">{field}</Label>
                    <Input
                      data-ocid={`tags.${field}.input`}
                      placeholder={`Enter ${field}`}
                      value={tags[field]}
                      onChange={(e) =>
                        setTags((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ),
              )}
            </div>

            {/* Cover art */}
            <div className="space-y-3">
              <Label>Cover Art</Label>
              <div className="flex items-start gap-4">
                <Button
                  data-ocid="tags.upload_button"
                  variant="outline"
                  onClick={() => coverInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Cover
                </Button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCover}
                />
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="Cover"
                    className="w-16 h-16 rounded-lg object-cover border border-border"
                  />
                )}
              </div>
            </div>

            <Button
              data-ocid="tags.primary_button"
              onClick={save}
              disabled={!audioFile || isSaving}
              className="w-full"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Tags & Download"
              )}
            </Button>

            {downloadUrl && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <a
                  href={downloadUrl}
                  download={audioFile?.name || "tagged-audio.mp3"}
                >
                  <Button
                    data-ocid="tags.secondary_button"
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Tagged File
                  </Button>
                </a>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
