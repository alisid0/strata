# Qubix live deployment recovery snapshot

Captured from `https://qubix.university/` on 1 September 2026 after the source
used for the public redesign was found to be absent from GitHub.

This directory preserves the public Vite entry document and every hashed
JavaScript/CSS asset reachable from that entry document. It is a recovery
reference, not the maintainable source of the application.

The reconstruction must use the files in `docs/recovery/` as the product and
curriculum authority, while using this snapshot to check the behaviour and
visual details that were actually published.

Do not deploy this directory directly over the production application. Rebuild
the relevant views as source components, validate them, and preserve every live
route before release.
