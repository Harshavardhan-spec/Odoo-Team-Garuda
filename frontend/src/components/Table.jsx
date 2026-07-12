import React from 'react';
import Button from './Button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Table({
  headers = [],
  data = [],
  loading = false,
  searchTerm = '',
  onSearchChange = null,
  currentPage = 1,
  totalPages = 1,
  onPageChange = null,
  emptyMessage = 'No records found.',
  children, // alternate custom children
  renderRow = null
}) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      {onSearchChange !== null && (
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/30">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search database..."
              className="block w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      )}

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-xxs border-b border-slate-200/80">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-6 py-3.5 font-semibold">
                  {typeof h === 'string' ? h : h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              // Loading Skeleton lines
              Array.from({ length: 4 }).map((_, rIndex) => (
                <tr key={rIndex} className="animate-pulse">
                  {headers.map((_, hIndex) => (
                    <td key={hIndex} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-10 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => {
                if (renderRow) {
                  return renderRow(item, rowIndex);
                }
                return (
                  <tr key={rowIndex} className="hover:bg-slate-50/60 transition-colors">
                    {headers.map((h, hIndex) => {
                      const key = typeof h === 'string' ? h : h.key;
                      return (
                        <td key={hIndex} className="px-6 py-3.5 align-middle text-slate-600">
                          {item[key] !== undefined && item[key] !== null ? String(item[key]) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {onPageChange !== null && totalPages > 1 && (
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="text-xs text-slate-500">
            Page <span className="font-semibold text-slate-700">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-700">{totalPages}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="!px-2.5 !py-1 text-slate-500 hover:text-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="!px-2.5 !py-1 text-slate-500 hover:text-slate-700"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

