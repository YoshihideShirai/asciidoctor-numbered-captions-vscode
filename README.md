# Asciidoctor Numbered Captions Helper

[日本語](README.ja.md)

Asciidoctor Numbered Captions Helper is a VS Code extension that automatically applies numbered captions to figures, tables, listings, and other captioned blocks in Asciidoctor preview and export workflows. It integrates with `asciidoctor-vscode` and registers [`asciidoctor-numbered-captions`](https://github.com/YoshihideShirai/asciidoctor-numbered-captions) without generating helper files such as `.asciidoctor/lib/*.js` in your workspace.

## Features

- Automatically applies numbered captions when previewing AsciiDoc files.
- Supports `chaptered` numbering for captions that include chapter numbers.
- Supports `standard` numbering for document-wide sequential captions.
- Works with the regular preview and export flow provided by `asciidoctor-vscode`.
- Keeps your project clean by avoiding generated extension files in the workspace.

## When to use this extension

This extension is useful for technical documents, specifications, manuals, design documents, and other AsciiDoc projects that need consistent caption numbering.

Use it when you want to:

- Number figures by chapter, such as Figure 1.1 and Figure 1.2.
- Number tables by chapter, such as Table 2.1 and Table 2.2.
- Use the same caption numbering behavior in preview and export.
- Avoid committing project-local JavaScript files only for Asciidoctor extension setup.

## Requirements

This extension does not provide an AsciiDoc previewer by itself. Install and enable the following VS Code extension first:

- [AsciiDoc](https://marketplace.visualstudio.com/items?itemName=asciidoctor.asciidoctor-vscode) (`asciidoctor.asciidoctor-vscode`)

If `asciidoctor-vscode` is not installed, the preview command shows an error message.

> [!IMPORTANT]
> This extension requires a version of `asciidoctor-vscode` that includes asciidoctor/asciidoctor-vscode#1035, which adds the `asciidoc.asciidoctorExtensions` contribution point and the `registerAsciidoctorExtensions(registry, context)` hook used by this extension. The pull request was merged on June 27, 2026. If the Marketplace version you have installed does not include that change yet, install a pre-release build or a build from `asciidoctor-vscode` main that contains the merge.

## Installation

Install `Asciidoctor Numbered Captions Helper` from the VS Code Marketplace.

After installation, open an AsciiDoc file. The extension activates automatically and registers the numbered captions extension through the Asciidoctor extension hook provided by `asciidoctor-vscode`.

## Usage

1. Open an AsciiDoc file in VS Code.
2. Open the Command Palette.
3. Run `Asciidoctor Numbered Captions: Open Preview`.
4. The `asciidoctor-vscode` preview opens to the side with numbered captions applied.

The same configuration is also used by supported `asciidoctor-vscode` preview and export operations that load registered Asciidoctor extensions.

## Settings

You can configure the extension from VS Code settings.

| Setting | Default | Description |
| --- | --- | --- |
| `asciidoctorNumberedCaptions.defaultNumbering` | `standard` | The default numbering mode. Use `chaptered` or `standard`. |
| `asciidoctorNumberedCaptions.chapterLevel` | `1` | The section level treated as the chapter level when using `chaptered` numbering. |

### Example `settings.json`

```json
{
  "asciidoctorNumberedCaptions.defaultNumbering": "standard",
  "asciidoctorNumberedCaptions.chapterLevel": 1
}
```

### Example AsciiDoc header attributes

To choose the numbering mode per document, add the `numbered-captions-numbering` attribute to the AsciiDoc document header.

```adoc
= Sample Document
:numbered-captions-numbering: chaptered
:numbered-captions-chapter-level: 1
:figure-caption: Figure
:table-caption: Table
:equation-caption: Equation

== Introduction

.Architecture diagram
image::architecture.png[]
```

Set `numbered-captions-numbering` to either `chaptered` or `standard`. This document attribute overrides `asciidoctorNumberedCaptions.defaultNumbering` per document.

`numbered-captions-chapter-level` is the section level treated as the chapter level. If `asciidoctorNumberedCaptions.chapterLevel` is configured in VS Code, the VS Code setting takes precedence.

## Numbering modes

### `chaptered`

Use `chaptered` numbering when captions should include chapter numbers. This mode is suitable for documents that organize figures and tables by chapter.

Example:

```adoc
= Sample Document

== Introduction

.Architecture diagram
image::architecture.png[]
```

The caption number follows the chapter structure according to the configured chapter level.

### `standard`

Use `standard` numbering when captions should be numbered sequentially across the entire document, independent of chapter numbers.

## Notes

- This extension is designed to work with `asciidoctor-vscode`.
- Caption numbering is provided by `asciidoctor-numbered-captions`.
- Depending on your document structure and Asciidoctor configuration, you may need to adjust `chapterLevel` to match the heading level you treat as chapters.

## Troubleshooting

### Preview does not open

Make sure `asciidoctor-vscode` is installed and enabled.

### Caption numbers do not match chapter numbers

Check `asciidoctorNumberedCaptions.chapterLevel` and set it to the heading level that represents chapters in your document.

### I want to change the numbering mode

Set `asciidoctorNumberedCaptions.defaultNumbering` to either `chaptered` or `standard`.

## Feedback

Please open an issue in the project repository for bug reports, feature requests, or documentation improvements.
