# Asciidoctor Numbered Captions Helper

[English](README.md)

[![VS Code Marketplace downloads](https://img.shields.io/visual-studio-marketplace/d/YoshihideShirai.asciidoctor-numbered-captions-vscode?label=downloads&logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=YoshihideShirai.asciidoctor-numbered-captions-vscode)

Asciidoctor Numbered Captions Helper は、Asciidoctor のプレビューとエクスポートで、図・表・リストなどのキャプション番号を自動付番する VS Code 拡張です。`asciidoctor-vscode` と連携し、ワークスペース内に `.asciidoctor/lib/*.js` のような補助ファイルを生成せずに [`asciidoctor-numbered-captions`](https://github.com/YoshihideShirai/asciidoctor-numbered-captions) を登録します。

## 機能

- AsciiDoc ファイルのプレビュー時にキャプション番号を自動付番します。
- 章番号を含むキャプション番号向けに `chaptered` 形式をサポートします。
- 文書全体の通し番号向けに `standard` 形式をサポートします。
- `asciidoctor-vscode` が提供する通常のプレビューおよびエクスポートの流れで利用できます。
- ワークスペース内に拡張用の生成ファイルを作らないため、プロジェクトを clean に保てます。

## この拡張が役立つ場面

技術文書、仕様書、マニュアル、設計書など、AsciiDoc で一貫したキャプション番号が必要な文書に向いています。

次のような場合に利用できます。

- Figure 1.1、Figure 1.2 のように章ごとに図番号を付けたい。
- Table 2.1、Table 2.2 のように章ごとに表番号を付けたい。
- プレビューとエクスポートで同じキャプション番号付けを使いたい。
- Asciidoctor 拡張設定のためだけに、プロジェクト内へ JavaScript ファイルをコミットしたくない。

## 必要な拡張

この拡張は単体では AsciiDoc プレビュー機能を提供しません。先に以下の VS Code 拡張をインストールして有効化してください。

- [AsciiDoc](https://marketplace.visualstudio.com/items?itemName=asciidoctor.asciidoctor-vscode) (`asciidoctor.asciidoctor-vscode`)

`asciidoctor-vscode` がインストールされていない場合、プレビューコマンドはエラーメッセージを表示します。

> [!IMPORTANT]
> この拡張は、asciidoctor/asciidoctor-vscode#1035 が取り込まれたバージョンの `asciidoctor-vscode` を必要とします。この PR により、本拡張が利用する `asciidoc.asciidoctorExtensions` contribution point と `registerAsciidoctorExtensions(registry, context)` フックが追加されています。この PR は 2026 年 6 月 27 日にマージされました。インストール済みの Marketplace 版にこの変更がまだ含まれていない場合は、この変更を含む `asciidoctor-vscode` のプレリリース版、または main ブランチ由来のビルドを利用してください。

## インストール

VS Code Marketplace から `Asciidoctor Numbered Captions Helper` をインストールしてください。

または、GitHub Releases ページから `.vsix` パッケージをダウンロードし、VS Code の `Extensions: Install from VSIX...` でインストールできます。

インストール後、AsciiDoc ファイルを開くと拡張が自動的に有効化されます。その後、`asciidoctor-vscode` が提供する Asciidoctor 拡張フックを通じて、番号付きキャプション拡張が登録されます。

## 使い方

1. VS Code で AsciiDoc ファイルを開きます。
2. コマンドパレットを開きます。
3. `Asciidoctor Numbered Captions: Open Preview` を実行します。
4. `asciidoctor-vscode` のプレビューが横に開き、番号付きキャプションが適用されます。

登録済みの Asciidoctor 拡張を読み込む `asciidoctor-vscode` のプレビューおよびエクスポート処理でも、同じ設定が利用されます。

## 設定

VS Code の設定から拡張の動作を変更できます。

| 設定 | 既定値 | 説明 |
| --- | --- | --- |
| `asciidoctorNumberedCaptions.defaultNumbering` | `standard` | 既定の番号付けモードです。`chaptered` または `standard` を指定します。 |
| `asciidoctorNumberedCaptions.chapterLevel` | `1` | `chaptered` 形式で章として扱うセクションレベルです。 |

### `settings.json` の例

```json
{
  "asciidoctorNumberedCaptions.defaultNumbering": "standard",
  "asciidoctorNumberedCaptions.chapterLevel": 1
}
```

### AsciiDoc ヘッダーで指定する例

文書ごとに番号付けモードを指定したい場合は、AsciiDoc ファイルのヘッダーに `numbered-captions-numbering` 属性を追加します。

```adoc
= サンプル文書
:numbered-captions-numbering: chaptered
:numbered-captions-chapter-level: 1
:figure-caption: 図
:table-caption: 表
:equation-caption: 式

== はじめに

.構成図
image::architecture.png[]
```

`numbered-captions-numbering` には `chaptered` または `standard` を指定できます。この属性は文書ごとに `asciidoctorNumberedCaptions.defaultNumbering` を上書きします。

`numbered-captions-chapter-level` は章として扱うセクションレベルです。ただし、VS Code の `asciidoctorNumberedCaptions.chapterLevel` を設定している場合は VS Code の設定が優先されます。

## 番号付けモード

### `chaptered`

キャプション番号に章番号を含めたい場合は `chaptered` を使用します。図や表を章単位で整理する文書に適しています。

例:

```adoc
= サンプル文書

== はじめに

.構成図
image::architecture.png[]
```

キャプション番号は、設定された章レベルに従って文書の章構造と連動します。

### `standard`

章番号とは独立して、文書全体でキャプションを通し番号にしたい場合は `standard` を使用します。

## 注意事項

- この拡張は `asciidoctor-vscode` と連携して動作することを前提としています。
- キャプション番号付けの実処理は `asciidoctor-numbered-captions` が提供します。
- 文書構造や Asciidoctor の設定によっては、章として扱う見出しレベルに合わせて `chapterLevel` を調整する必要があります。

## トラブルシューティング

### プレビューが開かない

`asciidoctor-vscode` がインストールされ、有効になっていることを確認してください。

### キャプション番号が章番号と合わない

`asciidoctorNumberedCaptions.chapterLevel` を確認し、文書内で章を表す見出しレベルに合わせて設定してください。

### 番号付けモードを変更したい

`asciidoctorNumberedCaptions.defaultNumbering` を `chaptered` または `standard` に設定してください。

## フィードバック

不具合報告、機能要望、ドキュメント改善の提案は、プロジェクトリポジトリの Issue へお寄せください。
