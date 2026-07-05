import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Eye, EyeOff, Loader2, Lock, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";

export function PdfPasswordPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setOutputUrl(null);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = Array.from(e.dataTransfer.files).find(
      (f) => f.type === "application/pdf",
    );
    if (f) handleFile(f);
  };

  const lockPdf = async () => {
    if (!file) return;
    if (!password) {
      setError("Please enter a password");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsProcessing(true);
    setError("");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfBytes = await pdfDoc.save({
        userPassword: password,
        ownerPassword: `${password}_owner`,
        permissions: {
          printing: "lowResolution",
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: false,
          contentAccessibility: true,
          documentAssembly: false,
        },
      });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });
      setOutputUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError("Failed to lock PDF. Ensure the file is a valid PDF.");
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <motion.button
        type="button"
        data-ocid="pdfpassword.dropzone"
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
          className="hidden"
          onChange={handleChange}
        />
        <motion.div
          animate={isDragging ? { scale: 1.15 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        </motion.div>
        {file ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium"
          >
            {file.name}
          </motion.p>
        ) : (
          <>
            <p className="font-medium">
              {isDragging ? "Drop PDF here!" : "Click or drag & drop a PDF"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">PDF files only</p>
          </>
        )}
      </motion.button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <Input
              data-ocid="pdfpassword.input"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <Input
            data-ocid="pdfpassword.confirm.input"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
        <Button
          data-ocid="pdfpassword.primary_button"
          onClick={lockPdf}
          disabled={!file || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Locking PDF...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Lock PDF with Password
            </>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            data-ocid="pdfpassword.error_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-destructive text-sm"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {outputUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <a href={outputUrl} download={`locked_${file?.name}`}>
              <Button
                data-ocid="pdfpassword.secondary_button"
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" /> Download Locked PDF
              </Button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
