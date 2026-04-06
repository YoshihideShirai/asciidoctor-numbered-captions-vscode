# asciidoctor-numbered-captions-vscode (MVP)

VS Code 拡張機能のMVPです。**ワークスペースに `.asciidoctor/lib/*.js` を生成せず**、拡張機能内の処理で
章番号付きキャプション（Figure/Table/Equation）を適用した AsciiDoc プレビューを表示します。

## 使い方

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
