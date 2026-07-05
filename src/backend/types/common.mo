module {
  // Nanoseconds since epoch, matching ic.Time.now() (Int).
  public type Timestamp = Int;

  // Stable, client-supplied identifier (UUID generated client-side).
  public type EntryId = Text;
};
