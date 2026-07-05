import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, lazy, useState } from "react";
import { AppLayout } from "./components/AppLayout";

export type TabValue =
  | "converter"
  | "ringtone"
  | "pdf"
  | "downloader"
  | "gif"
  | "tags"
  | "merger"
  | "vault"
  | "filemanager";

const ConverterPage = lazy(() =>
  import("./pages/ConverterPage").then((m) => ({ default: m.ConverterPage })),
);
const RingtoneMakerPage = lazy(() =>
  import("./pages/RingtoneMakerPage").then((m) => ({
    default: m.RingtoneMakerPage,
  })),
);
const PdfToolsPage = lazy(() =>
  import("./pages/PdfToolsPage").then((m) => ({ default: m.PdfToolsPage })),
);
const DownloaderPage = lazy(() =>
  import("./pages/DownloaderPage").then((m) => ({ default: m.DownloaderPage })),
);
const GifMakerPage = lazy(() =>
  import("./pages/GifMakerPage").then((m) => ({ default: m.GifMakerPage })),
);
const TagEditorPage = lazy(() =>
  import("./pages/TagEditorPage").then((m) => ({ default: m.TagEditorPage })),
);
const MergerSplitterPage = lazy(() =>
  import("./pages/MergerSplitterPage").then((m) => ({
    default: m.MergerSplitterPage,
  })),
);
const VaultPage = lazy(() =>
  import("./pages/VaultPage").then((m) => ({ default: m.VaultPage })),
);
const FileManagerPage = lazy(() =>
  import("./pages/FileManagerPage").then((m) => ({
    default: m.FileManagerPage,
  })),
);

function PageSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-6 w-2/3" />
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<TabValue>("converter");

  const renderContent = () => {
    switch (activeTab) {
      case "converter":
        return <ConverterPage />;
      case "ringtone":
        return <RingtoneMakerPage />;
      case "pdf":
        return <PdfToolsPage />;
      case "downloader":
        return <DownloaderPage />;
      case "gif":
        return <GifMakerPage />;
      case "tags":
        return <TagEditorPage />;
      case "merger":
        return <MergerSplitterPage />;
      case "vault":
        return <VaultPage />;
      case "filemanager":
        return <FileManagerPage />;
      default:
        return <ConverterPage />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 32,
            duration: 0.35,
          }}
        >
          <Suspense fallback={<PageSkeleton />}>{renderContent()}</Suspense>
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
}

export default App;
