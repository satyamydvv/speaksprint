import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-6 px-4 sm:px-6">
      <div className="flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500 shadow-xs shadow-blue-500/50" />
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Speak<span className="text-blue-600 dark:text-blue-400">Sprint</span>
        </h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
