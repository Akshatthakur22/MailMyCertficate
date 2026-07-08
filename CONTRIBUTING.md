# Contributing to MailMyCertificate

Thank you for your interest in contributing! This document explains how to get started.

---

## Quick Links

- **GitHub:** https://github.com/akshatthakur22/MailMyCertficate
- **Issues:** https://github.com/akshatthakur22/MailMyCertficate/issues
- **Live site:** https://mailmycertificate.tech

---

## How to Contribute

### 1. Report Issues

Found a bug or have a suggestion? Open a GitHub issue with:

- **Description:** What's the problem or idea?
- **Reproduction steps:** How do I see it?
- **Environment:** Browser, OS, device (especially for UI issues)
- **Screenshots:** If visual, please include one

### 2. Suggest Features

Have an idea? Open a GitHub issue with:

- **Problem:** What real problem does this solve?
- **Current behavior:** How do users work around it?
- **Suggested solution:** What would improve it?
- **Alternatives:** What else might work?

### 3. Contribute Code

#### Setup

```bash
# Clone the repo
git clone https://github.com/akshatthakur22/MailMyCertficate.git
cd MailMyCertficate

# Install dependencies
npm install
pip install -r requirements.txt

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your values (or leave defaults for local dev)
```

#### Development

```bash
# Terminal 1: Start Next.js dev server
npm run dev

# Terminal 2: Start Flask backend (if working on email/auth)
python api/index.py
```

Open http://localhost:3000

#### Code Style

- **TypeScript:** Use for all new frontend code
- **Components:** Keep small and focused (single responsibility)
- **Naming:** Use descriptive names (`isLoading` not `loading`)
- **Comments:** Explain *why*, not *what*
- **Testing:** Test locally in Chrome and Firefox

#### Before You Commit

- Run the linter: `npm run lint`
- Test your changes manually
- Make sure the app still builds: `npm run build`

#### Commit Messages

Use this format:

- `fix: Fix email validation logic` — Bug fixes
- `feature: Add dark mode` — New features
- `docs: Update README` — Documentation only
- `refactor: Simplify CSV parsing` — Code cleanup (no behavior change)

#### Opening a Pull Request

1. Fork the repository
2. Create a branch: `git checkout -b fix/issue-name`
3. Make your changes
4. Commit: `git commit -m "fix: Description"`
5. Push: `git push origin fix/issue-name`
6. Open a PR on GitHub with a description

**PR Title:** Keep it under 60 characters

**PR Description:**
- What changed and why?
- Any relevant issue numbers (#123)
- How was this tested?

### 4. Improve Documentation

- Fix typos in README.md
- Expand the guide at `/guide`
- Add examples or tutorials
- Clarify confusing sections

Open a PR with your improvements.

---

## Code of Conduct

- **Be respectful:** Assume good intent
- **Be inclusive:** Welcome all backgrounds
- **Be constructive:** Focus on ideas, not people
- **Be patient:** Maintainers are volunteers

---

## Development Philosophy

MailMyCertificate is built around these principles:

- **Privacy first:** Users control their data
- **Browser first:** Client-side processing when possible
- **Simplicity:** Remove friction, not add features
- **Honesty:** Clear communication, no dark patterns
- **Craftsmanship:** Details matter

When contributing, keep these in mind.

---

## Questions?

- Open a GitHub Issue (public discussion)
- Check existing issues (your question might be answered)
- Email: [Check profile for contact info]

---

## Recognition

Contributors are recognized in the README. Thank you for your time and effort!

---

Happy contributing! 🎓
