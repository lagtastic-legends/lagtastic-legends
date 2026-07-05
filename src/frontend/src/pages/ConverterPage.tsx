import { AudioExtractPanel } from "@/components/converter/AudioExtractPanel";
import { MuteVideoPanel } from "@/components/converter/MuteVideoPanel";
import { VideoCompressPanel } from "@/components/converter/VideoCompressPanel";
import { VideoConvertPanel } from "@/components/converter/VideoConvertPanel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const tabContentVariants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 35,
};

export function ConverterPage() {
  const [activeSubTab, setActiveSubTab] = useState("audio");

  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Media Converter</h2>
        <p className="text-muted-foreground">
          Convert videos to audio, change formats, compress, or mute files
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
              <CardTitle>Choose Your Tool</CardTitle>
              <CardDescription>
                All conversions happen in your browser - your files never leave
                your device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
                <TabsList className="flex flex-wrap gap-1 h-auto w-full">
                  <TabsTrigger
                    data-ocid="converter.audio.tab"
                    value="audio"
                    className="flex-1 min-w-fit text-xs sm:text-sm transition-all duration-150"
                  >
                    Extract
                  </TabsTrigger>
                  <TabsTrigger
                    data-ocid="converter.format.tab"
                    value="format"
                    className="flex-1 min-w-fit text-xs sm:text-sm transition-all duration-150"
                  >
                    Format
                  </TabsTrigger>
                  <TabsTrigger
                    data-ocid="converter.compress.tab"
                    value="compress"
                    className="flex-1 min-w-fit text-xs sm:text-sm transition-all duration-150"
                  >
                    Compress
                  </TabsTrigger>
                  <TabsTrigger
                    data-ocid="converter.mute.tab"
                    value="mute"
                    className="flex-1 min-w-fit text-xs sm:text-sm transition-all duration-150"
                  >
                    Mute
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSubTab}
                    variants={tabContentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={springTransition}
                  >
                    <TabsContent
                      value="audio"
                      className="mt-6"
                      forceMount={activeSubTab === "audio" || undefined}
                    >
                      {activeSubTab === "audio" && <AudioExtractPanel />}
                    </TabsContent>

                    <TabsContent
                      value="format"
                      className="mt-6"
                      forceMount={activeSubTab === "format" || undefined}
                    >
                      {activeSubTab === "format" && <VideoConvertPanel />}
                    </TabsContent>

                    <TabsContent
                      value="compress"
                      className="mt-6"
                      forceMount={activeSubTab === "compress" || undefined}
                    >
                      {activeSubTab === "compress" && <VideoCompressPanel />}
                    </TabsContent>

                    <TabsContent
                      value="mute"
                      className="mt-6"
                      forceMount={activeSubTab === "mute" || undefined}
                    >
                      {activeSubTab === "mute" && <MuteVideoPanel />}
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
