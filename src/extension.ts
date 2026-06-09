import * as vscode from 'vscode';

const COMMAND_PREVIEW = 'asciidoctorNumberedCaptions.showPreview';
const ASCIIDOCTOR_VSCODE_EXTENSION_ID = 'asciidoctor.asciidoctor-vscode';
const ASCIIDOCTOR_PREVIEW_TO_SIDE_COMMAND = 'asciidoc.showPreviewToSide';

export interface NumberedCaptionsOptions {
  defaultNumbering: string;
  chapterLevel: number;
}

interface AsciidoctorExtensionRegistration {
  register(registry: any, documentUri?: vscode.Uri): void | Promise<void>;
}

interface AsciidoctorVscodeApi {
  registerAsciidoctorExtension(extension: AsciidoctorExtensionRegistration): vscode.Disposable;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const numberedCaptions = require('asciidoctor-numbered-captions');
let registration: vscode.Disposable | undefined;
let registrationPromise: Promise<void> | undefined;

function getNumberedCaptionsOptions(documentUri?: vscode.Uri): NumberedCaptionsOptions {
  const cfg = vscode.workspace.getConfiguration('asciidoctorNumberedCaptions', documentUri);
  return {
    defaultNumbering: cfg.get<string>('defaultNumbering', 'chaptered'),
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

async function registerWithAsciidoctorVscode(context: vscode.ExtensionContext): Promise<void> {
  if (registration !== undefined) {
    return;
  }
  if (registrationPromise !== undefined) {
    return registrationPromise;
  }
  registrationPromise = doRegisterWithAsciidoctorVscode(context);
  return registrationPromise;
}

async function doRegisterWithAsciidoctorVscode(context: vscode.ExtensionContext): Promise<void> {
  const asciidoctorVscode = vscode.extensions.getExtension<AsciidoctorVscodeApi>(ASCIIDOCTOR_VSCODE_EXTENSION_ID);
  if (asciidoctorVscode === undefined) {
    return;
  }

  try {
    const api = await asciidoctorVscode.activate();
    if (typeof api?.registerAsciidoctorExtension !== 'function') {
      return;
    }
    registration = api.registerAsciidoctorExtension({
      register(registry: any, documentUri?: vscode.Uri): void {
        registerNumberedCaptions(registry, getNumberedCaptionsOptions(documentUri));
      }
    });
    context.subscriptions.push(registration);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    void vscode.window.showWarningMessage(`Failed to initialize asciidoctor-vscode integration: ${message}`);
  } finally {
    registrationPromise = undefined;
  }
}

export function activate(context: vscode.ExtensionContext): void {
  void registerWithAsciidoctorVscode(context);

  context.subscriptions.push(vscode.commands.registerCommand(COMMAND_PREVIEW, async () => {
    const asciidoctorVscode = vscode.extensions.getExtension(ASCIIDOCTOR_VSCODE_EXTENSION_ID);
    if (asciidoctorVscode === undefined) {
      void vscode.window.showErrorMessage('asciidoctor-vscode is not installed.');
      return;
    }

    await registerWithAsciidoctorVscode(context);
    await vscode.commands.executeCommand(ASCIIDOCTOR_PREVIEW_TO_SIDE_COMMAND);
  }));
}

export function deactivate(): void {
  // no-op
}
