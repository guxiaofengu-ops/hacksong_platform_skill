---
name: hacksong
description: Enter the Hacksong competition server from Codex, including login, registration, team management, and sync.
---

# Hacksong

Use this skill when the user wants to operate the Hacksong competition environment from Codex on Linux.

## Required behavior

- Prefer the local `codex-hacksong` CLI; do not call Hacksong server APIs directly from prompts.
- Never print, copy, summarize, or store access tokens, refresh tokens, passwords, or `~/.hacksong/auth.json` contents.
- Treat the server as the source of truth for account state, team membership, invite code, and sync ACK status.
- Keep the flow scoped to account binding, team inspection/join, guarded Codex startup, and Codex session sync.

## Commands

- `codex-hacksong doctor`: check Codex, local config, login, team route, and sync route.
- `codex-hacksong register --name NAME --email EMAIL --password PASSWORD`: create a test or contestant account.
- `codex-hacksong verify --token TOKEN`: verify email and save login state.
- `codex-hacksong login --email EMAIL --password PASSWORD`: bind an existing Hacksong account.
- `codex-hacksong status`: show server status, user, and current team summary.
- `codex-hacksong team`: show team details and members.
- `codex-hacksong join INVITE_CODE`: join a team with an invite code.
- `codex-hacksong sync`: upload one Codex turn and file event to the server.
- `codex-hacksong logout`: remove local Hacksong credentials without changing team membership.
- `hacksong-codex [codex args...]`: start Codex only when Hacksong login is valid.

## Workflow

1. Run `codex-hacksong doctor` before competition work.
2. If not logged in, ask the user to register/verify or log in.
3. If the user asks about teams, call `codex-hacksong team`.
4. For competition work, ask the user to start Codex with `hacksong-codex` instead of raw `codex`.
5. Use `codex-hacksong sync` after meaningful Codex work or when the user asks to upload records.
6. On any command failure, report the CLI error without exposing secrets or local credential file contents.
