import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/file_manager";
import Common "../types/common";

// Smart File Manager domain logic. Pure functions operating on a per-caller
// Map of file entries. State is owned by main.mo and injected by reference.
module {
  public type FileStore = Map.Map<Principal, Map.Map<Common.EntryId, Types.FileEntry>>;

  // Returns the inner per-caller map, creating an empty one on first use.
  public func userEntries(store : FileStore, caller : Principal) : Map.Map<Common.EntryId, Types.FileEntry> {
    switch (store.get(caller)) {
      case (?m) m;
      case null {
        let m = Map.empty<Common.EntryId, Types.FileEntry>();
        store.add(caller, m);
        m;
      };
    };
  };

  public func create(
    store : FileStore,
    caller : Principal,
    id : Common.EntryId,
    name : Text,
    size : Nat,
    mimeType : Text,
    category : Text,
  ) : Types.FileEntry {
    let now = Time.now();
    let entry : Types.FileEntry = {
      id;
      name;
      size;
      mimeType;
      category;
      createdAt = now;
      updatedAt = now;
    };
    userEntries(store, caller).add(id, entry);
    entry;
  };

  public func list(store : FileStore, caller : Principal) : [Types.FileEntry] {
    userEntries(store, caller).toArray().map(
      func(_, entry) { entry },
    );
  };

  public func get(store : FileStore, caller : Principal, id : Common.EntryId) : ?Types.FileEntry {
    userEntries(store, caller).get(id);
  };

  public func rename(
    store : FileStore,
    caller : Principal,
    id : Common.EntryId,
    name : Text,
  ) : ?Types.FileEntry {
    let entries = userEntries(store, caller);
    switch (entries.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.FileEntry = {
          existing with
          name;
          updatedAt = Time.now();
        };
        entries.add(id, updated);
        ?updated;
      };
    };
  };

  public func delete(store : FileStore, caller : Principal, id : Common.EntryId) : Bool {
    let entries = userEntries(store, caller);
    let existed = entries.get(id) != null;
    entries.remove(id);
    existed;
  };
};
