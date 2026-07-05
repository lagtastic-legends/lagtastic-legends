import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/vault";
import Common "../types/common";

// Vault domain logic. Pure functions operating on a per-caller Map of
// vault entries. State is owned by main.mo and injected by reference.
module {
  public type VaultStore = Map.Map<Principal, Map.Map<Common.EntryId, Types.VaultEntry>>;

  // Returns the inner per-caller map, creating an empty one on first use.
  public func userEntries(store : VaultStore, caller : Principal) : Map.Map<Common.EntryId, Types.VaultEntry> {
    switch (store.get(caller)) {
      case (?m) m;
      case null {
        let m = Map.empty<Common.EntryId, Types.VaultEntry>();
        store.add(caller, m);
        m;
      };
    };
  };

  public func create(
    store : VaultStore,
    caller : Principal,
    id : Common.EntryId,
    name : Text,
    mimeType : Text,
    size : Nat,
    tags : [Text],
    blobRef : ?Text,
  ) : Types.VaultEntry {
    let now = Time.now();
    let entry : Types.VaultEntry = {
      id;
      name;
      mimeType;
      size;
      tags;
      blobRef;
      createdAt = now;
      updatedAt = now;
    };
    userEntries(store, caller).add(id, entry);
    entry;
  };

  public func list(store : VaultStore, caller : Principal) : [Types.VaultEntry] {
    userEntries(store, caller).toArray().map(
      func(_, entry) { entry },
    );
  };

  public func get(store : VaultStore, caller : Principal, id : Common.EntryId) : ?Types.VaultEntry {
    userEntries(store, caller).get(id);
  };

  public func update(
    store : VaultStore,
    caller : Principal,
    id : Common.EntryId,
    name : Text,
    tags : [Text],
    blobRef : ?Text,
  ) : ?Types.VaultEntry {
    let entries = userEntries(store, caller);
    switch (entries.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.VaultEntry = {
          existing with
          name;
          tags;
          blobRef;
          updatedAt = Time.now();
        };
        entries.add(id, updated);
        ?updated;
      };
    };
  };

  public func delete(store : VaultStore, caller : Principal, id : Common.EntryId) : Bool {
    let entries = userEntries(store, caller);
    let existed = entries.get(id) != null;
    entries.remove(id);
    existed;
  };
};
