import VaultLib "../lib/vault";
import Types "../types/vault";
import Common "../types/common";

// Public API surface for the Secure Vault domain. All entries are scoped
// to msg.caller — each user only sees and mutates their own vault.
mixin (store : VaultLib.VaultStore) {
  // Create a new vault entry. The client supplies the id (UUID) so it can
  // keep its local encrypted blob and the on-chain metadata in sync.
  public shared ({ caller }) func createVaultEntry(
    id : Common.EntryId,
    name : Text,
    mimeType : Text,
    size : Nat,
    tags : [Text],
    blobRef : ?Text,
  ) : async Types.VaultEntry {
    VaultLib.create(store, caller, id, name, mimeType, size, tags, blobRef);
  };

  // List all vault entries belonging to the caller.
  public shared query ({ caller }) func listVaultEntries() : async [Types.VaultEntry] {
    VaultLib.list(store, caller);
  };

  // Fetch a single vault entry by id, scoped to the caller.
  public shared query ({ caller }) func getVaultEntry(id : Common.EntryId) : async ?Types.VaultEntry {
    VaultLib.get(store, caller, id);
  };

  // Update the mutable fields of a vault entry (name, tags, blobRef).
  // Returns null if the caller has no entry with that id.
  public shared ({ caller }) func updateVaultEntry(
    id : Common.EntryId,
    name : Text,
    tags : [Text],
    blobRef : ?Text,
  ) : async ?Types.VaultEntry {
    VaultLib.update(store, caller, id, name, tags, blobRef);
  };

  // Delete a vault entry. Returns true if an entry was removed.
  public shared ({ caller }) func deleteVaultEntry(id : Common.EntryId) : async Bool {
    VaultLib.delete(store, caller, id);
  };
};
