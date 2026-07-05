import {
  Combine,
  Download,
  FileText,
  Film,
  FolderOpen,
  ImagePlay,
  Music,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";
import type { TabValue } from "../App";

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

const navItems: { value: TabValue; label: string; icon: React.ElementType }[] =
  [
    { value: "converter", label: "Media Converter", icon: Film },
    { value: "gif", label: "GIF Maker", icon: ImagePlay },
    { value: "ringtone", label: "Ringtone", icon: Music },
    { value: "tags", label: "ID3 Tags", icon: Tag },
    { value: "merger", label: "Merger/Splitter", icon: Combine },
    { value: "pdf", label: "PDF Tools", icon: FileText },
    { value: "downloader", label: "Downloader", icon: Download },
    { value: "vault", label: "Secure Vault", icon: ShieldCheck },
    { value: "filemanager", label: "File Manager", icon: FolderOpen },
  ];

export function AppLayout({
  children,
  activeTab,
  onTabChange,
}: AppLayoutProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <motion.header
        className="border-b border-cyan-900/30 bg-card/80 backdrop-blur-md sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4 py-4">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="rounded-full overflow-hidden flex-shrink-0"
              style={{
                width: 48,
                height: 48,
                border: "3px solid #06B6D4",
                boxShadow: "0 0 14px 2px #06B6D480",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: 0.1,
              }}
              whileHover={{ scale: 1.08, rotate: 3 }}
            >
              <img
                src="/assets/uploads/Gemini_Generated_Image_yozyvyozyvyozyvy-2.png"
                alt="LAGTASTIC LEGENDS Logo"
                className="h-full w-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: 0.15,
              }}
            >
              <h1
                className="text-2xl tracking-widest uppercase leading-tight"
                style={{ fontFamily: "'Poppins', 'Montserrat', sans-serif" }}
              >
                <span
                  style={{
                    color: "#e2e8f0",
                    fontWeight: 900,
                    letterSpacing: "0.12em",
                  }}
                >
                  LAGTASTIC
                </span>{" "}
                <span
                  className="legends-glow"
                  style={{
                    color: "#06B6D4",
                    fontWeight: 700,
                    textShadow: "0 0 16px #06B6D4cc, 0 0 32px #06B6D466",
                    letterSpacing: "0.14em",
                  }}
                >
                  LEGENDS
                </span>
              </h1>
              <p
                className="text-xs tracking-wider uppercase"
                style={{ color: "#94A3B8" }}
              >
                All-in-one media &amp; document tools
              </p>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="overflow-x-auto pb-1 -mx-1">
            <div className="flex gap-0.5 min-w-max px-1">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const isActive = activeTab === item.value;
                return (
                  <motion.button
                    type="button"
                    key={item.value}
                    data-ocid={`nav.${item.value}.link`}
                    onClick={() => onTabChange(item.value)}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                      isActive
                        ? "text-foreground bg-accent/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                    }`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      delay: 0.18 + i * 0.03,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon
                      className="w-4 h-4 flex-shrink-0"
                      style={isActive ? { color: "#06B6D4" } : {}}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        style={{ backgroundColor: "#06B6D4" }}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </nav>
        </div>
      </motion.header>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-cyan-900/30 bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="font-medium tracking-wide">
              &copy; {currentYear}{" "}
              <span
                style={{
                  fontFamily: "'Poppins', 'Montserrat', sans-serif",
                  fontWeight: 900,
                  color: "#e2e8f0",
                }}
              >
                LAGTASTIC
              </span>{" "}
              <span
                style={{
                  fontFamily: "'Poppins', 'Montserrat', sans-serif",
                  fontWeight: 700,
                  color: "#06B6D4",
                }}
              >
                LEGENDS
              </span>
              . All rights reserved.
            </p>
            <p className="flex items-center gap-1">
              Built with{" "}
              <motion.span
                style={{ color: "#06B6D4" }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                &hearts;
              </motion.span>{" "}
              using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition-all duration-200 underline hover:scale-105 inline-block"
                style={{ color: "#06B6D4" }}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
