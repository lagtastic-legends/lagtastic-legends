import Map "mo:core/Map";
import Principal "mo:core/Principal";
import VaultLib "lib/vault";
import FileLib "lib/file_manager";
import VaultApi "mixins/vault-api";
import FileManagerApi "mixins/file-manager-api";

// LAGTASTIC LEGENDS — backend composition root.
//
// Owns the stable per-caller stores for the Secure Vault and Smart File
// Manager domains and wires them into their respective API mixins.
// Enhanced orthogonal persistence keeps these Maps stable across upgrades
// (no `stable` keyword, no pre/postupgrade). The previous deployed version
// was an empty `actor {}`, so adding these fields is a stable-compatible
// change — no explicit migration required.
actor {
  // Per-caller vault entries: Principal -> (EntryId -> VaultEntry).
  let vaultStore : VaultLib.VaultStore = Map.empty();
  // Per-caller file-manager entries: Principal -> (EntryId -> FileEntry).
  let fileStore : FileLib.FileStore = Map.empty();

  include VaultApi(vaultStore);
  include FileManagerApi(fileStore);
};
