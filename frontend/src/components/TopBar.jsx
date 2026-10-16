import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/theme.jsx';
import { Button } from './Button.jsx';

function NavItem({ to, active, children }) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`focus-ring rounded-md px-3 py-1.5 transition-colors duration-150 ${
        active
          ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
          : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
      }`}
    >
      {children}
    </Link>
  );
}

export function TopBar() {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <Link to="/" className="focus-ring rounded-md text-[15px] font-semibold tracking-tight">
          Code<span className="text-indigo-600 dark:text-indigo-400">Arena</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <NavItem to="/" active={pathname === '/' || pathname.startsWith('/problems')}>
            Problems
          </NavItem>
          <NavItem to="/submissions" active={pathname.startsWith('/submissions')}>
            Submissions
          </NavItem>
        </nav>
        <Button
          onClick={toggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className="ml-auto h-8 w-8"
        >
          <ThemeIcon aria-hidden className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
