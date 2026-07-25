# Google OAuth Scope Alignment — Verification Checklist

**Last verified:** _(fill in date before submission)_  
**Verified by:** Akshat Thakur

---

## Scopes Requested in Code

Source: `api/index.py` → `get_flow()` function (line ~155)

```python
scopes=[
    'https://www.googleapis.com/auth/gmail.send',
    'openid',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
]
```

---

## Required Cloud Console Configuration

### OAuth Consent Screen — Scopes Tab

Ensure these **exact** scopes are listed (no more, no less):

| Scope URI | Type | Purpose | Feature it Powers |
|-----------|------|---------|-------------------|
| `https://www.googleapis.com/auth/gmail.send` | Sensitive | Send email on behalf of user | Certificate delivery via Gmail |
| `openid` | Non-sensitive | OpenID Connect authentication | User login/identity |
| `https://www.googleapis.com/auth/userinfo.profile` | Non-sensitive | View basic profile info | Display user name |
| `https://www.googleapis.com/auth/userinfo.email` | Non-sensitive | View email address | Display connected account |

### Scopes That Should NOT Be Present

If any of these appear in your Cloud Console, **remove them immediately** — they are not used in code and will trigger a minimum-scope violation:

| Scope | Why it's wrong |
|-------|---------------|
| `https://www.googleapis.com/auth/gmail.compose` | Restricted. App does not manage drafts. |
| `https://www.googleapis.com/auth/gmail.modify` | Restricted. App does not modify mailbox. |
| `https://mail.google.com/` | Restricted (full access). Not needed. |
| `https://www.googleapis.com/auth/gmail.readonly` | App does not read emails. |
| `https://www.googleapis.com/auth/spreadsheets.readonly` | App uses public CSV export, not Sheets API OAuth. |
| `https://www.googleapis.com/auth/spreadsheets` | App never writes to Sheets. |
| `https://www.googleapis.com/auth/drive` | App does not access Drive. |
| `https://www.googleapis.com/auth/drive.readonly` | App does not access Drive. |

---

## Pre-Submission Verification Steps

### 1. Code ↔ Console Match

- [ ] Open Google Cloud Console → APIs & Services → OAuth consent screen → Scopes
- [ ] Confirm exactly 4 scopes are listed (gmail.send, openid, userinfo.profile, userinfo.email)
- [ ] Confirm no restricted scopes appear (gmail.send is "sensitive," not "restricted")
- [ ] Confirm no scopes are present that aren't in the `get_flow()` function

### 2. Consent Screen Display

- [ ] App name: "MailMyCertificate"
- [ ] Support email: _(your support email)_
- [ ] App logo: uploaded and matches the live app
- [ ] App homepage: `https://mailmycertificate.tech`
- [ ] Privacy policy link: `https://mailmycertificate.tech/privacy-policy`
- [ ] Terms of service link: `https://mailmycertificate.tech/terms-of-service`
- [ ] Authorized domains: `mailmycertificate.tech`

### 3. Authorized Redirect URIs

- [ ] Production: `https://mailmycertificate.tech/api/auth/callback`
- [ ] Development (optional): `http://localhost:3000/api/auth/callback`
- [ ] No other redirect URIs are listed

### 4. Publishing Status

- [ ] App is set to "In Production" (not "Testing") — required for verification submission
- [ ] If using a staging project for review, confirm it also has "In Production" status

### 5. API Enablement

- [ ] Gmail API is enabled in APIs & Services → Library
- [ ] No other Google Workspace APIs are enabled unless actively used (check for accidentally enabled Sheets API, Drive API, etc.)

---

## Scope Justification (for submission form)

When the Cloud Console verification form asks "Why do you need this scope?", use:

**gmail.send:**
> "MailMyCertificate sends personalized certificate PDF emails on behalf of the authenticated user when they complete the certificate generation workflow and click 'Send.' This allows event organizers to distribute certificates to participants directly from their own Gmail account. We use gmail.send (not gmail.compose or broader scopes) because we only send outbound messages and never need to read, modify, or manage the user's mailbox, drafts, or labels."

**openid / userinfo.profile / userinfo.email:**
> "Used to identify the authenticated user and display their email address in the app interface, confirming which Gmail account will be used for sending. No profile data is stored beyond the active session."

---

## If Google Asks You to Downscope

If a reviewer suggests a narrower scope:

- **For gmail.send:** This is already the narrowest Gmail sending scope. If asked to use a different approach, reply: "gmail.send is the minimum scope that supports sending emails with attachments on behalf of the user. There is no narrower scope available for this use case."

- **For openid/userinfo:** These are non-sensitive and standard for any OAuth login. If challenged, reply: "These are required to identify which Google account is connected and display the user's email in the interface."

---

## Quick Reference: Scope Classification

| Classification | What it means | Your scopes |
|---------------|---------------|-------------|
| Non-sensitive | Auto-approved, no verification needed | openid, userinfo.profile, userinfo.email |
| Sensitive | Requires verification (this submission) | gmail.send |
| Restricted | Requires verification + security assessment | _(none — you don't use any)_ |

Since `gmail.send` is **sensitive** (not restricted), you need OAuth verification but do **not** need a third-party security assessment (CASA). This significantly simplifies the process.
