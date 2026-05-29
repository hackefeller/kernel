set shell := ["bash", "-cu"]

root := justfile_directory()
kernel := root / "dist/kernel"

default:
    just --list

deps:
    cd "{{root}}"
    BUN_INSTALL_ALLOW_SCRIPTS="@ast-grep/napi" bun install

check:
    cd "{{root}}"
    bun run typecheck
    bun test

build:
    cd "{{root}}"
    bun run build
    test -x "{{kernel}}"

validate-binary:
    #!/usr/bin/env bash
    set -euo pipefail

    cd "{{root}}"

    KERNEL="{{kernel}}"
    command -v jq >/dev/null || {
      echo "jq is required for binary validation." >&2
      exit 1
    }

    test -x "$KERNEL"
    "$KERNEL" --version
    "$KERNEL" --help >/tmp/kernel-help-output.txt

    TMP_ROOT="${TMPDIR:-/tmp}"
    TMP_ROOT="${TMP_ROOT%/}"
    HOME_FIXTURE="$(mktemp -d "$TMP_ROOT/kernel-home-validation.XXXXXX")"
    FIXTURE="$(mktemp -d "$TMP_ROOT/kernel-cli-validation.XXXXXX")"
    printf 'home=%s\n' "$HOME_FIXTURE"
    printf 'fixture=%s\n' "$FIXTURE"

    cd "$FIXTURE"
    git init >/dev/null
    printf '{"name":"kernel-cli-validation"}\n' > package.json

    HOME="$HOME_FIXTURE" "$KERNEL" --json sync | jq -e '.catalogPath | length > 0' >/dev/null
    test -f .kernel/README.md
    test -f .kernel/.gitignore
    test -f .kernel/state.json
    grep -qx 'state.json' .kernel/.gitignore

    GOAL_JSON="$(HOME="$HOME_FIXTURE" "$KERNEL" --json goal new 'Improve onboarding' --tag docs,dx)"
    GOAL_ID="$(printf '%s' "$GOAL_JSON" | jq -r '.goalId')"
    printf 'goal=%s\n' "$GOAL_ID"

    DECISION_JSON="$(HOME="$HOME_FIXTURE" "$KERNEL" --json knowledge new 'Use repo-local workspace')"
    DECISION_ID="$(printf '%s' "$DECISION_JSON" | jq -r '.knowledgeId')"
    printf 'note=%s\n' "$DECISION_ID"

    TASK_JSON="$(HOME="$HOME_FIXTURE" "$KERNEL" --json task new 'Write setup guide' --goal "$GOAL_ID" --knowledge "$DECISION_ID")"
    TASK_ID="$(printf '%s' "$TASK_JSON" | jq -r '.taskId')"
    printf 'task=%s\n' "$TASK_ID"

    test -f .kernel/work/goals/"$GOAL_ID"/goal.md

    test -f .kernel/work/tasks/active/"$TASK_ID"/task.md

    test -f .kernel/knowledge/notes/"$DECISION_ID"/note.md

    HOME="$HOME_FIXTURE" "$KERNEL" --json goal status "$GOAL_ID" | jq -e '.goalId == "'"$GOAL_ID"'"' >/dev/null
    HOME="$HOME_FIXTURE" "$KERNEL" --json task status "$TASK_ID" | jq -e '.goalId == "'"$GOAL_ID"'"' >/dev/null
    HOME="$HOME_FIXTURE" "$KERNEL" --json knowledge status "$DECISION_ID" | jq -e '.knowledgeId == "'"$DECISION_ID"'"' >/dev/null

    HOME="$HOME_FIXTURE" "$KERNEL" --json goal list | jq -e '.items | length == 1' >/dev/null
    HOME="$HOME_FIXTURE" "$KERNEL" --json task list | jq -e '.tasks | length == 1' >/dev/null
    HOME="$HOME_FIXTURE" "$KERNEL" --json knowledge list | jq -e '.items | length == 1' >/dev/null

    HOME="$HOME_FIXTURE" "$KERNEL" --json goal plan "$GOAL_ID" >/dev/null
    HOME="$HOME_FIXTURE" "$KERNEL" --json task plan "$TASK_ID" >/dev/null

    HOME="$HOME_FIXTURE" "$KERNEL" --json task next "$TASK_ID" | jq -e '.checklistItemId == "clarify-scope"' >/dev/null
    HOME="$HOME_FIXTURE" "$KERNEL" --json task done clarify-scope --task "$TASK_ID" | jq -e '.remaining == 3' >/dev/null

    grep -q -- '- \[x\] Clarify scope and acceptance criteria' .kernel/work/tasks/active/"$TASK_ID"/task.md
    grep -q 'done: true' .kernel/work/tasks/active/"$TASK_ID"/task.md

    HOME="$HOME_FIXTURE" "$KERNEL" --json task archive "$TASK_ID" | jq -e '.archivedTo | contains(".kernel/work/tasks/archived/")' >/dev/null
    test ! -d .kernel/work/tasks/active/"$TASK_ID"
    HOME="$HOME_FIXTURE" "$KERNEL" --json task list --archived | jq -e '.tasks[0].id == "'"$TASK_ID"'"' >/dev/null

    HOME="$HOME_FIXTURE" "$KERNEL" --json task restore "$TASK_ID" | jq -e '.restoredTo == ".kernel/work/tasks/active/'"$TASK_ID"'"' >/dev/null
    test -d .kernel/work/tasks/active/"$TASK_ID"

    printf 'validation=passed\n'

ci: check build validate-binary

fix: ci

install: build
    mkdir -p "$HOME/bin"
    cp "{{kernel}}" "$HOME/bin/kernel"
    rm -rf "$HOME/bin/templates"
    cp -R "{{root}}/dist/templates" "$HOME/bin/templates"
    chmod +x "$HOME/bin/kernel"
    printf 'installed=%s\n' "$HOME/bin/kernel"

version-dry-run bump="patch":
    #!/usr/bin/env bash
    set -euo pipefail
    cd "{{root}}"
    current="$(node -p "require('./package.json').version")"
    next="$(node -e '
      const bump = process.argv[1];
      const current = process.argv[2];
      const parts = current.split(".").map(Number);
      if (parts.length !== 3 || parts.some(Number.isNaN)) throw new Error(`Unsupported current version: ${current}`);
      let next;
      if (/^\d+\.\d+\.\d+$/.test(bump)) next = bump;
      else if (bump === "major") next = `${parts[0] + 1}.0.0`;
      else if (bump === "minor") next = `${parts[0]}.${parts[1] + 1}.0`;
      else if (bump === "patch") next = `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
      else throw new Error(`Unsupported bump: ${bump}`);
      console.log(next);
    ' "{{bump}}" "$current")"
    printf 'current=%s\nnext=%s\n' "$current" "$next"

version-bump bump="patch":
    cd "{{root}}"
    npm version "{{bump}}" --no-git-tag-version

release-dry-run:
    #!/usr/bin/env bash
    set -euo pipefail
    cd "{{root}}"
    version="$(node -p "require('./package.json').version")"
    tag="v$version"
    printf 'version=%s\ntag=%s\ntarget=%s\n' "$version" "$tag" "$(git rev-parse HEAD)"
    if command -v gh >/dev/null; then
      if gh release view "$tag" >/dev/null 2>&1; then
        printf 'release_exists=true\n'
      else
        printf 'release_exists=false\n'
      fi
    else
      printf 'gh_available=false\n'
    fi

release *args:
    #!/usr/bin/env bash
    set -euo pipefail
    cd "{{root}}"
    confirm="false"
    for arg in "$@"; do
      case "$arg" in
        true) confirm="true" ;;
        confirm=true) confirm="true" ;;
        false) confirm="false" ;;
        confirm=false) confirm="false" ;;
        *) echo "Unknown release argument: $arg" >&2; exit 1 ;;
      esac
    done
    if [ "$confirm" != "true" ]; then
      just --justfile "{{root}}/Justfile" release-dry-run
      echo "Dry run only. Use: just release confirm=true"
      exit 0
    fi
    command -v gh >/dev/null || { echo "gh is required for release." >&2; exit 1; }
    version="$(node -p "require('./package.json').version")"
    tag="v$version"
    if gh release view "$tag" >/dev/null 2>&1; then
      echo "Release $tag already exists."
      exit 0
    fi
    gh release create "$tag" --title "$tag" --target "$(git rev-parse HEAD)" --notes "Kernel $version"

publish-dry-run: build
    #!/usr/bin/env bash
    set -euo pipefail
    cd "{{root}}"
    TMP_ROOT="${TMPDIR:-/tmp}"
    TMP_ROOT="${TMP_ROOT%/}"
    export npm_config_cache="${NPM_CONFIG_CACHE:-$TMP_ROOT/kernel-npm-cache}"
    npm publish --dry-run --access public --ignore-scripts

publish *args:
    #!/usr/bin/env bash
    set -euo pipefail
    cd "{{root}}"
    confirm="false"
    for arg in "$@"; do
      case "$arg" in
        true) confirm="true" ;;
        confirm=true) confirm="true" ;;
        false) confirm="false" ;;
        confirm=false) confirm="false" ;;
        *) echo "Unknown publish argument: $arg" >&2; exit 1 ;;
      esac
    done
    if [ "$confirm" != "true" ]; then
      just --justfile "{{root}}/Justfile" publish-dry-run
      echo "Dry run only. Use: just publish confirm=true"
      exit 0
    fi
    just --justfile "{{root}}/Justfile" build
    TMP_ROOT="${TMPDIR:-/tmp}"
    TMP_ROOT="${TMP_ROOT%/}"
    export npm_config_cache="${NPM_CONFIG_CACHE:-$TMP_ROOT/kernel-npm-cache}"
    npm publish --access public --ignore-scripts
