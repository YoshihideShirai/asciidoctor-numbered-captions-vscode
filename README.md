# asciidoctor-numbered-captions-vscode (MVP)

This is an MVP VS Code extension for numbered Asciidoctor captions. It uses
`@asciidoctor/core` and
[`YoshihideShirai/asciidoctor-numbered-captions`](https://github.com/YoshihideShirai/asciidoctor-numbered-captions)
directly from the extension, without generating `.asciidoctor/lib/*.js` files in
the workspace.

## Usage

When `asciidoctor-vscode` is installed, this extension automatically registers
the numbered captions extension for normal AsciiDoc preview and export.

An internal preview command is also available for standalone verification.

1. Open an AsciiDoc file.
2. Run `Asciidoctor Numbered Captions: Open Internal Preview` from the command palette.
3. A numbered-captions HTML preview opens in the side pane.

## Settings

- `asciidoctorNumberedCaptions.defaultNumbering`: `chaptered` / `standard`
- `asciidoctorNumberedCaptions.chapterLevel`: Section level to treat as a chapter.

## Development

```bash
npm install
npm run build
```
