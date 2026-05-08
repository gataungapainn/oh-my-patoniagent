# Installation

## For Humans

Paste into your LLM agent session:

```
Install and configure oh-my-patoniagent following the instructions here:
https://raw.githubusercontent.com/gataungapainn/oh-my-patoniagent/refs/heads/dev/docs/guide/installation.md
```

**Alternative: install manually**

Install as an OpenCode plugin:

```bash
bunx opencode plugin install oh-my-patoniagent
```

Pin a specific version:

```bash
bunx opencode plugin install oh-my-patoniagent@0.1.2
```

Verify installation:

```bash
bunx opencode plugin list
```

**Note**: This package runs as an OpenCode plugin using Bun runtime. It does **not** require platform-specific standalone binary packages.

After installation, read the [overview guide](./overview.md) to understand how the plugin works.

---

## For LLM Agents

**IMPORTANT: Use `curl` to fetch this file, NOT WebFetch.** WebFetch summarizes content and loses critical flags like `--openai`, subscription questions, max20 mode details. Use:

```bash
curl -fsSL https://raw.githubusercontent.com/gataungapainn/oh-my-patoniagent/refs/heads/dev/docs/guide/installation.md
```

If you're an LLM Agent helping set up oh-my-patoniagent, welcome. You'll help the user install the harness and verify setup cleanly.

Follow these steps:

### Step 0: Ask user about subscriptions

Ask the user these questions to determine CLI options:

1. **Do you have a Claude Pro/Max Subscription?**
   - **yes**: **Are you on max20 (20x mode)?**
     - **max20** → `--claude=max20`
     - **not max20** → `--claude=yes`
   - **no** → `--claude=no`

2. **Do you have an OpenAI/ChatGPT Plus Subscription?**
   - **yes** → `--openai=yes`
   - **no** → `--openai=no` (default)

3. **Will you integrate Gemini models?**
   - **yes** → `--gemini=yes`
   - **no** → `--gemini=no`

4. **Do you have a GitHub Copilot Subscription?**
   - **yes** → `--copilot=yes`
   - **no** → `--copilot=no`

5. **Do you have access to OpenCode Zen (opencode/ models)?**
   - **yes** → `--opencode-zen=yes`
   - **no** → `--opencode-zen=no` (default)

6. **Do you have a Z.ai Coding Plan subscription?**
   - **yes** → `--zai-coding-plan=yes`
   - **no** → `--zai-coding-plan=no` (default)

7. **Do you have an OpenCode Go subscription?**
   - OpenCode $10/month subscription providing access to GLM-5, Kimi K2.5, MiniMax M2.7 models
   - **yes** → `--opencode-go=yes`
   - **no** → `--opencode-go=no` (default)

8. **Do you have a Kimi Coding subscription?**
   - **yes** → `--kimi-for-coding=yes`
   - **no** → `--kimi-for-coding=no` (default)

9. **Do you use Vercel Gateway?**
   - **yes** → `--vercel-ai-gateway=yes`
   - **no** → `--vercel-ai-gateway=no` (default)

**Provider selection is agent-specific.** The installer and runtime do not use one single global provider priority. Each agent resolves against its own fallback chain.

**WARNING**: If the user does NOT have a Claude subscription, the Sisyphus agent will not work ideally.

### Step 1: Install OpenCode (if not installed)

```bash
if command -v opencode > /dev/null; then
  echo "OpenCode $(opencode --version) installed"
else
  echo "OpenCode not installed. Please install first."
  echo "Ref: https://opencode.ai/docs"
fi
```

If OpenCode isn't installed, check [OpenCode Installation Guide](https://opencode.ai/docs).

### Step 2: Run installer

Based on user's answers, run the CLI installer with appropriate flags:

```bash
bunx oh-my-patoniagent install --no-tui --claude=<yes|no|max20> --gemini=<yes|no> --copilot=<yes|no> [--openai=<yes|no>] [--opencode-go=<yes|no>] [--opencode-zen=<yes|no>] [--zai-coding-plan=<yes|no>] [--kimi-for-coding=<yes|no>] [--vercel-ai-gateway=<yes|no>] [--skip-auth]
```

**Examples:**

- User with all native subscriptions: `bunx oh-my-patoniagent install --no-tui --claude=max20 --openai=yes --gemini=yes --copilot=no`
- User with only Claude: `bunx oh-my-patoniagent install --no-tui --claude=yes --gemini=no --copilot=no`
- User with Claude + OpenAI: `bunx oh-my-patoniagent install --no-tui --claude=yes --openai=yes --gemini=no --copilot=no`
- User with only GitHub Copilot: `bunx oh-my-patoniagent install --no-tui --claude=no --gemini=no --copilot=yes`
- User with Z.ai Librarian: `bunx oh-my-patoniagent install --no-tui --claude=yes --gemini=no --copilot=no --zai-coding-plan=yes`
- User with only OpenCode Zen: `bunx oh-my-patoniagent install --no-tui --claude=no --gemini=no --copilot=no --opencode-zen=yes`

### Step 3: Verify installation

After the installer completes, verify:

```bash
bunx opencode plugin list
```

Expected: `oh-my-patoniagent` should appear in the plugin list.

### Step 4: Run doctor check

```bash
bunx oh-my-patoniagent doctor
```

This verifies:
- Plugin is loaded correctly
- Provider authentication is configured
- Configuration files are valid

### Step 5: Authenticate providers

Based on the subscriptions selected, guide the user through authentication for each provider as prompted by the doctor output.

---

## Notes

- The published package name is `oh-my-patoniagent`
- This plugin does **not** ship platform-specific native binaries
- It runs entirely via Bun/Node.js runtime through OpenCode's plugin system
- Repository: https://github.com/gataungapainn/oh-my-patoniagent
