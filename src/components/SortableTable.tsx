import React, {useMemo, useState} from "react";

/**
 * Drop this file in: /src/components/SortableTable.tsx
 * Usage in MDX:
 *
 * import SortableTable from '@site/src/components/SortableTable';
 *
 * const data = [
 *   { name: 'Alice', age: 31, city: 'Austin', joined: '2024-02-10' },
 *   { name: 'Bob', age: 27, city: 'Dallas', joined: '2023-11-02' },
 *   { name: 'Cara', age: 27, city: 'Houston', joined: '2025-03-01' },
 * ];
 *
 * const columns = [
 *   { key: 'name', header: 'Name' },
 *   { key: 'age', header: 'Age', align: 'right' },
 *   { key: 'city', header: 'City' },
 *   { key: 'joined', header: 'Date Joined', typeHint: 'date' },
 * ];
 *
 * <SortableTable columns={columns} data={data} stickyHeader />
 */

export type Row = Record<string, unknown>;
export type Column<T extends Row = Row> = {
  key: string;
  header: React.ReactNode;
  accessor?: (row: T) => unknown;
  render?: (value: unknown, row: T) => React.ReactNode;
  compare?: (a: unknown, b: unknown, rowA?: T, rowB?: T) => number;
  align?: 'left' | 'center' | 'right';
  typeHint?: 'number' | 'date' | 'string';
  sortable?: boolean;
  width?: number | string;
};
export type SortDir = 'asc' | 'desc';

export type SortableTableProps<T extends Row = Row> = {
  columns: Column<T>[];
  data: T[];
  initialSortKey?: string;
  initialSortDir?: SortDir;
  caption?: string;
  striped?: boolean;
  stickyHeader?: boolean;
  className?: string;
  stickyOffset?: number;
  /** optional fixed row height in px (default 44) */
  rowHeight?: number;
  /** ellipsize cell content to keep consistent heights (default true) */
  nowrapCells?: boolean;
  /** provide a stable id for each row; if omitted, an internal WeakMap id is used */
  getRowId?: (row: T, index: number) => string | number;
  /** called when a row is selected */
  onRowSelect?: (row: T, id: string | number | undefined) => void;
};

const isNumber = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
const isDateLike = (v: unknown) => v instanceof Date || (typeof v === 'string' && !Number.isNaN(Date.parse(v)));

function defaultCompare(a: unknown, b: unknown, hint?: Column['typeHint']) {
  if (hint === 'number') {
    const na = typeof a === 'string' ? Number(a) : (a as number);
    const nb = typeof b === 'string' ? Number(b) : (b as number);
    return (na ?? 0) - (nb ?? 0);
  }
  if (hint === 'date') {
    const da = a instanceof Date ? a.getTime() : Date.parse(String(a ?? ''));
    const db = b instanceof Date ? b.getTime() : Date.parse(String(b ?? ''));
    return (da || 0) - (db || 0);
  }
  if (isNumber(a) && isNumber(b)) return (a as number) - (b as number);
  if (isDateLike(a) && isDateLike(b)) return (new Date(a as any).getTime() || 0) - (new Date(b as any).getTime() || 0);
  return String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true, sensitivity: 'base' });
}

function getCellValue<T extends Row>(col: Column<T>, row: T) {
  const raw = col.accessor ? col.accessor(row) : (row[col.key] as unknown);
  return raw;
}

function nextDir(dir: SortDir | undefined): SortDir {
  if (!dir) return 'asc';
  return dir === 'asc' ? 'desc' : 'asc';
}

export default function SortableTable<T extends Row = Row>({
  columns,
  data,
  initialSortKey,
  initialSortDir = 'asc',
  caption,
  striped = true,
  stickyHeader = false,
  className,
  stickyOffset = 0,
  rowHeight = 44,
  nowrapCells = true,
  getRowId,
  onRowSelect,
}: SortableTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | undefined>(initialSortKey);
  const [sortDir, setSortDir] = useState<SortDir>(initialSortDir);
  const [selectedId, setSelectedId] = useState<string | number | undefined>(undefined);

  // Stable row ids via WeakMap fallback
  const rowIdMap = React.useRef(new WeakMap<object, number>()).current;
  const idCounter = React.useRef(1);
  function ensureId(row: T, index: number): string | number {
    if (getRowId) return getRowId(row, index);
    if (!rowIdMap.has(row as unknown as object)) {
      rowIdMap.set(row as unknown as object, idCounter.current++);
    }
    return rowIdMap.get(row as unknown as object)!;
  }

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;

    const decorated = data.map((row, idx) => ({ row, idx }));
    decorated.sort((A, B) => {
      const va = getCellValue(col, A.row as T);
      const vb = getCellValue(col, B.row as T);
      const cmp = col.compare ? col.compare(va, vb, A.row as T, B.row as T) : defaultCompare(va, vb, col.typeHint);
      if (cmp !== 0) return sortDir === 'asc' ? cmp : -cmp;
      return A.idx - B.idx;
    });

    return decorated.map((d) => d.row as T);
  }, [data, sortKey, sortDir, columns]);

  function onHeaderClick(key: string, sortable = true) {
    if (!sortable) return;
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDir((prevDir) => nextDir(prevDir));
        return prevKey;
      }
      setSortDir('asc');
      return key;
    });
  }

  const currentDir = sortDir;

  return (
    <div className="overflow-x-auto">
      <table className={["table", striped ? "table--striped" : '', className].filter(Boolean).join(' ')} style={{ tableLayout: 'fixed' }}>
        {caption && <caption style={{ captionSide: 'top', textAlign: 'left' }}>{caption}</caption>}
        <thead
          style={
            stickyHeader
              ? { position: 'sticky', top: stickyOffset, zIndex: 1, background: 'var(--ifm-table-stripe-background)' }
              : undefined
          }
        >
          {(() => {
            const bands = columns.map((c) => c.bandLabel ?? null);
            const hasBand = bands.some((b) => b !== null && b !== undefined);
            if (!hasBand) return null;
            const cells: React.ReactNode[] = [];
            let i = 0;
            while (i < columns.length) {
              const label = bands[i];
              let j = i + 1;
              while (j < columns.length && bands[j] === label) j++;
              cells.push(
                <th
                  key={`band-${i}`}
                  colSpan={j - i}
                  style={{ textAlign: 'center', height: rowHeight }}
                >
                  {label ?? ''}
                </th>
              );
              i = j;
            }
            return <tr>{cells}</tr>;
          })()}
          <tr>
            {columns.map((col) => {
              const dir = sortKey === col.key ? currentDir : undefined;
              const ariaSort = dir ? (dir === 'asc' ? 'ascending' : 'descending') : 'none';
              const align = col.align ?? 'left';
              const style: React.CSSProperties = {
                textAlign: align,
                cursor: col.sortable === false ? 'default' : 'pointer',
                width: col.width,
                whiteSpace: 'nowrap',
                userSelect: 'none',
                height: rowHeight,
              };
              return (
                <th key={col.key} scope="col" aria-sort={ariaSort as any} style={style}>
                  <button
                    type="button"
                    onClick={() => onHeaderClick(col.key, col.sortable !== false)}
                    title={col.sortable === false ? undefined : 'Click to sort'}
                    aria-label={typeof col.header === 'string' && col.header.trim() === '' ? `Sort by ${col.key}` : undefined}
                    style={{
                      all: 'unset',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      height: '100%',
                      padding: '0 8px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span style={{flex: 1}}>{col.header}</span>
                    {col.sortable === false ? null : <SortIcon dir={dir} />}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const id = ensureId(row as T, i);
            const isSelected = selectedId === id;
            return (
              <tr
                key={String(id)}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedId(id);
                  onRowSelect?.(row as T, id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedId(id);
                    onRowSelect?.(row as T, id);
                  }
                }}
                style={{
                  height: rowHeight,
                  background: isSelected ? 'var(--ifm-color-emphasis-200)' : undefined,
                  cursor: 'pointer',
                }}
              >
                {columns.map((col) => {
                  const val = getCellValue(col, row as T);
                  const align = col.align ?? 'left';
                  const cellStyle: React.CSSProperties = {
                    textAlign: align,
                    height: rowHeight,
                    verticalAlign: 'middle',
                    ...(nowrapCells ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } : {}),
                  };
                  return (
                    <td key={col.key} style={cellStyle} title={String(val ?? '')}>
                      {col.render ? col.render(val, row as T) : String(val ?? '')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({ dir }: { dir?: SortDir }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" role="img" aria-label={dir ? `Sorted ${dir}` : 'Not sorted'}>
      <path d="M7 10l5-5 5 5H7z" fill={dir === 'asc' ? 'currentColor' : 'currentColor'} opacity={dir ? 1 : 0.35} />
      <path d="M7 14h10l-5 5-5-5z" fill={dir === 'desc' ? 'currentColor' : 'currentColor'} opacity={dir ? 1 : 0.35} />
    </svg>
  );
}
