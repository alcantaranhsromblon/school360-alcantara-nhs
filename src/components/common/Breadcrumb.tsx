import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onHomeClick?: () => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onHomeClick }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-2.5">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
        <li className="flex items-center">
          <button
            type="button"
            onClick={onHomeClick}
            className="flex items-center gap-1 hover:text-blue-700 transition-colors focus:outline-hidden"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            {item.onClick && !item.active ? (
              <button
                type="button"
                onClick={item.onClick}
                className="hover:text-blue-700 transition-colors focus:outline-hidden truncate max-w-xs"
              >
                {item.label}
              </button>
            ) : (
              <span className={`truncate max-w-xs ${item.active ? 'text-blue-900 font-semibold' : 'text-slate-600'}`}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
