import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TopBar } from './components/TopBar.jsx';
import { ProblemsPage } from './pages/ProblemsPage.jsx';
import { ProblemPage } from './pages/ProblemPage.jsx';
import { SubmissionsPage } from './pages/SubmissionsPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<ProblemsPage />} />
        <Route path="/problems/:slug" element={<ProblemPage />} />
        <Route path="/submissions" element={<SubmissionsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
