# asciidoctor-numbered-captions-vscode (MVP)

This is an MVP VS Code extension for numbered Asciidoctor captions. It uses
[`YoshihideShirai/asciidoctor-numbered-captions`](https://github.com/YoshihideShirai/asciidoctor-numbered-captions)
directly from the extension and registers it with `asciidoctor-vscode`, without
generating `.asciidoctor/lib/*.js` files in the workspace.

## Usage

When `asciidoctor-vscode` is installed, this extension automatically registers
the numbered captions extension for normal AsciiDoc preview and export.

1. Open an AsciiDoc file.
2. Run `Asciidoctor Numbered Captions: Open Preview` from the command palette.
3. `asciidoctor-vscode` opens the HTML preview in the side pane.

## Settings

- `asciidoctorNumberedCaptions.defaultNumbering`: `chaptered` / `standard`
- `asciidoctorNumberedCaptions.chapterLevel`: Section level to treat as a chapter.

## Development

```bash
npm install
npm run build
```
