# asciidoctor-numbered-captions-vscode (MVP)

VS Code 拡張機能のMVPです。Asciidoctor拡張のワークスペース拡張機能機構（`.asciidoctor/lib`）を使って、
章番号付きキャプション（Figure/Table/Equation）を付与する Asciidoctor.js TreeProcessor を自動セットアップします。

## 使い方

1. コマンドパレットで `Asciidoctor Numbered Captions: Setup MVP` を実行。
2. 以下を自動実行します。
   - `.asciidoctor/lib/numbered-captions.js` の生成（処理本体を含む）
   - `asciidoc.extensions.registerWorkspaceExtensions = true` の設定
   - `asciidoc.preview.asciidoctorAttributes` に最小限の属性を追加
3. AsciiDocプレビューを開くと、`numbered-captions-numbering=chaptered` 時に章番号付きキャプションが有効になります。

## 開発

```bash
npm install
npm run build
```
