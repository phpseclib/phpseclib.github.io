// src/data/asn1ConstructedTable.ts (no JSX here)

export type Row = {
  name: string;
  memory: string;   // "323mb"
  search1: string;  // "2.01s"
  search2: string;  // "0.01s"
};

export const data: Row[] = [
  { name: 'Eager Loading',     memory: '323mb', search1: '2.01s', search2: '0.01s' },
  { name: 'Lazy Loading',                           memory: '151mb', search1: '0.44s', search2: '0.08s' },
  { name: 'Lazy Loading (with cache clearing)',     memory: '43mb',  search1: '0.44s', search2: '0.36s' },
  { name: 'phpseclib v3',                           memory: '290mb', search1: '1.30s', search2: '0.01s' },
  //{ name: 'fgrosse/PHPASN1',                        memory: '163mb', search1: '0.85s', search2: '0.01s' }
];

// Small helper so sorting treats "323mb" / "2.01s" as numbers
export function parseNumberLike(input: unknown): number {
  if (typeof input !== 'string') return Number(input ?? 0);
  const n = parseFloat(input.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

// Column config for SortableTable
export const columns = [
  { key: 'name',    header: '',            bandLabel: '' },
  { key: 'memory',  header: 'Peak Memory', bandLabel: '', align: 'right',
    typeHint: 'number',
    accessor: (row: Row) => parseNumberLike(row.memory),
    render: (_v: unknown, row: Row) => row.memory,
  },
  { key: 'search1', header: 'Initial',     bandLabel: 'Search', typeHint: 'number',
    accessor: (row: Row) => parseNumberLike(row.search1),
    render: (_v: unknown, row: Row) => row.search1,
  },
  { key: 'search2', header: 'Subsequent',  bandLabel: 'Search', typeHint: 'number',
    accessor: (row: Row) => parseNumberLike(row.search2),
    render: (_v: unknown, row: Row) => row.search2,
  },
] as const;
