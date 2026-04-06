# asciidoctor-numbered-captions-vscode (MVP)

VS Code 拡張機能のMVPです。Asciidoctor拡張のワークスペース拡張機能機構（`.asciidoctor/lib`）を使って、
[`YoshihideShirai/asciidoctor-numbered-captions`](https://github.com/YoshihideShirai/asciidoctor-numbered-captions)
を有効化します。

## 使い方

1. コマンドパレットで `Asciidoctor Numbered Captions: Setup MVP` を実行。
2. 以下を自動実行します。
   - `.asciidoctor/lib/numbered-captions.js` の作成
   - `asciidoc.extensions.registerWorkspaceExtensions = true` の設定
   - `asciidoc.preview.asciidoctorAttributes` に最小限の属性を追加
3. 依存が未インストールの場合、`npm i YoshihideShirai/asciidoctor-numbered-captions` を提案します。

## 開発

```bash
npm install
npm run build
```
