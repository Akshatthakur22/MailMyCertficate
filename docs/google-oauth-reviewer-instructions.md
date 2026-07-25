# Google OAuth Verification — Reviewer Testing Instructions

**App Name:** MailMyCertificate  
**Domain:** https://mailmycertificate.tech  
**Developer:** Akshat Thakur  
**Scopes Requested:** `gmail.send`, `openid`, `userinfo.profile`, `userinfo.email`

---

## What This App Does

MailMyCertificate is a free, open-source tool that lets event organizers:
1. Upload a certificate template (PNG/JPG image)
2. Import participant data (CSV file or public Google Sheet link)
3. Generate personalized PDF certificates in the browser
4. Send those certificates as email attachments via the user's own Gmail account

The Gmail API (`gmail.send` scope) is used **only** to send outbound emails on behalf of the authenticated user. The app never reads, modifies, or deletes any existing emails.

---

## Test Account Access

| Field | Value |
|-------|-------|
| **Login URL** | https://mailmycertificate.tech/email |
| **Test Account Email** | _(provide reviewer email or test account here)_ |
| **Test Account Password** | _(provide password if using a dedicated test account)_ |
| **2FA Status** | Disabled on test account |

> **Note:** If using Google's reviewer email, ensure it has been added to the OAuth consent screen's "Test users" list in the Google Cloud Console before the review begins.

---

## Step-by-Step Testing Flow

### Step 1: Open the Email Tool Page

Navigate to: **https://mailmycertificate.tech/email**

You will see the email sending interface with a "Connect Gmail" button.

### Step 2: Trigger OAuth Consent Screen

1. Click the **"Connect Gmail"** button.
2. A Google OAuth popup/redirect will appear showing the consent screen.
3. The consent screen will request permission to **"Send email on your behalf"** (`gmail.send`).
4. Click **"Allow"** to grant access.
5. You will be redirected back to the email page with a success indicator showing your connected Gmail address.

### Step 3: Prepare Test Data

To test the full certificate-sending flow, you need:

**Option A — Use the full tool workflow (recommended):**
1. Go to https://mailmycertificate.tech/tool
2. Upload any PNG/JPG image as a certificate template (a sample is provided in the repo: `Test_Template.png`)
3. Upload a CSV file with columns: `Name`, `Email` (sample below)
4. Position text fields on the template
5. Generate certificates
6. Proceed to the email step

**Option B — Direct email page (if already authenticated):**
1. On the `/email` page, certificates from the generation step will be pre-loaded
2. Compose a subject line and body
3. Click "Send"

### Sample CSV for Testing

```csv
Name,Email
Test Participant,reviewer-test-email@example.com
Jane Doe,reviewer-test-email2@example.com
```

Replace the email addresses with addresses you can verify receipt on.

### Step 4: Send a Test Certificate Email

1. After generating certificates in the tool, you'll be directed to the email page.
2. Review the pre-filled subject and body.
3. Click **"Send All"** or send individual certificates.
4. Confirm the email arrives in the recipient's inbox with a PDF attachment named `certificate.pdf`.

### Step 5: Verify — What the App Does NOT Do

After completing the flow, confirm:
- The app did **not** read any existing emails from the inbox
- The app did **not** create any drafts
- The app did **not** modify any labels, threads, or messages
- The only action was sending outbound emails with certificate attachments

### Step 6: Logout

1. Click the user avatar or "Disconnect" button on the email page.
2. The session is cleared. No credentials are retained.

---

## Extra Information for Reviewers

| Question | Answer |
|----------|--------|
| Does the app store OAuth tokens persistently? | No. Tokens live in server-side session cookies (max 1 hour, HttpOnly, Secure). No database storage. |
| Does the app access the user's inbox? | No. Only `gmail.send` is used — no read/modify/delete access. |
| Does the app use any AI/ML with Gmail data? | No. No AI or ML processing is applied to any Google user data. |
| Is the app open source? | Yes. https://github.com/akshatthakur22/MailMyCertficate |
| Privacy Policy URL | https://mailmycertificate.tech/privacy-policy |
| Terms of Service URL | https://mailmycertificate.tech/terms-of-service |

---

## Scope Justification (paste-ready for reviewer communication)

> "MailMyCertificate uses `https://www.googleapis.com/auth/gmail.send` to send personalized certificate PDF emails on behalf of the user when they complete the certificate generation workflow and click 'Send,' so that event organizers can distribute certificates to participants directly from their own Gmail account. No broader scope is needed because the app only sends outbound emails and never reads, modifies, or manages the user's mailbox."

---

## Troubleshooting

- **OAuth error "redirect_uri_mismatch":** Ensure the Cloud Console authorized redirect URI is exactly `https://mailmycertificate.tech/api/auth/callback`
- **"App not verified" warning:** Expected if the app is still in verification. Reviewers can proceed past the warning.
- **Session expired:** Sessions last 1 hour. Re-authenticate by clicking "Connect Gmail" again.
