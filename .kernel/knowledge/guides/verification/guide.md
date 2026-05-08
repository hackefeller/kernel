# CLI Build, Install, and Multi-Host Verification Runbook

**For QA Testers:** This document provides a standardized process for testing CLI tool builds, system installation, multi-host synchronization, and deployment verification. Adapt the commands and paths to match your specific project.

## How to Use This Runbook

This runbook is a **template** — customize it for your project:

1. **Before starting:** Identify the key details about your project:
   - CLI tool name (e.g., `kernel`, `myapp`)
   - Build command (e.g., `bun run build`, `npm run build`, `cargo build`)
   - Install location (typically `~/bin/`)
   - Agent hosts to test (typically Claude, Copilot, Codex, Pi)
   - Expected features/commands (skills, commands, plugins)

2. **During testing:** Replace all placeholders with actual values:
   - `<CLI_NAME>` → your CLI's actual name
   - `<BUILD_COMMAND>` → your project's build command
   - `<PROJECT_ROOT>` → path to your repository
   - `<BINARY_PATH>` → where the compiled binary is output
   - `EXPECTED_SKILLS` and `EXPECTED_COMMANDS` → your project's features

3. **Record issues:** Note any unexpected behavior or errors. Use the Troubleshooting section to investigate and resolve.

4. **Sign off:** Complete the Testing Checklist and document results.

## Prerequisites

- Build runtime installed (e.g., Bun, Node, Rust, Go)
- Task runner installed (e.g., `just`, `make`, npm scripts)
- Read/write access to required agent directories (`~/.agents`, `~/.claude`, `~/.codex`, `~/.copilot`, `~/.pi`)
- Project repository with build configuration
- Access to all target agent hosts for verification

## Phase 1: Compilation

### Step 1.1: Build the CLI Binary

**Command Template:**
```bash
cd <PROJECT_ROOT> && <BUILD_COMMAND>
```

**Customize for your project:**
- `<PROJECT_ROOT>`: Path to your CLI project repository
- `<BUILD_COMMAND>`: Your build command (e.g., `bun run build`, `npm run build`, `cargo build --release`)

**Example:**
```bash
cd /Users/username/Developer/myproject && bun run build
```

**What to expect:**
- Build process removes or updates output directory (typically `dist/` or `build/`)
- Bundles source code and all dependencies
- Compiles to self-contained executable
- Uses appropriate compiler flags (e.g., Bun's `--compile`, Go's `-ldflags`, etc.)

**Verification:**
```bash
# Find the compiled binary (typical locations: dist/, build/, target/release/)
ls -lh <BINARY_PATH>
file <BINARY_PATH>
<BINARY_PATH> --version
```

**Success criteria:**
- Binary file exists and is executable
- File command identifies it as a binary (e.g., "ELF 64-bit", "Mach-O 64-bit")
- Version command outputs a version number

---

## Phase 2: Installation

### Step 2.1: Install to User Bin Directory

**Command Template:**
```bash
cd <PROJECT_ROOT> && <INSTALL_COMMAND>
```

**Customize for your project:**
- `<PROJECT_ROOT>`: Path to your CLI project repository
- `<INSTALL_COMMAND>`: Your install command (e.g., `just install`, `npm run install:bin`, manual copy)

**Manual installation (if no install script):**
```bash
mkdir -p ~/bin
cp <BINARY_PATH> ~/bin/<CLI_NAME>
chmod +x ~/bin/<CLI_NAME>
```

**What to verify:**
- Binary copied to `~/bin/<CLI_NAME>`
- File is executable (`chmod +x`)
- Available in user's PATH

**Verification:**
```bash
which <CLI_NAME>           # Should show: $HOME/bin/<CLI_NAME>
<CLI_NAME> --version      # Should match built version
<CLI_NAME> --help         # Should display command surface
```

**Success criteria:**
- CLI tool is in PATH and callable by name
- Version matches the build output
- Help text displays without errors

### Step 2.2: (Optional) System-Wide Installation

**Note:** System-wide installation (`/usr/local/bin`) may require `sudo` permissions. Use this only if the CLI needs to be accessible to all users or from contexts where `~/bin` is not in PATH.

```bash
sudo cp ~/bin/<CLI_NAME> /usr/local/bin/<CLI_NAME>
sudo chmod +x /usr/local/bin/<CLI_NAME>
which <CLI_NAME>  # Should now show: /usr/local/bin/<CLI_NAME>
```

---

## Phase 3: Agent Host Synchronization

### Step 3.1: Distribute CLI to Agent Hosts

**Purpose:** Deploy skills, commands, or integrations from the CLI to multiple agent host directories for multi-agent support.

**Command Template:**
```bash
<CLI_NAME> sync
```

**Or manual distribution:**
```bash
# Copy skills/commands from canonical source to agent directories
cp -r src/templates/skills/* ~/.agents/skills/
cp src/templates/commands/* ~/.agents/commands/

# Distribute to specific hosts (create symlinks for efficiency)
for host in claude codex copilot pi; do
  ln -sf ~/.agents/skills/* ~/.${host}/skills/ 2>/dev/null
done
```

**What to verify:**
- Canonical catalog at `~/.agents/` receives new files from source
- Skills/commands distributed to enabled hosts:
  - `~/.claude/` — Claude
  - `~/.codex/` — Codex (Amazon Q)
  - `~/.copilot/` — GitHub Copilot
  - `~/.pi/` — Pi (terminal harness)
- Stale/orphaned items removed from hosts
- Symlinks or copies created correctly

**Expected output patterns:**
- **written**: New files added
- **replaced**: Existing files updated
- **removed**: Deleted files (old versions, deprecated features)
- **synced**: All hosts up-to-date

---

## Phase 4: Host Verification

### Step 4.1: Check Canonical Catalog

**Verify the source of truth:** All synced content should exist in `~/.agents/` before being distributed to individual hosts.

**Command Template:**
```bash
ls -la ~/.agents/skills/ | head -20
ls -1 ~/.agents/commands/ | head -20
```

**Success criteria:**
- Skills directory contains expected feature files (subdirectories or individual files)
- Commands directory contains expected command definitions (YAML or Markdown)
- File count and names match your project's feature set

**Example (check for specific features):**
```bash
# Check for expected features
EXPECTED_SKILLS="feature-plan feature-execute feature-status feature-close"
for skill in $EXPECTED_SKILLS; do
  if [ -d ~/.agents/skills/$skill ]; then
    echo "✓ $skill"
  else
    echo "✗ MISSING: $skill"
  fi
done
```

### Step 4.2: Verify Distribution to Each Host

**Purpose:** Confirm that skills and commands were distributed (via symlink or copy) to all enabled hosts.

**Command Template:**
```bash
# Check each host
for host in claude codex copilot pi; do
  echo "=== $host ==="
  ls -1 ~/.${host}/skills/ 2>/dev/null | head -10 || echo "(no skills directory)"
  ls -1 ~/.${host}/commands/ 2>/dev/null | head -10 || echo "(no commands directory)"
done
```

**Verify symlinks (if using symlink distribution):**
```bash
# Check if ~/.claude/skills point to ~/.agents/skills
ls -l ~/.claude/skills/ | head -3
# Should show: lrwxr-xr-x ... feature-plan -> /Users/username/.agents/skills/feature-plan
```

**Success criteria:**
- All hosts have symlinks or copies of skills from `~/.agents/skills/`
- Commands distributed according to host structure:
  - Claude: `~/.claude/commands/` or `~/.claude/commands/features/`
  - Copilot: `~/.copilot/commands/` (typically flat structure)
  - Codex: `~/.codex/commands/`
  - Pi: `~/.pi/agent/prompts/`

### Step 4.3: Verify Removed/Deprecated Items

**Purpose:** Ensure that old features or deprecated commands were cleaned up during sync.

**Command Template:**
```bash
# Check for deprecated features (adjust grep pattern to your project)
echo "Checking for deprecated items..."
for host in claude codex copilot; do
  deprecated=$(ls ~/.${host}/commands/ 2>/dev/null | grep -i "deprecated\|legacy\|old" | wc -l)
  if [ "$deprecated" -eq 0 ]; then
    echo "  ✓ $host: No deprecated items"
  else
    echo "  ✗ $host: Found $deprecated deprecated items - should be removed"
  fi
done
```

### Step 4.4: Verify Host Directory Structures

**Purpose:** Confirm each host has the correct directory layout for how it discovers and loads features.

**Claude (typically has nested command structure):**
```bash
find ~/.claude -maxdepth 3 -type d | grep -E "(skills|commands)" | sort
```

Expected:
```
~/.claude/skills/           (symlinks to ~/.agents/skills/)
~/.claude/commands/
~/.claude/commands/features/ (or similar nested structure)
```

**Copilot (typically flat command structure):**
```bash
ls -1 ~/.copilot/ | grep -E "(skills|commands)"
ls -1 ~/.copilot/commands/ | head -10
```

Expected:
```
~/.copilot/skills/    (symlinks to ~/.agents/skills/)
~/.copilot/commands/  (flat markdown/yaml files, no subdirectories)
```

**Pi (native skill discovery):**
```bash
ls -1 ~/.pi/ | grep -E "(skills|agent)"
ls -1 ~/.pi/agent/prompts/ | head -10
```

Expected:
```
~/.pi/agent/prompts/  (command definitions)
~/.pi/agent/sessions/ (runtime state)
```

Note: Pi typically discovers skills natively from `~/.agents/skills/` and does NOT have a `~/.pi/skills/` directory.

---

## Phase 5: Functional Testing

**Purpose:** Verify that the CLI tool works correctly and displays expected commands and help text.

### Step 5.1: Test CLI Help Output

**Command:**
```bash
<CLI_NAME> --help
```

**Success criteria:**
- Help text displays without errors
- All primary commands are listed
- New/updated commands appear first (if applicable)
- Legacy commands appear below (if backward compatibility maintained)
- Usage examples are clear

**What to check:**
- Command names and descriptions are accurate
- No deprecated or removed commands appear
- Required and optional flags are documented
- Examples are relevant and functional

### Step 5.2: Test Primary Command Help

**Command Template:**
```bash
<CLI_NAME> <PRIMARY_COMMAND> --help
```

**Example:**
```bash
kernel plan --help
```

**Success criteria:**
- Help text displays for the command
- Usage syntax is clear
- Options/flags are documented with descriptions
- `-h` or `--help` flag works
- No error messages

### Step 5.3: Test Command Without Arguments

**Purpose:** Verify graceful handling when command is invoked without required arguments.

**Command Template:**
```bash
<CLI_NAME> <PRIMARY_COMMAND>
```

**Success criteria:**
- Either displays helpful prompt with examples, OR
- Shows usage/error message guiding the user
- Does not crash or hang
- Exit code indicates command did not fully execute

### Step 5.4: Test Status/Info Commands

**Command Template:**
```bash
<CLI_NAME> status
<CLI_NAME> info
<CLI_NAME> --version
```

**Success criteria:**
- Status/info command returns relevant information about system state
- Version matches the compiled binary version
- No errors or warnings (unless expected)

### Step 5.5: Test Command Options

**Command Template (test each primary command):**
```bash
<CLI_NAME> <COMMAND> --help
<CLI_NAME> <COMMAND> --dry-run --help
<CLI_NAME> <COMMAND> --verbose
```

**Success criteria:**
- All documented options are recognized
- Help text for options is clear
- Options don't cause errors when specified
- `--dry-run` or preview modes work as expected

### Step 5.6: Test Backward Compatibility (if applicable)

**Purpose:** Verify that legacy commands still work if they're maintained for compatibility.

**Command Template:**
```bash
<CLI_NAME> legacy-command --help
<CLI_NAME> old-feature --help
```

**Success criteria:**
- Legacy commands still execute
- Help text indicates they are legacy (if desired)
- Functionality works as before
- Clear migration path documented (if deprecating)

---

## Summary Verification Script

Here's a reusable verification script template for QA testing:

```bash
#!/bin/bash
# CLI Verification Script Template
# Customize the variables below for your project

CLI_NAME="<YOUR_CLI_NAME>"        # e.g., "kernel", "myapp"
BINARY_PATH="~/bin/${CLI_NAME}"
EXPECTED_SKILLS="skill1 skill2 skill3"  # Space-separated list
EXPECTED_COMMANDS="cmd1 cmd2 cmd3"      # Space-separated list
HOSTS="claude codex copilot"

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                    ${CLI_NAME} CLI VERIFICATION                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check CLI installed
echo "CLI Installation:"
if [ -x "$BINARY_PATH" ]; then
  echo "  ✓ $BINARY_PATH exists and is executable"
  VERSION=$($BINARY_PATH --version 2>&1)
  echo "  ✓ Version: $VERSION"
else
  echo "  ✗ $BINARY_PATH not found or not executable"
  exit 1
fi
echo ""

# Check canonical catalog
echo "Canonical Catalog (~/.agents/):"
SKILL_COUNT=0
for skill in $EXPECTED_SKILLS; do
  if [ -d ~/.agents/skills/$skill ] || [ -f ~/.agents/skills/${skill}.* ]; then
    echo "  ✓ $skill"
    ((SKILL_COUNT++))
  else
    echo "  ✗ MISSING: $skill"
  fi
done

CMD_COUNT=0
for cmd in $EXPECTED_COMMANDS; do
  if [ -f ~/.agents/commands/${cmd}.yaml ] || [ -f ~/.agents/commands/${cmd}.md ]; then
    echo "  ✓ $cmd command"
    ((CMD_COUNT++))
  else
    echo "  ✗ MISSING: $cmd command"
  fi
done
echo ""

# Check for deprecated items (customize pattern for your project)
echo "Deprecated Items Check:"
DEPRECATED=$(ls ~/.agents/commands/ 2>/dev/null | grep -i "deprecated\|legacy\|old" | wc -l)
if [ "$DEPRECATED" -eq 0 ]; then
  echo "  ✓ No deprecated items in canonical catalog"
else
  echo "  ✗ Found $DEPRECATED deprecated items (should be removed)"
fi
echo ""

# Check hosts
echo "Host Distribution (symlinks/copies):"
for host in $HOSTS; do
  echo "  $host:"
  AVAILABLE=$(ls -1 ~/.${host}/skills/ 2>/dev/null | wc -l)
  if [ "$AVAILABLE" -gt 0 ]; then
    echo "    ✓ Skills distributed ($AVAILABLE items)"
  else
    echo "    ✗ No skills found"
  fi
done
echo ""

# Test CLI commands
echo "CLI Functionality:"
if $CLI_NAME --help &>/dev/null; then
  echo "  ✓ --help works"
else
  echo "  ✗ --help failed"
fi

if $CLI_NAME --version &>/dev/null; then
  echo "  ✓ --version works"
else
  echo "  ✗ --version failed"
fi
echo ""

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                     ✅ VERIFICATION COMPLETE                               ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
```

**To use this script:**
1. Copy the template to a file (e.g., `verify-cli.sh`)
2. Replace the variables at the top with your project's specifics
3. Run: `bash verify-cli.sh`

---

## Troubleshooting

### Issue: CLI command not found after installation

**Problem:** `command not found: <CLI_NAME>`

**Diagnosis:**
```bash
# Check if binary exists and is executable
ls -lh ~/bin/<CLI_NAME>
file ~/bin/<CLI_NAME>

# Check if ~/bin is in PATH
echo $PATH | grep -E "~/bin|$HOME/bin"
```

**Solution:**
```bash
# Option 1: Verify ~/bin is in PATH
which <CLI_NAME>  # Should return ~/bin/<CLI_NAME>

# Option 2: Add ~/bin to PATH if missing
# Edit ~/.zshrc or ~/.bash_profile and add:
export PATH="$HOME/bin:$PATH"

# Then reload shell:
source ~/.zshrc
```

### Issue: Binary is not executable

**Diagnosis:**
```bash
ls -la ~/bin/<CLI_NAME>
# Should show: -rwxr-xr-x (executable permissions)
```

**Solution:**
```bash
chmod +x ~/bin/<CLI_NAME>
./~/bin/<CLI_NAME> --version  # Test
```

### Issue: Host synchronization fails

**Problem:** Sync command fails or reports errors

**Diagnosis:**
```bash
# Run sync with verbose/debug output
<CLI_NAME> sync --verbose
<CLI_NAME> sync --json  # If available, provides structured error output

# Check source templates exist
ls -la src/templates/skills/
ls -la src/templates/commands/
```

**Solution:**
```bash
# Option 1: Verify source templates are valid
cd <PROJECT_ROOT>
# Run any template validation tests
<BUILD_TOOL> test src/templates/  # or similar

# Option 2: Check file permissions on host directories
chmod 755 ~/.agents ~/.agents/skills ~/.agents/commands
chmod 755 ~/.claude ~/.claude/skills ~/.claude/commands
# Repeat for other hosts

# Option 3: Force clean sync (if safe)
rm -rf ~/.agents/commands/*.yaml
rm -rf ~/.agents/skills/*
<CLI_NAME> sync
```

### Issue: Skills/commands not found on agent hosts after sync

**Problem:** Files synced to `~/.agents/` but not appearing on individual hosts

**Diagnosis:**
```bash
# Check canonical catalog
ls ~/.agents/skills/
ls ~/.agents/commands/

# Check host directories
ls ~/.claude/skills/
ls ~/.copilot/commands/

# Check for symlinks vs copies
ls -l ~/.claude/skills/ | head -5
```

**Solution:**
```bash
# Option 1: Re-run sync (may fix symlink/copy issues)
<CLI_NAME> sync

# Option 2: Manually verify/create symlinks
ln -sf ~/.agents/skills/* ~/.claude/skills/ 2>/dev/null
ln -sf ~/.agents/commands/* ~/.copilot/commands/ 2>/dev/null

# Option 3: Check for permission issues
stat ~/.agents/skills/
stat ~/.claude/skills/
```

### Issue: Deprecated/removed features still appear after sync

**Problem:** Old commands or skills still present even after updating

**Diagnosis:**
```bash
# Check for stale files
ls ~/.agents/commands/ | grep -i deprecated
ls ~/.agents/commands/ | grep -i legacy

# Check host directories
ls ~/.claude/commands/ | grep -i deprecated
```

**Solution:**
```bash
# Manual cleanup (verify these should actually be removed)
rm ~/.agents/commands/old-feature.*
rm ~/.agents/skills/deprecated-*

# Re-sync to propagate removal
<CLI_NAME> sync

# Verify removal
ls ~/.agents/commands/ | grep old-feature || echo "✓ Removed"
```

### Issue: Version mismatch between binary and installed CLI

**Diagnosis:**
```bash
# Compare versions
./dist/<CLI_NAME> --version   # Built version
<CLI_NAME> --version           # Installed version
```

**Solution:**
```bash
# Rebuild and reinstall
<BUILD_COMMAND>
<INSTALL_COMMAND>

# Verify
<CLI_NAME> --version
```

---

## Expected Changes During Build/Sync Process

**Templates & Skills** (src/templates/):
- New skills added to `src/templates/skills/<feature-name>/`
- Updated commands in `src/templates/commands/`
- Deprecated or removed files should be deleted before sync
- Directory structure depends on your project's host integration patterns

**CLI Source Code** (src/cli/ or equivalent):
- Command implementations in language-appropriate directory
- Command registration in main CLI handler/router
- Help text and option definitions
- Version management (typically in package.json or version file)

**Configuration Files:**
- Build configuration (tsconfig.json, Cargo.toml, go.mod, etc.)
- Sync configuration (.kernel/config.yaml or equivalent)
- Registry or manifest files listing available features
- Task runner configuration (justfile, Makefile, package.json scripts)

**When testing changes:**
- Track which files are modified before and after sync
- Verify modifications don't introduce breaking changes
- Ensure version number is updated consistently
- Confirm all dependencies are resolved during build

---

## Quick Reference: Testing Workflow

```bash
# 1. Build the CLI
cd <PROJECT_ROOT> && <BUILD_COMMAND>

# 2. Verify binary was created
ls -lh <BINARY_OUTPUT_PATH>
<BINARY_OUTPUT_PATH> --version

# 3. Install to PATH
<INSTALL_COMMAND>
# Or manually:
cp <BINARY_OUTPUT_PATH> ~/bin/<CLI_NAME>
chmod +x ~/bin/<CLI_NAME>

# 4. Verify installation
which <CLI_NAME>
<CLI_NAME> --version
<CLI_NAME> --help

# 5. Sync to agent hosts (if applicable)
<CLI_NAME> sync
# Or manually sync templates:
cp -r src/templates/skills/* ~/.agents/skills/
cp src/templates/commands/* ~/.agents/commands/

# 6. Verify distribution to hosts
ls ~/.agents/skills/ | head -10
ls ~/.claude/skills/ | head -10
ls ~/.copilot/commands/ | head -10

# 7. Run functional tests
<CLI_NAME> <PRIMARY_COMMAND> --help
<CLI_NAME> <PRIMARY_COMMAND>
<CLI_NAME> status
```

---

## Testing Checklist

Use this checklist for comprehensive QA testing:

- [ ] **Build Phase**
  - [ ] Binary compiles without errors
  - [ ] Binary is executable (`file` command confirms)
  - [ ] Version command returns a version number

- [ ] **Installation Phase**
  - [ ] Binary copied to `~/bin/`
  - [ ] Binary is executable after copying
  - [ ] `which <CLI_NAME>` returns correct path
  - [ ] Version matches after installation

- [ ] **Synchronization Phase** (if applicable)
  - [ ] Sync command completes without errors
  - [ ] New skills/commands appear in `~/.agents/`
  - [ ] Deprecated items removed from `~/.agents/`
  - [ ] Distribution to each host successful

- [ ] **Host Verification Phase**
  - [ ] Canonical catalog (`~/.agents/`) has expected files
  - [ ] Each host has symlinks or copies of skills
  - [ ] Host directory structures match expected layout
  - [ ] No stale/orphaned files on hosts

- [ ] **Functional Testing Phase**
  - [ ] `--help` displays without errors
  - [ ] `--version` returns expected version
  - [ ] Primary commands have help text
  - [ ] Commands handle missing arguments gracefully
  - [ ] Backward compatibility maintained (if applicable)
  - [ ] Exit codes are correct (0 for success, non-zero for errors)

---

## Next Steps After Verification

Once testing is complete and all criteria pass:

1. **Review Results** — Document any issues found and fixes applied
2. **Sign Off** — QA tester confirms all tests passed
3. **Update Documentation** — Update README or wiki with new features
4. **Integration Testing** — Test with actual agent hosts (Claude, Copilot, Codex, Pi) if applicable
5. **Production Deployment** — Deploy to production environment with appropriate rollout strategy
6. **Monitor** — Watch for issues in early adoption period
7. **Communicate** — Announce new features or changes to users
