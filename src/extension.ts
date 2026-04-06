import * as vscode from 'vscode';

const COMMAND_PREVIEW = 'asciidoctorNumberedCaptions.showPreview';
const WEBVIEW_TYPE = 'asciidoctorNumberedCaptions.preview';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const asciidoctor = require('@asciidoctor/core')();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const numberedCaptions = require('asciidoctor-numbered-captions');

function registerNumberedCaptions(registry: any, options: { defaultNumbering: string; chapterLevel: number }): void {
  if (typeof numberedCaptions?.register === 'function') {
    numberedCaptions.register(registry, {
      defaultNumbering: options.defaultNumbering,
      chapterLevel: options.chapterLevel
    });
    return;
  }

  if (typeof numberedCaptions === 'function') {
    numberedCaptions(registry, {
      defaultNumbering: options.defaultNumbering,
      chapterLevel: options.chapterLevel
    });
    return;
  }

  throw new Error('Failed to load asciidoctor-numbered-captions: unsupported module shape.');
}

function buildHtmlBody(rawHtml: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Numbered Captions Preview</title>
<style>
body { padding: 1rem 1.5rem; max-width: 980px; margin: 0 auto; font-family: var(--vscode-font-family); }
pre, code { font-family: var(--vscode-editor-font-family); }
img { max-width: 100%; }
</style>
</head>
<body>
${rawHtml}
</body>
</html>`;
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(vscode.commands.registerCommand(COMMAND_PREVIEW, async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      void vscode.window.showErrorMessage('アクティブなエディタがありません。');
      return;
    }

    const source = editor.document.getText();
    const cfg = vscode.workspace.getConfiguration('asciidoctorNumberedCaptions', editor.document.uri);
    const defaultNumbering = cfg.get<string>('defaultNumbering', 'chaptered');
    const chapterLevel = cfg.get<number>('chapterLevel', 1);

    const registry = asciidoctor.Extensions.create();

    try {
      registerNumberedCaptions(registry, { defaultNumbering, chapterLevel });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      void vscode.window.showErrorMessage(`拡張の初期化に失敗しました: ${message}`);
      return;
    }

    let converted: string;
    try {
      converted = asciidoctor.convert(source, {
        safe: 'unsafe',
        extension_registry: registry,
        attributes: {
          sectnums: '',
          stem: 'latexmath',
          'numbered-captions-numbering': defaultNumbering,
          'numbered-captions-chapter-level': String(chapterLevel)
        }
      }) as string;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      void vscode.window.showErrorMessage(`Asciidoctor 変換に失敗しました: ${message}`);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      WEBVIEW_TYPE,
      `Numbered Captions Preview: ${editor.document.fileName.split(/[\\/]/).pop() ?? 'document'}`,
      vscode.ViewColumn.Beside,
      { enableScripts: true }
    );

    panel.webview.html = buildHtmlBody(converted);
  }));
}

export function deactivate(): void {
  // no-op
}
