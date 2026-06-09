# asciidoctor-numbered-captions-vscode (MVP)

VS Code 拡張機能のMVPです。**ワークスペースに `.asciidoctor/lib/*.js` を生成せず**、
拡張機能内で `@asciidoctor/core` と
[`YoshihideShirai/asciidoctor-numbered-captions`](https://github.com/YoshihideShirai/asciidoctor-numbered-captions)
を直接使って、章番号付きキャプション（Figure/Table/Equation）を適用した AsciiDoc プレビューを表示します。

## 使い方

`asciidoctor-vscode` がインストールされている場合、通常の AsciiDoc プレビューやエクスポートで自動的に番号付きキャプション拡張が登録されます。

単体確認用の内部プレビューも利用できます。

1. AsciiDoc ファイルを開く
2. コマンドパレットで `Asciidoctor Numbered Captions: Open Internal Preview` を実行
3. 右ペインに番号付きキャプション適用済みHTMLプレビューが開く

## 設定

- `asciidoctorNumberedCaptions.defaultNumbering`: `chaptered` / `standard`
- `asciidoctorNumberedCaptions.chapterLevel`: 章として扱うセクションレベル

## 開発

```bash
npm install
npm run build
```
