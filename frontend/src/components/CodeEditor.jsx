import { lazy, Suspense } from 'react';
import { EditorSkeleton } from './Feedback.jsx';

// Monaco is several megabytes, so it is only downloaded when a problem page opens.
const MonacoEditor = lazy(() => import('./MonacoEditor.jsx'));

export function CodeEditor(props) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <MonacoEditor {...props} />
    </Suspense>
  );
}
