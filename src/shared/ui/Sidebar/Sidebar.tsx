import { type ReactNode } from 'react';

interface SidebarProps {
  readonly isCollapsed: boolean;
  readonly isOpen?: boolean;
  readonly onToggle: () => void;
  readonly children: ReactNode;
}

export function Sidebar({ isCollapsed, isOpen = false, onToggle, children }: SidebarProps) {
  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
        {children}
      </div>
      <div className="p-4 border-t border-slate-800 flex justify-center">
        <button
          type="button"
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          onClick={onToggle}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

export function SidebarBrand({ logoText, name, subtitle }: { logoText: string; name: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 p-5 border-b border-slate-800 min-h-[64px]">
      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
        {logoText}
      </div>
      <div className="flex flex-col overflow-hidden whitespace-nowrap">
        <span className="text-sm font-bold text-white">{name}</span>
        {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
      </div>
    </div>
  );
}

export function SidebarSectionLabel({ children }: { children: ReactNode }) {
  return <span className="px-5 pt-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider block whitespace-nowrap">{children}</span>;
}

export function SidebarNavItem({
  icon,
  label,
  isActive = false,
  onClick,
  href,
}: { icon: ReactNode; label: string; isActive?: boolean; onClick?: () => void; href?: string }) {
  
  const baseClass = `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap relative ${
    isActive 
      ? 'bg-blue-900/30 text-blue-400 border-l-4 border-blue-500' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
  }`;

  const content = (
    <>
      <span className="w-5 h-5 shrink-0 flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </>
  );

  if (href) {
    return <a href={href} className={baseClass}>{content}</a>;
  }

  return <button type="button" className={baseClass} onClick={onClick}>{content}</button>;
}

export function SidebarNav({ children }: { readonly children: ReactNode }) {
  return <nav className="flex flex-col py-2">{children}</nav>;
}
