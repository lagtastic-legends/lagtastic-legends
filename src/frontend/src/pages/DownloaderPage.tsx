import { UrlDownloaderPanel } from "@/components/downloader/UrlDownloaderPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export function DownloaderPage() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Media Downloader</h2>
        <p className="text-muted-foreground">Download media files from URLs</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.06,
        }}
      >
        <Alert variant="default" className="border-primary/50 bg-primary/5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Limitations</AlertTitle>
          <AlertDescription>
            This tool uses generic HTTP fetching. Many platforms (YouTube,
            Instagram, etc.) block browser downloads due to CORS, DRM, or
            authentication requirements. It works best with direct media links.
          </AlertDescription>
        </Alert>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.12,
        }}
      >
        <motion.div
          whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Download Media</CardTitle>
              <CardDescription>
                Paste a direct media URL to download the file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UrlDownloaderPanel />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
