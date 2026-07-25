# _bin — the holding bin (nothing deleted)

A safe holding area for files that are **not currently used but might be needed
later or as reference**. This is the project's "don't delete, just set aside"
folder — the alternative to removing anything outright.

## Rules

- **Nothing here is deleted.** Everything is preserved in Git history and on disk.
- Files land here only when they are **not imported by any code** and **not
  referenced by any live doc, script, or config** (verified before moving).
- Moving a file here is **fully reversible**: `git mv _bin/<file> <original path>`
  restores it, history intact.
- This is distinct from `legacy/` (dead pre-Svelte *code* prototypes) and
  `docs/archive/` (superseded planning docs). `_bin/` is the general "might need
  this again" tray that makes the wider reorganisation (see `FILE-GUIDE.md`)
  safer: candidates move here first, and only after a settling period would
  anyone consider deleting them.

## What's here and why

Each entry records where it came from and why it was set aside.

| File | Origin | Why binned |
|---|---|---|
| `lockhart_extract.txt` | root | Reference text (Lockhart's *A Mathematician's Lament*); no code or doc references it. |
| `final-draft-bits-and-logic.md` | root | Content final-draft; not ingested from, not referenced. Kept in case it's re-used. |
| `final-draft-command-line-computing.md` | root | Content final-draft; not referenced. |
| `final-draft-system-design-basics.md` | root | Content final-draft; not referenced. |
| `DEEPSEEK-COLLAB.md` | root | Historical collaboration notes; not referenced. |
| `DESIGN-UPGRADE.md` | root | Historical design-upgrade notes; not referenced. |
| `FOUR-STARTING-POINTS.md` | root | Early planning doc; not referenced. |

## Candidates not yet binned (need a decision first)

- `el-screenshot.png` — untracked locally and still referenced by 2 docs; leave
  until those references are resolved.
- `QUBIX-BLUEPRINT.md` — still has 1 live reference; likely useful, left at root.
