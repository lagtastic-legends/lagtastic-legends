import { ImageToPdfPanel } from "@/components/pdf/ImageToPdfPanel";
import { PdfMergerPanel } from "@/components/pdf/PdfMergerPanel";
import { PdfPasswordPanel } from "@/components/pdf/PdfPasswordPanel";
import { ScanToPdfPanel } from "@/components/pdf/ScanToPdfPanel";
import { TextToPdfPanel } from "@/components/pdf/TextToPdfPanel";
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

export function PdfToolsPage() {
  const [activeTab, setActiveTab] = useState("images");

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">PDF Tools</h2>
        <p className="text-muted-foreground">
          Create, merge, secure, and scan PDF documents
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
              <CardTitle>PDF Toolkit</CardTitle>
              <CardDescription>
                All PDF operations happen locally in your browser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex flex-wrap gap-1 h-auto w-full">
                  <TabsTrigger
                    data-ocid="pdf.images.tab"
                    value="images"
                    className="flex-1 min-w-fit text-xs sm:text-sm transition-all duration-150"
                  >
                    Img→PDF
                  </TabsTrigger>
                  <TabsTrigger
                    data-ocid="pdf.text.tab"
                    value="text"
                    className="flex-1 min-w-fit text-xs sm:text-sm transition-all duration-150"
                  >
                    Text→PDF
                  </TabsTrigger>
                  <TabsTrigger
                    data-ocid="pdf.merge.tab"
                    value="merge"
                    className="flex-1 min-w-fit text-xs sm:text-sm transition-all duration-150"
                  >
                    Merge
                  </TabsTrigger>
                  <TabsTrigger
                    data-ocid="pdf.password.tab"
                    value="password"
                    className="flex-1 min-w-fit text-xs sm:text-sm transition-all duration-150"
                  >
                    Lock
                  </TabsTrigger>
                  <TabsTrigger
                    data-ocid="pdf.scan.tab"
                    value="scan"
                    className="flex-1 min-w-fit text-xs sm:text-sm transition-all duration-150"
                  >
                    Scan
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    variants={tabContentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={springTransition}
                  >
                    <TabsContent value="images" className="mt-6">
                      {activeTab === "images" && <ImageToPdfPanel />}
                    </TabsContent>

                    <TabsContent value="text" className="mt-6">
                      {activeTab === "text" && <TextToPdfPanel />}
                    </TabsContent>

                    <TabsContent value="merge" className="mt-6">
                      {activeTab === "merge" && <PdfMergerPanel />}
                    </TabsContent>

                    <TabsContent value="password" className="mt-6">
                      {activeTab === "password" && <PdfPasswordPanel />}
                    </TabsContent>

                    <TabsContent value="scan" className="mt-6">
                      {activeTab === "scan" && <ScanToPdfPanel />}
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
