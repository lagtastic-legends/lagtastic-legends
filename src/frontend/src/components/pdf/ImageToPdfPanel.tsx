import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createPdfFromImages } from "@/lib/pdf/imageToPdf";
import { validateImages } from "@/lib/validation/pdfValidation";
import { Download, Loader2, MoveDown, MoveUp, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

interface ImageItem {
  file: File;
  preview: string;
  id: string;
}

export function ImageToPdfPanel() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: File[]) => {
    const newImages: ImageItem[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36),
    }));
    setImages((prev) => [...prev, ...newImages]);
    setError(null);
    setOutputBlob(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (dropped.length) addFiles(dropped);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return updated;
    });
  };

  const moveImage = (id: string, direction: "up" | "down") => {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id);
      if (index === -1) return prev;
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const newImages = [...prev];
      [newImages[index], newImages[newIndex]] = [
        newImages[newIndex],
        newImages[index],
      ];
      return newImages;
    });
  };

  const handleGenerate = async () => {
    const validationError = validateImages(images.map((i) => i.file));
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const blob = await createPdfFromImages(images.map((i) => i.file));
      setOutputBlob(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF generation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `images_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <motion.button
        type="button"
        data-ocid="imagetopdf.dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={
          isDragging ? { scale: 1.02, borderColor: "#06B6D4" } : { scale: 1 }
        }
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer transition-colors duration-200"
        style={isDragging ? { boxShadow: "0 0 24px rgba(6,182,212,0.35)" } : {}}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <motion.div
          animate={
            isDragging ? { scale: 1.15, color: "#06B6D4" } : { scale: 1 }
          }
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        </motion.div>
        <p className="font-medium">
          {isDragging ? "Drop images here!" : "Click or drag & drop images"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          PNG, JPG, WebP supported
        </p>
      </motion.button>

      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Label>Images ({images.length}) — hover to reorder or remove</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 28,
                    delay: index * 0.04,
                  }}
                  className="relative group border rounded-lg overflow-hidden"
                >
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => moveImage(img.id, "up")}
                      disabled={index === 0}
                      className="h-8 w-8 rounded bg-secondary flex items-center justify-center disabled:opacity-40"
                    >
                      <MoveUp className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => moveImage(img.id, "down")}
                      disabled={index === images.length - 1}
                      className="h-8 w-8 rounded bg-secondary flex items-center justify-center disabled:opacity-40"
                    >
                      <MoveDown className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeImage(img.id)}
                      className="h-8 w-8 rounded bg-destructive flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="flex gap-3">
        <motion.div
          className="flex-1"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            data-ocid="imagetopdf.primary_button"
            onClick={handleGenerate}
            disabled={isProcessing || images.length === 0}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              "Generate PDF"
            )}
          </Button>
        </motion.div>
        <AnimatePresence>
          {outputBlob && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                data-ocid="imagetopdf.secondary_button"
                onClick={handleDownload}
                variant="secondary"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
