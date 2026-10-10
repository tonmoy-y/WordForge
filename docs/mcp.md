# MCP server

WordForge speaks the [Model Context Protocol](https://modelcontextprotocol.io) over stdio, so
Claude and other agents can write and edit documents.

```sh
wordforge-cli mcp                          # headless session (no window)
wordforge --control 7981 &                 # or: drive the running app…
wordforge-cli mcp --connect 127.0.0.1:7981 # …including clicks, keys and screenshots
```

Claude Code: `claude mcp add wordforge -- wordforge-cli mcp`.

## Tools

| Tool | What it does |
|---|---|
| `list_commands` | every command (filter with `query`) — over 270 of them |
| `execute` | run one command: `{command: "insert.table", params: {rows: 3, cols: 4}}` |
| `batch` | run several commands in order |
| `new_document` | blank, sample, letter, resume, report |
| `open_document` / `save_document` | docx, odt, rtf, html, md, txt, json; save also pdf, png |
| `type_text` | type at the caret (`paragraphs: true` splits lines into paragraphs) |
| `select_text` | select the n-th occurrence of some text |
| `get_text` / `inspect_document` | read the document back (verify without screenshots) |
| `render_page` | a page as PNG |
| `parity` | feature coverage |
| `screenshot`, `click`, `key`, `ui_inspect` | app only (`--connect`) |

Resources: `wordforge://document` (inspect) and `wordforge://commands`.

The acceptance test `crates/mcp/src/tests.rs` writes a formatted document using MCP only.
