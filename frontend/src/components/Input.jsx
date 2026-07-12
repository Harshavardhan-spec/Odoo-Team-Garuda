import React from 'react';

export default function Input({
  label = '',
  error = '',
  type = 'text',
  options = [], // for type="select"
  className = '',
  containerClassName = '',
  id,
  ...props
}) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  const baseInputStyles = 'block w-full rounded-lg border px-3.5 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed';
  const borderStyles = error
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500/20 focus:border-red-500'
    : 'border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500/20 focus:border-blue-500';

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          id={inputId}
          className={`${baseInputStyles} ${borderStyles} ${className}`}
          rows={3}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={inputId}
          className={`${baseInputStyles} ${borderStyles} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          type={type}
          className={`${baseInputStyles} ${borderStyles} ${className}`}
          {...props}
        />
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium" id={`${inputId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

