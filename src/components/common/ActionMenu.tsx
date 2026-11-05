import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export interface ActionMenuItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'warning' | 'primary';
  disabled?: boolean;
  divider?: boolean;
  badge?: string;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  trigger?: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
  buttonClassName?: string;
  ariaLabel?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  trigger,
  align = 'right',
  className = '',
  buttonClassName = '',
  ariaLabel = 'Open row actions menu'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleItemClick = (e: React.MouseEvent, item: ActionMenuItem) => {
    e.stopPropagation();
    if (item.disabled) return;
    setIsOpen(false);
    item.onClick();
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={
          buttonClassName ||
          `p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#601A24]/30 ${
            isOpen ? 'bg-stone-100 text-stone-900 ring-1 ring-stone-300' : ''
          }`
        }
      >
        {trigger || <MoreVertical className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute z-50 mt-1 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1 text-xs focus:outline-none animate-in fade-in zoom-in-95 duration-100 ${
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          }`}
        >
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isDanger = item.variant === 'danger';
            const isWarning = item.variant === 'warning';
            const isPrimary = item.variant === 'primary';

            return (
              <React.Fragment key={`${item.label}-${idx}`}>
                {item.divider && idx > 0 && (
                  <div className="h-px bg-stone-100 my-1" role="separator" />
                )}
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={(e) => handleItemClick(e, item)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left font-medium transition-colors ${
                    item.disabled
                      ? 'text-stone-300 cursor-not-allowed'
                      : isDanger
                      ? 'text-rose-700 hover:bg-rose-50 hover:text-rose-900'
                      : isWarning
                      ? 'text-amber-700 hover:bg-amber-50 hover:text-amber-900'
                      : isPrimary
                      ? 'text-[#601A24] hover:bg-rose-50 hover:text-[#451017]'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {Icon && (
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isDanger ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-stone-500'
                        }`}
                      />
                    )}
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 ml-2 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
