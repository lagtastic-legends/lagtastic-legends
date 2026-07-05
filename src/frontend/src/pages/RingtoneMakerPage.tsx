import { WaveformEditor } from "@/components/ringtone/WaveformEditor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";

export function RingtoneMakerPage() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Ringtone Maker</h2>
        <p className="text-muted-foreground">
          Trim audio, add fades, and create custom ringtones
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.08,
        }}
      >
        <motion.div
          whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Create Your Ringtone</CardTitle>
              <CardDescription>
                Upload audio or video, trim to your favorite part, and export
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WaveformEditor />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
