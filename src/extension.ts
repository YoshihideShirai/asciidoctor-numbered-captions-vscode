import * as vscode from 'vscode';

const COMMAND_PREVIEW = 'asciidoctorNumberedCaptions.showPreview';
const ASCIIDOCTOR_VSCODE_EXTENSION_ID = 'asciidoctor.asciidoctor-vscode';
const ASCIIDOCTOR_PREVIEW_TO_SIDE_COMMAND = 'asciidoc.showPreviewToSide';

export interface NumberedCaptionsOptions {
  defaultNumbering: string;
  chapterLevel: number;
}

type AsciidoctorProcessingMode = 'preview' | 'export' | 'load';

interface AsciidoctorExtensionContext {
  readonly mode: AsciidoctorProcessingMode;
  readonly documentUri?: vscode.Uri;
}

interface AsciidoctorVscodeApi {
  registerAsciidoctorExtensions(registry: any, context: AsciidoctorExtensionContext): void | Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const numberedCaptions = require('asciidoctor-numbered-captions');

function getNumberedCaptionsOptions(documentUri?: vscode.Uri): NumberedCaptionsOptions {
  const cfg = vscode.workspace.getConfiguration('asciidoctorNumberedCaptions', documentUri);
  return {
    defaultNumbering: cfg.get<string>('defaultNumbering', 'standard'),
    chapterLevel: cfg.get<number>('chapterLevel', 1)
  };
}

function registerNumberedCaptions(registry: any, options: NumberedCaptionsOptions): void {
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

export function activate(context: vscode.ExtensionContext): AsciidoctorVscodeApi {
  context.subscriptions.push(vscode.commands.registerCommand(COMMAND_PREVIEW, async () => {
    const asciidoctorVscode = vscode.extensions.getExtension(ASCIIDOCTOR_VSCODE_EXTENSION_ID);
    if (asciidoctorVscode === undefined) {
      void vscode.window.showErrorMessage('asciidoctor-vscode is not installed.');
      return;
    }

    await vscode.commands.executeCommand(ASCIIDOCTOR_PREVIEW_TO_SIDE_COMMAND);
  }));

  return {
    registerAsciidoctorExtensions(registry: any, asciidoctorContext: AsciidoctorExtensionContext): void {
      registerNumberedCaptions(registry, getNumberedCaptionsOptions(asciidoctorContext.documentUri));
    }
  };
}

export function deactivate(): void {
  // no-op
}
