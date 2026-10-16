// Bundles Monaco with the app instead of loading it from a CDN.
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/editor/editor.worker?worker';
import { loader } from '@monaco-editor/react';

self.MonacoEnvironment = { getWorker: () => new EditorWorker() };
loader.config({ monaco });

monaco.editor.defineTheme('codearena-light', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#ffffff',
    'editor.lineHighlightBackground': '#f4f4f5',
    'editorLineNumber.foreground': '#a1a1aa',
    'editorLineNumber.activeForeground': '#3f3f46',
  },
});

monaco.editor.defineTheme('codearena-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#09090b',
    'editor.lineHighlightBackground': '#18181b',
    'editorLineNumber.foreground': '#52525b',
    'editorLineNumber.activeForeground': '#d4d4d8',
  },
});

// The editor measures character widths once; redo it after the web font has loaded.
document.fonts?.ready.then(() => monaco.editor.remeasureFonts());
