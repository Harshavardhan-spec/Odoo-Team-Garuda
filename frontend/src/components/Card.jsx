import React from 'react';

export default function Card({
  children,
  title = '',
  actions = null,
  className = '',
  bodyClassName = 'p-6',
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          {title && (
            <h3 className="font-semibold text-slate-800 text-base leading-6">
              {title}
            </h3>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
}

