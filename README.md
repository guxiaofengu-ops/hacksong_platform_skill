# Hacksong Codex Plugin

Codex plugin for the Hacksong Linux competition client. It exposes a `hacksong` skill and MCP tools that guide Codex to use the local `codex-hacksong` CLI for registration, login, team checks, and Codex session sync.

## Install

Recommended public install:

```bash
export HACKSONG_SERVER=http://120.48.111.22
curl -fsSL "$HACKSONG_SERVER/hacksong/install.sh" | bash
```

The installer places this plugin under `~/.agents/plugins/hacksong-codex`, writes the personal marketplace entry, and installs `codex-hacksong` on `PATH`.

The plugin never stores or prints service tokens. Authentication remains in `~/.hacksong/auth.json` with file mode `600`.
