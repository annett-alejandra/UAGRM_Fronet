import { type ReactNode, useState, useCallback } from 'react';
import './Table.css';

type SortDirection = 'asc' | 'desc';

interface ColumnDef<T> {
  readonly key: string;
  readonly header: string;
  readonly sortable?: boolean;
  readonly render?: (row: T) => ReactNode;
  readonly width?: string;
}

interface TableProps<T> {
  readonly columns: readonly ColumnDef<T>[];
  readonly data: readonly T[];
  readonly getRowKey: (row: T) => string;
  readonly onRowClick?: (row: T) => void;
  readonly selectable?: boolean;
  readonly selectedKeys?: ReadonlySet<string>;
  readonly onSelectionChange?: (keys: ReadonlySet<string>) => void;
  readonly emptyMessage?: string;
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly onPageChange?: (page: number) => void;
  readonly totalItems?: number;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  getRowKey,
  onRowClick,
  selectable = false,
  selectedKeys = new Set(),
  onSelectionChange,
  emptyMessage = 'No hay datos disponibles',
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = useCallback((columnKey: string) => {
    setSortColumn((prev) => {
      if (prev === columnKey) {
        setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        return columnKey;
      }
      setSortDirection('asc');
      return columnKey;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;
    const allKeys = new Set(data.map(getRowKey));
    const allSelected = data.every((row) => selectedKeys.has(getRowKey(row)));
    onSelectionChange(allSelected ? new Set<string>() : allKeys);
  }, [data, getRowKey, selectedKeys, onSelectionChange]);

  const handleSelectRow = useCallback(
    (key: string) => {
      if (!onSelectionChange) return;
      const next = new Set(selectedKeys);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      onSelectionChange(next);
    },
    [selectedKeys, onSelectionChange],
  );

  const sortedData = sortColumn
    ? [...data].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        const comparison = String(aVal).localeCompare(String(bVal), 'es', { numeric: true });
        return sortDirection === 'asc' ? comparison : -comparison;
      })
    : data;

  const allSelected = data.length > 0 && data.every((row) => selectedKeys.has(getRowKey(row)));

  return (
    <div className="table-container">
      <table className="table">
        <thead className="table__head">
          <tr className="table__head-row">
            {selectable && (
              <th className="table__head-cell table__cell--checkbox">
                <input
                  type="checkbox"
                  className="table__checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Seleccionar todos"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={`table__head-cell ${col.sortable ? 'table__head-cell--sortable' : ''} ${sortColumn === col.key ? 'table__head-cell--sorted' : ''}`}
                style={col.width ? { width: col.width } : undefined}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                {col.header}
                {col.sortable && (
                  <span className="table__sort-icon" aria-hidden="true">
                    {sortColumn === col.key ? (
                      sortDirection === 'asc' ? '↑' : '↓'
                    ) : '↕'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                className="table__empty"
                colSpan={columns.length + (selectable ? 1 : 0)}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row) => {
              const key = getRowKey(row);
              const isSelected = selectedKeys.has(key);

              return (
                <tr
                  key={key}
                  className={`table__body-row ${isSelected ? 'table__body-row--selected' : ''} ${onRowClick ? 'table__body-row--clickable' : ''}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {selectable && (
                    <td className="table__cell table__cell--checkbox">
                      <input
                        type="checkbox"
                        className="table__checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(key);
                        }}
                        aria-label={`Seleccionar fila ${key}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="table__cell">
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {totalPages !== undefined && totalPages > 1 && currentPage !== undefined && onPageChange && (
        <div className="table__pagination">
          <span>
            {totalItems !== undefined
              ? `${totalItems} registro${totalItems !== 1 ? 's' : ''}`
              : `Página ${currentPage} de ${totalPages}`}
          </span>
          <div className="table__pagination-controls">
            <button
              type="button"
              className="table__page-btn"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Página anterior"
            >
              ‹
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  type="button"
                  className={`table__page-btn ${pageNum === currentPage ? 'table__page-btn--active' : ''}`}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              className="table__page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Página siguiente"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
