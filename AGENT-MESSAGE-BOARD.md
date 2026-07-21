# Agent message board

This file is the temporary communication channel between Codex and Claude Code.
The user carries messages between the two apps by pasting them into the relevant
inbox below.

This is a coordination record, not authority to deploy, modify production, apply
database migrations, expose secrets, or merge branches.

## How to use this file

1. Paste a message under the recipient's inbox using the template below.
2. Include the branch and commit hash whenever the message concerns code.
3. The recipient reads the message, performs only the authorised work, and adds
   a response under `Responses`.
4. Mark resolved messages `CLOSED`; do not delete them.
5. Never paste passwords, API keys, tokens, personal data, or production data.

## Shared current state

- Production app: `https://strata-nine-pi.vercel.app`
- Staging app: `https://qubix-staging.vercel.app`
- GitHub repository: `alisid0/strata`
- Production deployment is manual.
- Supabase content changes and Git commits are separate kinds of change.
- Technical diagrams must be deterministic/code-native; raster images and GIFs
  are reserved for real-world scenes and narrative analogies.
- Canonical live-state rules: `docs/SOURCE-OF-TRUTH.md`

### Git synchronization warning

At the time this board was created, local `main` was five commits ahead of
`origin/main`. Do not assume another app can see those commits until GitHub has
been updated and the receiving checkout has fetched them.

## Codex inbox

Paste messages **from Claude to Codex** here, newest first.

<!-- Paste new messages below this line. -->

## Claude inbox

Paste messages **from Codex to Claude** here, newest first.

<!-- Paste new messages below this line. -->

## Responses

Paste responses here, newest first. State which message is being answered.

<!-- Paste new responses below this line. -->

## Open shared decisions

Record decisions that require user approval or agreement between both reviewers.

| ID | Decision | Owner | Status | Related branch/commit |
|---|---|---|---|---|
| D-001 | Decide how to publish the five local commits ahead of `origin/main`. | User | OPEN | Local `main` |

## Security review queue

Use this section for security findings only. Never include secrets or personal
data.

| ID | Area | Finding or question | Raised by | Status | Evidence |
|---|---|---|---|---|---|

## Message template

Copy this block into the appropriate inbox:

```text
### MSG-YYYYMMDD-NNN — Short title

From: Codex | Claude
To: Claude | Codex
Status: OPEN | ANSWERED | CLOSED
Priority: LOW | NORMAL | HIGH | SECURITY
Branch: branch-name or N/A
Commit: full commit hash or N/A
Files in scope: paths or N/A

Context:
What changed or why this message exists.

Request:
The precise review, test, decision, or implementation requested.

Constraints:
What must not be changed; whether staging or production actions are forbidden.

Checks already run:
Commands and results, or "None".

Response needed:
The exact evidence or decision the sender needs back.
```

## Permanent coordination rules

- Read the current files and Git diff; do not rely only on pasted summaries.
- One agent implements and the other reviews security-sensitive changes.
- Use separate branches or worktrees for concurrent work.
- Treat ownership boundaries as collision prevention, not permission to skip
  cross-review.
- Database changes must be represented by reviewed migrations and tested in
  staging before production is considered.
- Client code must never receive a Supabase `service_role` key.
- Verify RLS using at least two distinct test users and explicit anonymous-user
  checks where relevant.
- A Git push is not a production deployment.
- Record production actions separately and include recovery or rollback notes.
