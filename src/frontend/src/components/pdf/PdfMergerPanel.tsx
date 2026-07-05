import { Button } from "@/components/ui/button";
import { Download, FilePlus, Loader2, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";

export function PdfMergerPanel() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setOutputUrl(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf",
    );
    if (dropped.length) addFiles(dropped);
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const merge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setError("");
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        for (const page of pages) mergedPdf.addPage(page);
      }
      const bytes = await mergedPdf.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });
      setOutputUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError("Failed to merge PDFs. Ensure all files are valid PDFs.");
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <motion.button
        type="button"
        data-ocid="pdfmerger.dropzone"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 hover:border-primary hover:bg-accent/30"
        style={
          isDragging
            ? {
                borderColor: "#06B6D4",
                boxShadow: "0 0 24px rgba(6,182,212,0.35)",
              }
            : {}
        }
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={handleChange}
        />
        <motion.div
          animate={isDragging ? { scale: 1.15 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <FilePlus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        </motion.div>
        <p className="font-medium">
          {isDragging ? "Drop PDFs here!" : "Click or drag & drop PDF files"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Add 2 or more PDFs to merge
        </p>
      </motion.button>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {files.map((f, i) => (
              <motion.div
                key={`${f.name}-${i}`}
                data-ocid={`pdfmerger.item.${i + 1}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  delay: i * 0.04,
                }}
                className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border"
              >
                <span className="text-sm font-medium truncate min-w-0">
                  {f.name}
                </span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    data-ocid={`pdfmerger.delete_button.${i + 1}`}
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(i)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
        <Button
          data-ocid="pdfmerger.primary_button"
          onClick={merge}
          disabled={files.length < 2 || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Merging PDFs...
            </>
          ) : (
            `Merge ${files.length > 0 ? files.length : ""} PDFs`
          )}
        </Button>
      </motion.div>

      {error && (
        <motion.p
          data-ocid="pdfmerger.error_state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-destructive text-sm"
        >
          {error}
        </motion.p>
      )}

      <AnimatePresence>
        {outputUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <a href={outputUrl} download="merged.pdf">
              <Button
                data-ocid="pdfmerger.secondary_button"
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" /> Download Merged PDF
              </Button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
