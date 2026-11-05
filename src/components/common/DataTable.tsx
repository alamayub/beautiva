import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  SlidersHorizontal,
  RotateCcw,
  CheckSquare,
  Square
} from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterDef {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  defaultValue?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  idField?: keyof T | ((item: T) => string);
  
  // Search
  searchable?: boolean;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchFn?: (item: T, query: string) => boolean;
  
  // Filters
  filters?: FilterDef[];
  onResetFilters?: () => void;
  
  // Header Actions
  actions?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;

  // Pagination
  paginated?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  
  // Selection
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  batchActions?: (selectedIds: string[], clearSelection: () => void) => React.ReactNode;
  
  // Row interaction
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T, index: number) => string;
  
  // State
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubtitle?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T>({
  data,
  columns,
  idField = 'id' as keyof T,
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
  searchFn,
  filters = [],
  onResetFilters,
  actions,
  title,
  subtitle,
  paginated = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 20, 50],
  selectable = false,
  selectedIds: externalSelectedIds,
  onSelectionChange: externalOnSelectionChange,
  batchActions,
  onRowClick,
  rowClassName,
  isLoading = false,
  emptyMessage = 'No matching records found',
  emptySubtitle = 'Try adjusting your search keywords or filter criteria.'
}: DataTableProps<T>) {
  // Search state (internal or controlled)
  const [internalSearch, setInternalSearch] = useState('');
  const search = externalSearchQuery !== undefined ? externalSearchQuery : internalSearch;
  const setSearch = (val: string) => {
    if (externalOnSearchChange) {
      externalOnSearchChange(val);
    } else {
      setInternalSearch(val);
    }
  };

  // Sorting state
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Selection state (internal or controlled)
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  const selectedIds = externalSelectedIds !== undefined ? externalSelectedIds : internalSelectedIds;
  const setSelectedIds = (ids: string[]) => {
    if (externalOnSelectionChange) {
      externalOnSelectionChange(ids);
    } else {
      setInternalSelectedIds(ids);
    }
  };

  // Helper to get row ID
  const getRowId = (item: T, index: number): string => {
    if (typeof idField === 'function') {
      return idField(item);
    }
    const val = item[idField];
    return val !== undefined && val !== null ? String(val) : String(index);
  };

  // 1. Filter & Search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Custom search function or fallback string search on all values
      if (search.trim()) {
        if (searchFn) {
          if (!searchFn(item, search.trim().toLowerCase())) return false;
        } else {
          const q = search.trim().toLowerCase();
          const matches = Object.values(item as Record<string, unknown>).some((val) => {
            if (val === null || val === undefined) return false;
            if (typeof val === 'string' || typeof val === 'number') {
              return String(val).toLowerCase().includes(q);
            }
            if (Array.isArray(val)) {
              return val.some((sub) => String(sub).toLowerCase().includes(q));
            }
            return false;
          });
          if (!matches) return false;
        }
      }
      return true;
    });
  }, [data, search, searchFn]);

  // 2. Sort
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return filteredData;

    const column = columns.find((c) => c.key === sortKey);
    if (!column || !column.sortable) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (column.sortFn) {
        const res = column.sortFn(a, b);
        return sortDir === 'asc' ? res : -res;
      }
      const valA = (a as Record<string, unknown>)[sortKey];
      const valB = (b as Record<string, unknown>)[sortKey];

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      return sortDir === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortKey, sortDir, columns]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filteredData.length, pageSize]);

  // 3. Paginate
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const effectivePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;
    const start = (effectivePage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, paginated, effectivePage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  };

  // Selection helpers
  const currentPageIds = useMemo(
    () => paginatedData.map((item, idx) => getRowId(item, idx)),
    [paginatedData]
  );

  const isAllCurrentSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));
  const isSomeSelected =
    currentPageIds.some((id) => selectedIds.includes(id)) && !isAllCurrentSelected;

  const toggleSelectAll = () => {
    if (isAllCurrentSelected) {
      setSelectedIds(selectedIds.filter((id) => !currentPageIds.includes(id)));
    } else {
      const combined = Array.from(new Set([...selectedIds, ...currentPageIds]));
      setSelectedIds(combined);
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  // Check if any filter is active
  const hasActiveFilters = filters.some(
    (f) => f.value && f.value !== (f.defaultValue ?? 'all')
  );

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
      {/* Top Header / Title / Actions Strip */}
      {(title || actions) && (
        <div className="p-4 sm:px-6 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5]/80">
          <div>
            {title && (
              <div className="font-editorial text-base sm:text-lg font-bold text-stone-900 leading-tight">
                {title}
              </div>
            )}
            {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
          </div>

          {actions && <div className="flex items-center gap-2 self-start sm:self-auto">{actions}</div>}
        </div>
      )}

      {/* Control Bar: Search + Filter Dropdowns */}
      {(searchable || filters.length > 0) && (
        <div className="p-3 sm:p-4 border-b border-stone-100 bg-white flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-stone-50/70 border border-stone-200 hover:border-stone-300 focus:bg-white rounded-lg pl-9 pr-8 py-2 text-xs focus:outline-none focus:border-[#601A24] focus:ring-1 focus:ring-[#601A24]/15 transition-all text-stone-800 placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Filter Dropdowns and Reset */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-stone-600">
            {filters.map((filter) => (
              <div key={filter.id} className="flex items-center gap-1.5">
                <span className="font-medium text-stone-500 shrink-0">{filter.label}:</span>
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className={`bg-white border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none transition-colors cursor-pointer shadow-2xs ${
                    filter.value !== (filter.defaultValue ?? 'all')
                      ? 'border-[#601A24] text-[#601A24] font-semibold bg-rose-50/30'
                      : 'border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                      {opt.count !== undefined ? ` (${opt.count})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {(hasActiveFilters || search) && onResetFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  onResetFilters();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors border border-stone-200/60"
                title="Reset search and filters"
              >
                <RotateCcw className="w-3 h-3 text-stone-500" />
                <span>Reset</span>
              </button>
            )}

            {/* Filter Count summary */}
            <div className="text-[11px] font-mono text-stone-400 pl-1">
              <span className="tabular-nums font-semibold text-stone-700">{totalItems}</span> matching
            </div>
          </div>
        </div>
      )}

      {/* Floating or Inline Batch Action Bar */}
      {selectable && selectedIds.length > 0 && batchActions && (
        <div className="bg-[#181415] text-white px-4 py-2.5 text-xs flex items-center justify-between border-b border-stone-800 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="font-bold text-rose-200 font-mono tabular-nums">
              {selectedIds.length}
            </span>
            <span className="text-stone-300">items selected</span>
            <button
              onClick={clearSelection}
              className="ml-2 text-stone-400 hover:text-white underline text-[11px]"
            >
              Clear selection
            </button>
          </div>
          <div>{batchActions(selectedIds, clearSelection)}</div>
        </div>
      )}

      {/* Main Table Grid */}
      <div className="overflow-x-auto min-h-[200px]">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-[#FBF9F7] text-stone-500 font-semibold border-b border-stone-200/90 text-[11px] tracking-wider uppercase select-none">
            <tr>
              {selectable && (
                <th className="py-3 px-4 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-stone-400 hover:text-stone-900 focus:outline-none"
                    aria-label="Select all on this page"
                  >
                    {isAllCurrentSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#601A24]" />
                    ) : isSomeSelected ? (
                      <div className="w-4 h-4 border-2 border-[#601A24] rounded-sm bg-rose-50 flex items-center justify-center">
                        <div className="w-2 h-0.5 bg-[#601A24]" />
                      </div>
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const alignClass =
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left';

                return (
                  <th
                    key={col.key}
                    className={`py-3.5 px-4 whitespace-nowrap ${alignClass} ${col.headerClassName || ''}`}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className={`inline-flex items-center gap-1 font-semibold group focus:outline-none transition-colors ${
                          isSorted ? 'text-[#601A24]' : 'text-stone-500 hover:text-stone-900'
                        }`}
                      >
                        <span>{col.header}</span>
                        {isSorted ? (
                          sortDir === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-[#601A24]" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-[#601A24]" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500 transition-colors" />
                        )}
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100/90">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={`skel-${rIdx}`} className="animate-pulse">
                  {selectable && (
                    <td className="py-3 px-4">
                      <div className="w-4 h-4 bg-stone-100 rounded" />
                    </td>
                  )}
                  {columns.map((col, cIdx) => (
                    <td key={`skel-c-${cIdx}`} className="py-3 px-4">
                      <div className="h-4 bg-stone-100 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-16 text-center text-stone-500"
                >
                  <div className="max-w-sm mx-auto space-y-2">
                    <SlidersHorizontal className="w-8 h-8 text-stone-300 mx-auto" />
                    <p className="font-semibold text-stone-800 text-sm">{emptyMessage}</p>
                    <p className="text-xs text-stone-400">{emptySubtitle}</p>
                    {(hasActiveFilters || search) && onResetFilters && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSearch('');
                            onResetFilters();
                          }}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              paginatedData.map((item, idx) => {
                const rowId = getRowId(item, idx);
                const isSelected = selectedIds.includes(rowId);
                const customClass = rowClassName ? rowClassName(item, idx) : '';

                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-rose-50/50'
                        : onRowClick
                        ? 'hover:bg-stone-50/80 cursor-pointer'
                        : 'hover:bg-stone-50/60'
                    } ${customClass}`}
                  >
                    {selectable && (
                      <td
                        className="py-3 px-4 text-center w-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSelectRow(rowId)}
                          className="text-stone-400 hover:text-stone-900 focus:outline-none"
                          aria-label={`Select row ${rowId}`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#601A24]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    )}

                    {columns.map((col) => {
                      const alignClass =
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left';

                      return (
                        <td
                          key={col.key}
                          className={`py-3 px-4 ${alignClass} ${col.className || ''}`}
                        >
                          {col.cell(item, idx)}
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

      {/* Pagination Bar */}
      {paginated && totalItems > 0 && (
        <div className="p-3.5 sm:px-6 border-t border-stone-100 bg-[#FAF8F5]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          {/* Summary */}
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <span className="font-mono font-bold text-stone-900 tabular-nums">
              {(effectivePage - 1) * pageSize + 1}
            </span>
            <span>to</span>
            <span className="font-mono font-bold text-stone-900 tabular-nums">
              {Math.min(effectivePage * pageSize, totalItems)}
            </span>
            <span>of</span>
            <span className="font-mono font-bold text-stone-900 tabular-nums">{totalItems}</span>
            <span>entries</span>
          </div>

          {/* Controls: Page Size + Buttons */}
          <div className="flex items-center gap-4">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-stone-500">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-white border border-stone-300 rounded-md px-2 py-1 text-xs focus:outline-none cursor-pointer"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination Button Stepper */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={effectivePage <= 1}
                onClick={() => setCurrentPage(1)}
                className="p-1.5 rounded border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                disabled={effectivePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-2 font-mono text-[11px] font-semibold text-stone-800 tabular-nums">
                {effectivePage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={effectivePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                disabled={effectivePage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1.5 rounded border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Last Page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
