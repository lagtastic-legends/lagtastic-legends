import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVault } from "@/hooks/useVault";
import {
  Download,
  FolderLock,
  Lock,
  ShieldCheck,
  Trash2,
  Unlock,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function VaultPage() {
  const {
    isUnlocked,
    hasPin,
    files,
    error,
    setupPin,
    unlock,
    lock,
    addFile,
    deleteFile,
  } = useVault();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [setupError, setSetupError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSetup = () => {
    if (pin.length < 4 || pin.length > 8) {
      setSetupError("PIN must be 4-8 digits");
      return;
    }
    if (!/^\d+$/.test(pin)) {
      setSetupError("PIN must contain only digits");
      return;
    }
    if (pin !== confirmPin) {
      setSetupError("PINs do not match");
      return;
    }
    setSetupError("");
    setupPin(pin);
    setPin("");
    setConfirmPin("");
  };

  const handleUnlock = () => {
    unlock(pin);
    setPin("");
  };

  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      addFile({
        name: f.name,
        type: f.type,
        size: f.size,
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(f);
  };

  if (!hasPin) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h2 className="text-3xl font-bold tracking-tight">Secure Vault</h2>
          <p className="text-muted-foreground">
            Create a PIN to protect your private files
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-sm mx-auto"
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderLock className="w-5 h-5" /> Set Up Vault PIN
              </CardTitle>
              <CardDescription>
                Choose a 4–8 digit PIN to secure your vault
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Create PIN</Label>
                <Input
                  data-ocid="vault.pin.input"
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="4-8 digits"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm PIN</Label>
                <Input
                  data-ocid="vault.confirm_pin.input"
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="Confirm PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSetup()}
                />
              </div>
              {setupError && (
                <p
                  data-ocid="vault.error_state"
                  className="text-destructive text-sm"
                >
                  {setupError}
                </p>
              )}
              <Button
                data-ocid="vault.primary_button"
                onClick={handleSetup}
                className="w-full"
              >
                <ShieldCheck className="mr-2 h-4 w-4" /> Create Vault
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h2 className="text-3xl font-bold tracking-tight">Secure Vault</h2>
          <p className="text-muted-foreground">
            Enter your PIN to access your vault
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-sm mx-auto"
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" /> Vault Locked
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Enter PIN</Label>
                <Input
                  data-ocid="vault.unlock.input"
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="Your PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                />
              </div>
              {error && (
                <p
                  data-ocid="vault.error_state"
                  className="text-destructive text-sm"
                >
                  {error}
                </p>
              )}
              <Button
                data-ocid="vault.unlock.primary_button"
                onClick={handleUnlock}
                className="w-full"
              >
                <Unlock className="mr-2 h-4 w-4" /> Unlock Vault
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Secure Vault</h2>
          <p className="text-muted-foreground">
            Your private files — stored securely in this browser
          </p>
        </div>
        <Button data-ocid="vault.lock.button" variant="outline" onClick={lock}>
          <Lock className="mr-2 h-4 w-4" /> Lock Vault
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Vault Contents
              </CardTitle>
              <Button
                data-ocid="vault.upload_button"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Add to Vault
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleAddFile}
              />
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="popLayout">
              {files.length === 0 ? (
                <motion.div
                  data-ocid="vault.empty_state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-muted-foreground"
                >
                  <FolderLock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Your vault is empty. Add files to keep them private.</p>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {files.map((f, i) => (
                    <motion.div
                      key={f.id}
                      data-ocid={`vault.item.${i + 1}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{f.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatSize(f.size)} ·{" "}
                          {new Date(f.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-3">
                        <a href={f.dataUrl} download={f.name}>
                          <Button
                            data-ocid={`vault.secondary_button.${i + 1}`}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </a>
                        <Button
                          data-ocid={`vault.delete_button.${i + 1}`}
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteFile(f.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
