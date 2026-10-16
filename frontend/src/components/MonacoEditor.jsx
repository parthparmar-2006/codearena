import Editor from '@monaco-editor/react';
import '../lib/monaco.js';
import { useTheme } from '../hooks/theme.jsx';
import { EditorSkeleton } from './Feedback.jsx';

const OPTIONS = {
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  fontSize: 14,
  lineHeight: 22,
  tabSize: 4,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  padding: { top: 12, bottom: 12 },
  renderLineHighlight: 'line',
  overviewRulerLanes: 0,
  scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
};

export default function MonacoEditor({ value, onChange }) {
  const { theme } = useTheme();
  return (
    <Editor
      language="cpp"
      value={value}
      onChange={(next) => onChange(next ?? '')}
      theme={theme === 'dark' ? 'codearena-dark' : 'codearena-light'}
      loading={<EditorSkeleton />}
      options={OPTIONS}
    />
  );
}
