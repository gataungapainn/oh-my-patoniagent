---
description: Publish oh-my-patoniagent to npm manually
argument-hint: <patch|minor|major>
---

<command-instruction>
You are the release manager for oh-my-patoniagent. Execute the manual npm publish workflow from start to finish.

## CRITICAL: ARGUMENT REQUIREMENT

**You MUST receive a version bump type from the user.** Valid options:
- `patch`: Bug fixes, backward-compatible (0.1.2 → 0.1.3)
- `minor`: New features, backward-compatible (0.1.2 → 0.2.0)
- `major`: Breaking changes (0.1.2 → 1.0.0)

**If the user does not provide a bump type argument, STOP IMMEDIATELY and ask:**
"To proceed with deployment, please specify the version bump type: `patch`, `minor`, or `major`"

**DO NOT PROCEED without explicit user confirmation of the bump type.**

---

## STEP 0: REGISTER TODO LIST (MANDATORY FIRST ACTION)

**Before doing ANYTHING else**, create a detailed todo list using TodoWrite:

```json
{
  "todos": [
    {"id": "confirm-bump", "content": "Confirm version bump type with user (patch/minor/major)", "status": "in_progress", "priority": "high"},
    {"id": "check-uncommitted", "content": "Check for uncommitted changes and commit if needed", "status": "pending", "priority": "high"},
    {"id": "run-tests", "content": "Run critical tests (bin/platform.test.ts)", "status": "pending", "priority": "high"},
    {"id": "bump-version", "content": "Bump version in package.json", "status": "pending", "priority": "high"},
    {"id": "build", "content": "Run bun run build", "status": "pending", "priority": "high"},
    {"id": "pack-dry-run", "content": "Run npm pack --dry-run to verify package contents", "status": "pending", "priority": "high"},
    {"id": "commit-version", "content": "Commit version bump and build artifacts", "status": "pending", "priority": "high"},
    {"id": "publish-npm", "content": "Publish to npm with OTP", "status": "pending", "priority": "high"},
    {"id": "verify-npm", "content": "Verify npm package published successfully", "status": "pending", "priority": "high"},
    {"id": "test-install", "content": "Test install as OpenCode plugin", "status": "pending", "priority": "high"},
    {"id": "push-git", "content": "Push version commit to GitHub", "status": "pending", "priority": "medium"}
  ]
}
```

**Mark each todo as `in_progress` when starting, `completed` when done. DO THIS ONE TIME.**

---

## STEP 1: CONFIRM BUMP TYPE

If bump type was provided as argument, confirm with user:
"Version bump type: `{bump}`. Proceed? (y/n)"

Wait for user confirmation before proceeding.

---

## STEP 2: CHECK UNCOMMITTED CHANGES

Run: `git status --porcelain`

- If there are uncommitted changes, warn the user and ask if they want to commit first
- If clean, proceed

---

## STEP 3: RUN CRITICAL TESTS

Run platform detection tests to ensure binary resolution works:

```bash
bun test bin/platform.test.ts
```

If tests fail, STOP and report the failure.

---

## STEP 4: BUMP VERSION

Run:
```bash
npm version {bump_type} --no-git-tag-version
```

This updates `package.json` with the new version.

---

## STEP 5: BUILD

Run:
```bash
bun run build
```

This generates:
- `dist/` (compiled plugin code)
- `assets/oh-my-patoniagent.schema.json` (config schema)

If build fails, STOP and report the error.

---

## STEP 6: VERIFY PACKAGE CONTENTS

Run:
```bash
npm pack --dry-run
```

This shows what will be included in the published package. Verify that:
- `dist/` is included
- `bin/` is included
- `postinstall.mjs` is included
- No sensitive files are included

---

## STEP 7: COMMIT VERSION BUMP

Commit the version bump and build artifacts:

```bash
git add package.json
git commit -m "chore(release): bump version to {new_version}"
```

---

## STEP 8: PUBLISH TO NPM

**IMPORTANT:** User must provide OTP (One-Time Password) from their authenticator app.

Ask user: "Please provide your npm OTP code (6 digits from authenticator app):"

Then run:
```bash
npm publish --otp={user_provided_otp}
```

If publish fails due to invalid OTP, ask for OTP again and retry.

---

## STEP 9: VERIFY NPM PUBLICATION

Wait 10 seconds for npm registry propagation, then verify:

```bash
npm view oh-my-patoniagent version
```

Expected output: `{new_version}`

If the version doesn't match, wait another 10 seconds and check again.

---

## STEP 10: TEST INSTALL AS OPENCODE PLUGIN

Instruct user to test installation:

```bash
bunx opencode plugin install oh-my-patoniagent@{new_version}
```

Then verify:
```bash
bunx opencode plugin list
```

Expected: `oh-my-patoniagent` should appear in the list.

---

## STEP 11: PUSH TO GITHUB

Push the version commit to GitHub:

```bash
git push origin dev
```

(Or whatever branch the user is on)

---

## FINAL CONFIRMATION

Present to user:

**✅ Release Complete**

- **Version**: `{new_version}`
- **npm**: https://www.npmjs.com/package/oh-my-patoniagent
- **GitHub**: https://github.com/gataungapainn/oh-my-patoniagent

**Installation command:**
```bash
bunx opencode plugin install oh-my-patoniagent
```

---

## NOTES

- This workflow does NOT publish platform-specific binary packages (oh-my-patoniagent-windows-x64, etc.)
- The plugin runs as an OpenCode plugin using Bun runtime, so native binaries are not required
- If you need to restore platform binary publishing, you'll need to set up GitHub Actions workflows and build infrastructure

</command-instruction>
