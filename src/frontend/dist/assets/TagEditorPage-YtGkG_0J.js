import { r as reactExports, j as jsxRuntimeExports, m as motion, T as Tag, D as Download } from "./index-C7SiQumv.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, B as Button } from "./card-BUE6aIsi.js";
import { I as Input } from "./input-DeaYCkik.js";
import { L as Label } from "./label-DjSXj35-.js";
import { U as Upload } from "./upload-B3IIcvra.js";
import { L as LoaderCircle } from "./loader-circle-B1soad14.js";
function encodeText(text) {
  return new TextEncoder().encode(text);
}
function syncsafeInt(n) {
  const bytes = new Uint8Array(4);
  bytes[3] = n & 127;
  const a = n >> 7;
  bytes[2] = a & 127;
  const b = a >> 7;
  bytes[1] = b & 127;
  const c = b >> 7;
  bytes[0] = c & 127;
  return bytes;
}
function int32be(n) {
  return new Uint8Array([
    n >> 24 & 255,
    n >> 16 & 255,
    n >> 8 & 255,
    n & 255
  ]);
}
function makeTextFrame(id, text) {
  if (!text) return new Uint8Array(0);
  const idBytes = new TextEncoder().encode(id);
  const textBytes = encodeText(text);
  const size = 1 + textBytes.length;
  const header = new Uint8Array(10);
  header.set(idBytes, 0);
  header.set(int32be(size), 4);
  const frame = new Uint8Array(10 + size);
  frame.set(header, 0);
  frame[10] = 0;
  frame.set(textBytes, 11);
  return frame;
}
async function makeApicFrame(imageFile) {
  const mime = encodeText(imageFile.type);
  const imgData = new Uint8Array(await imageFile.arrayBuffer());
  const desc = new Uint8Array(1);
  const size = 1 + mime.length + 1 + 1 + desc.length + imgData.length;
  const header = new Uint8Array(10);
  header.set(encodeText("APIC"), 0);
  header.set(int32be(size), 4);
  const frame = new Uint8Array(10 + size);
  let offset = 0;
  frame.set(header, offset);
  offset += 10;
  frame[offset++] = 0;
  frame.set(mime, offset);
  offset += mime.length;
  frame[offset++] = 0;
  frame[offset++] = 3;
  frame.set(desc, offset);
  offset += desc.length;
  frame.set(imgData, offset);
  return frame;
}
async function writeId3Tags(audioFile, tags, coverFile) {
  let audioData = new Uint8Array(await audioFile.arrayBuffer());
  if (audioData[0] === 73 && audioData[1] === 68 && audioData[2] === 51) {
    const existingSize = (audioData[6] & 127) << 21 | (audioData[7] & 127) << 14 | (audioData[8] & 127) << 7 | audioData[9] & 127;
    audioData = audioData.slice(10 + existingSize);
  }
  const frames = [
    makeTextFrame("TIT2", tags.title),
    makeTextFrame("TPE1", tags.artist),
    makeTextFrame("TALB", tags.album),
    makeTextFrame("TYER", tags.year),
    makeTextFrame("TCON", tags.genre)
  ].filter((f) => f.length > 0);
  if (coverFile) {
    frames.push(await makeApicFrame(coverFile));
  }
  const framesSize = frames.reduce((acc, f) => acc + f.length, 0);
  const id3Header = new Uint8Array(10);
  id3Header.set(encodeText("ID3"), 0);
  id3Header[3] = 3;
  id3Header[4] = 0;
  id3Header[5] = 0;
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
function TagEditorPage() {
  const [audioFile, setAudioFile] = reactExports.useState(null);
  const [coverFile, setCoverFile] = reactExports.useState(null);
  const [coverPreview, setCoverPreview] = reactExports.useState(null);
  const [tags, setTags] = reactExports.useState({
    title: "",
    artist: "",
    album: "",
    year: "",
    genre: ""
  });
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [downloadUrl, setDownloadUrl] = reactExports.useState(null);
  const audioInputRef = reactExports.useRef(null);
  const coverInputRef = reactExports.useRef(null);
  const handleAudio = (e) => {
    var _a;
    const f = (_a = e.target.files) == null ? void 0 : _a[0];
    if (f) {
      setAudioFile(f);
      setDownloadUrl(null);
    }
  };
  const handleCover = (e) => {
    var _a;
    const f = (_a = e.target.files) == null ? void 0 : _a[0];
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
      const blob = new Blob([result.buffer], {
        type: audioFile.type || "audio/mpeg"
      });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "text-center space-y-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "ID3 Tag Editor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Edit metadata tags for MP3 and FLAC audio files" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-5 h-5" }),
              " Metadata Editor"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Upload an audio file and set its title, artist, album, and cover art" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "tags.dropzone",
                onClick: () => {
                  var _a;
                  return (_a = audioInputRef.current) == null ? void 0 : _a.click();
                },
                className: "w-full border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-accent/30 transition-all duration-200",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: audioInputRef,
                      type: "file",
                      accept: ".mp3,.flac,audio/*",
                      className: "hidden",
                      onChange: handleAudio
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-8 h-8 mx-auto mb-2 text-muted-foreground" }),
                  audioFile ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: audioFile.name }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Click to upload MP3 or FLAC" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Supports MP3, FLAC formats" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: ["title", "artist", "album", "year", "genre"].map(
              (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "capitalize", children: field }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": `tags.${field}.input`,
                    placeholder: `Enter ${field}`,
                    value: tags[field],
                    onChange: (e) => setTags((prev) => ({
                      ...prev,
                      [field]: e.target.value
                    }))
                  }
                )
              ] }, field)
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cover Art" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": "tags.upload_button",
                    variant: "outline",
                    onClick: () => {
                      var _a;
                      return (_a = coverInputRef.current) == null ? void 0 : _a.click();
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
                      " Upload Cover"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: coverInputRef,
                    type: "file",
                    accept: "image/*",
                    className: "hidden",
                    onChange: handleCover
                  }
                ),
                coverPreview && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: coverPreview,
                    alt: "Cover",
                    className: "w-16 h-16 rounded-lg object-cover border border-border"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "tags.primary_button",
                onClick: save,
                disabled: !audioFile || isSaving,
                className: "w-full",
                size: "lg",
                children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                  "Saving..."
                ] }) : "Save Tags & Download"
              }
            ),
            downloadUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: downloadUrl,
                download: (audioFile == null ? void 0 : audioFile.name) || "tagged-audio.mp3",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": "tags.secondary_button",
                    variant: "outline",
                    className: "w-full",
                    size: "lg",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
                      " Download Tagged File"
                    ]
                  }
                )
              }
            ) })
          ] })
        ] })
      }
    )
  ] });
}
export {
  TagEditorPage
};
