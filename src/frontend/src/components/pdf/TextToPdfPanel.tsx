import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createPdfFromText } from "@/lib/pdf/textToPdf";
import { validateTextPdf } from "@/lib/validation/pdfValidation";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

export function TextToPdfPanel() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [fontSize, setFontSize] = useState("12");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);

  const handleGenerate = async () => {
    const validationError = validateTextPdf(
      title,
      body,
      Number.parseInt(fontSize),
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const blob = await createPdfFromText(
        title,
        body,
        Number.parseInt(fontSize),
      );
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
    a.download = `${title || "document"}_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="animate-fade-in">
          <Label htmlFor="pdf-title">Document Title</Label>
          <Input
            id="pdf-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
            disabled={isProcessing}
            className="transition-all duration-150 focus:scale-[1.01]"
          />
        </div>

        <div className="animate-fade-in animation-delay-50">
          <Label htmlFor="pdf-body">Document Body</Label>
          <Textarea
            id="pdf-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter or paste your text here..."
            rows={12}
            disabled={isProcessing}
            className="font-mono transition-all duration-150 focus:scale-[1.005]"
          />
        </div>

        <div className="animate-fade-in animation-delay-100">
          <Label htmlFor="font-size">Font Size</Label>
          <Select
            value={fontSize}
            onValueChange={setFontSize}
            disabled={isProcessing}
          >
            <SelectTrigger
              id="font-size"
              className="transition-all duration-150"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10pt (Small)</SelectItem>
              <SelectItem value="12">12pt (Normal)</SelectItem>
              <SelectItem value="14">14pt (Large)</SelectItem>
              <SelectItem value="16">16pt (Extra Large)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="animate-fade-in">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleGenerate}
          disabled={isProcessing}
          className="flex-1 transition-all duration-200 hover:scale-[1.02]"
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
