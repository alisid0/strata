# CSP violation reporting — design and recommendation

Last updated: 2026-08-05
Status: **wired under the enforcing CSP.** `api/csp-report.js` is live in the
repo; `vercel.json` sends `report-uri` / `report-to` plus
`Reporting-Endpoints`. Confirm trimmed log lines after the next deploy.

Historical context: F-02 originally shipped as report-only with no collector,
then flipped to enforcing on 2026-07-30 without reporting. Reporting was added
afterwards so operators can see regressions without relying on user reports.

---

## What a CSP report contains, and why that matters

A violation report is JSON the browser POSTs when the page tries something the
policy forbids. A representative body:

```json
{
  "csp-report": {
    "document-uri": "https://qubix.university/reader/physics/forces",
    "referrer": "",
    "violated-directive": "script-src",
    "blocked-uri": "https://evil.example/x.js",
    "line-number": 42,
    "source-file": "https://qubix.university/assets/index-abc.js"
  }
}
```

`document-uri` can reveal which board a learner was on. The collector therefore
logs **path only**, never query strings or client IPs.

---

## Current header wiring

In `vercel.json`, the `/(.*)` header block includes:

```json
{ "key": "Reporting-Endpoints", "value": "csp-endpoint=\"/api/csp-report\"" }
```

and the enforcing `Content-Security-Policy` value ends with:

```
; report-uri /api/csp-report; report-to csp-endpoint
```

`report-uri` covers Safari and older Chromium/Firefox; `report-to` is the
modern Reporting API shape. Same-origin `/api/csp-report` means no CORS and no
cross-site data flow.

---

## Collector behaviour (`api/csp-report.js`)

- Accepts only POST; everything else gets 405.
- Caps body size to reject oversized spam.
- Parses defensively; malformed JSON gets 204 (never error, never retry-storm).
- Ignores common extension/browser noise (`chrome-extension:`, `moz-extension:`,
  `about`, `data`, `blob`).
- Logs a **trimmed** summary — violated directive, blocked URI path, and the
  path of document-uri.
- Never persists IPs.
- Always returns 204 quickly.

---

## Post-deploy verification

1. Deploy staging (or production) with the wired headers.
2. `curl -i -X POST https://<host>/api/csp-report -H 'content-type: application/json' -d '{"csp-report":{"violated-directive":"script-src","blocked-uri":"https://example.test/x.js","document-uri":"https://qubix.university/reader/demo?x=1"}}'`
3. Expect HTTP 204 and a `[csp-report]` line in Vercel logs with `documentPath`
   `/reader/demo` (no query).
4. Exercise Reader, Workshop, Quiz, GeoGebra, auth, and Mustang Lab once; triage
   any genuine violations (widen policy or fix code). Keep `'unsafe-eval'` only
   while math/`new Function` sinks still need it.

CDN notes (2026-08-05): Mustang Lab vendors Three.js under
`public/labs/mustang/vendor/`; `unpkg.com` and unused `cdnjs.cloudflare.com`
were removed from `script-src`. GeoGebra and Vercel Analytics remain allowlisted.

---

## Privacy policy note

Same-origin Option A adds no third-party processor, so the privacy policy needs
no new sub-processor entry. One line under data collection acknowledging that
technical security-policy violation paths may be logged is still worthwhile.
