# Contributors in the About window

**About ▸ Contributors** credits everyone who contributed to WordForge.

## Overview

- Two files, both **compiled into the binary** by the UI crate's `build.rs`:
  - [`contributors/contributors.json`](../contributors/contributors.json): commit stats per GitHub username.
  - [`contributors/people.toml`](../contributors/people.toml): the names people chose for themselves.
- Each contributor gets one line: GitHub username (always), display name, real name (if provided), merged PRs, commits, lines added, lines deleted, binary assets added/removed, first and last commit date.
- The list is shown as a **grab bag** (names flowing as text) or a **table**, in the same order.

## In WordForge

- The About window is `Dialog::About` in `crates/ui-egui/src/dialogs.rs` (Help, or Backstage ▸ About).

## Adding an entry

Add your entry to `contributors/people.toml` (every field optional):

```toml
[people.your-github-username]
real_name = "Your Name"
display_name = "Nickname"
sync_github_name = true
```
