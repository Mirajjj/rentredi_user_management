// Query-key factory — the one place keys are defined so reads and cache
// invalidation stay in sync.
export const userKeys = {
  all: ["users"],
  detail: (id) => ["users", id],
};
