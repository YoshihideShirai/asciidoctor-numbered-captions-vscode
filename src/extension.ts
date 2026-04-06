import * as vscode from 'vscode';

const COMMAND_PREVIEW = 'asciidoctorNumberedCaptions.showPreview';
const WEBVIEW_TYPE = 'asciidoctorNumberedCaptions.preview';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const asciidoctor = require('@asciidoctor/core')();

type AnyNode = {
  getContext?: () => string;
  getTitle?: () => string;
  getLevel?: () => number;
  getBlocks?: () => AnyNode[];
  getAttribute?: (name: string) => unknown;
  setAttribute?: (name: string, value: string) => void;
};

function registerNumberedCaptions(registry: any, options: { defaultNumbering: string; chapterLevel: number }): void {
  registry.treeProcessor(function (this: any) {
    this.process(function (doc: AnyNode) {
      const mode = String(doc.getAttribute?.('numbered-captions-numbering') ?? options.defaultNumbering ?? 'standard');
      if (mode !== 'chaptered') {
        return doc;
      }

      const rawLevel = Number(doc.getAttribute?.('numbered-captions-chapter-level') ?? options.chapterLevel ?? 1);
      const chapterLevel = Number.isInteger(rawLevel) && rawLevel >= 1 ? rawLevel : 1;

      const labels = {
        image: String(doc.getAttribute?.('figure-caption') ?? 'Figure'),
        table: String(doc.getAttribute?.('table-caption') ?? 'Table'),
        stem: String(doc.getAttribute?.('equation-caption') ?? doc.getAttribute?.('stem-caption') ?? 'Equation')
      };

      const counters = new Map<string, number>();
      let chapterCounter = 0;

      const nextCaptionNumber = (chapter: string, context: string): number => {
        const key = `${chapter}:${context}`;
        const current = counters.get(key) ?? 0;
        const next = current + 1;
        counters.set(key, next);
        return next;
      };

      const applyCaption = (block: AnyNode, chapter: string): void => {
        const context = block.getContext?.();
        if (!context || !['image', 'table', 'stem'].includes(context)) {
          return;
        }

        const title = block.getTitle?.();
        if (!title) {
          return;
        }

        const seq = nextCaptionNumber(chapter, context);
        const label = (labels as Record<string, string>)[context] ?? context;
        block.setAttribute?.('caption', `${label} ${chapter}-${seq}. `);
      };

      const walkBlocks = (blocks: AnyNode[], currentChapter: string): void => {
        for (const block of blocks) {
          if (block.getContext?.() === 'section') {
            const level = block.getLevel?.() ?? 1;
            let childChapter = currentChapter;

            if (level === chapterLevel) {
              chapterCounter += 1;
              childChapter = String(chapterCounter);
            }

            walkBlocks(block.getBlocks?.() ?? [], childChapter);
            continue;
          }

          applyCaption(block, currentChapter);

          const nestedBlocks = block.getBlocks?.() ?? [];
          if (nestedBlocks.length > 0) {
            walkBlocks(nestedBlocks, currentChapter);
          }
        }
      };

      walkBlocks(doc.getBlocks?.() ?? [], '1');
      return doc;
    });
  });
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
    registerNumberedCaptions(registry, { defaultNumbering, chapterLevel });

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
