# Hacksong Codex Plugin

Codex plugin for the Hacksong competition client. It exposes a `hacksong` skill, MCP tools, the `codex-hacksong` account/sync CLI, and a guarded `hacksong-codex` launcher.

## Install

Recommended public install:

```bash
export HACKSONG_SERVER=http://120.48.111.22
curl -fsSL "$HACKSONG_SERVER/hacksong/install.sh" | bash
```

The installer places this plugin under `~/.agents/plugins/hacksong-codex`, writes the personal marketplace entry, and installs both commands:

- `codex-hacksong`: account, team, sync retry, and diagnostics CLI.
- `hacksong-codex`: competition launcher that starts Codex only after Hacksong login is valid and reports each completed Codex turn when `task_complete` appears.

If the installer uses `~/.local/bin`, add it to `PATH`:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Persist it for zsh:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Login Flow

Before starting competition Codex, register or log in:

```bash
codex-hacksong register --name NAME --email EMAIL --password PASSWORD
codex-hacksong verify --token TOKEN
```

Or use an existing account:

```bash
codex-hacksong login --email EMAIL --password PASSWORD
```

Check readiness:

```bash
codex-hacksong doctor
```

After `Hacksong login token valid` is `[ok]`, start Codex through the guarded launcher:

```bash
hacksong-codex
```

Forward Codex arguments normally:

```bash
hacksong-codex exec "Use Hacksong to run doctor. Do not print tokens."
```

If Hacksong is not logged in, `hacksong-codex` refuses to start Codex and prints the required login/register commands.

While Codex is running, `hacksong-codex` starts a local watcher. Each completed question is uploaded immediately after Codex writes `task_complete` to `~/.codex/sessions`. Manual `codex-hacksong sync` is still available for retry or diagnostics.

## Update

Rerun the installer:

```bash
export HACKSONG_SERVER=http://120.48.111.22
curl -fsSL "$HACKSONG_SERVER/hacksong/install.sh" | bash
```

Then restart Codex or open a new Codex session so plugin, skill, and MCP changes are reloaded.

## Commands

```bash
codex-hacksong register --name NAME --email EMAIL --password PASSWORD
codex-hacksong verify --token TOKEN
codex-hacksong login --email EMAIL --password PASSWORD
codex-hacksong status
codex-hacksong team
codex-hacksong join INVITE_CODE
codex-hacksong sync
codex-hacksong doctor
codex-hacksong logout
hacksong-codex [codex args...]
```

The plugin never stores or prints service tokens. Authentication remains in `~/.hacksong/auth.json` with file mode `600`.
