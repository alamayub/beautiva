import React, { useState, useMemo } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  RefreshCw, 
  X,
  Truck,
  FileSpreadsheet
} from 'lucide-react';
import { InventoryItem } from '../../data/dashboardData';
import { formatCurrency } from '../../lib/currency';
import { useToast } from '../../components/common/ToastProvider';
import { DataTable, ColumnDef, FilterDef } from '../../components/common/DataTable';
import { ActionMenu, ActionMenuItem } from '../../components/common/ActionMenu';

interface AdminInventoryProps {
  inventory: InventoryItem[];
  onRestock: (id: string, additionalUnits: number) => void;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({
  inventory,
  onRestock
}) => {
  const { showToast } = useToast();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(20);

  const filters: FilterDef[] = [
    {
      id: 'category',
      label: 'Kit Category',
      value: categoryFilter,
      defaultValue: 'all',
      options: [
        { label: 'All Inventory', value: 'all' },
        { label: 'Facial Kits', value: 'Facial Kit' },
        { label: 'Waxing Supplies', value: 'Waxing' },
        { label: 'Single-use Disposables', value: 'Disposables' },
      ],
      onChange: setCategoryFilter,
    },
    {
      id: 'status',
      label: 'Stock Health',
      value: statusFilter,
      defaultValue: 'all',
      options: [
        { label: 'All Stock', value: 'all' },
        { label: 'Low Buffer', value: 'low_stock' },
        { label: 'Sufficient', value: 'sufficient' },
      ],
      onChange: setStatusFilter,
    },
  ];

  const preFiltered = useMemo(() => {
    return inventory.filter((i) => {
      if (categoryFilter !== 'all' && i.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      return true;
    });
  }, [inventory, categoryFilter, statusFilter]);

  const handleApplyRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || restockAmount <= 0) return;
    onRestock(selectedItem.id, restockAmount);
    showToast(`Replenished +${restockAmount} units of ${selectedItem.productName}`);
    setSelectedItem(null);
  };

  const totalValue = inventory.reduce((sum, i) => sum + i.currentStock * i.unitCost, 0);

  const columns: ColumnDef<InventoryItem>[] = [
    {
      key: 'brand',
      header: 'Manufacturer Brand',
      sortable: true,
      cell: (item) => <span className="font-bold text-stone-900">{item.brand}</span>
    },
    {
      key: 'productName',
      header: 'Cosmetic Pack / Item',
      sortable: true,
      cell: (item) => (
        <div>
          <div className="font-semibold text-stone-800">{item.productName}</div>
          <div className="text-[11px] text-stone-400 font-mono">{item.unit}</div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      cell: (item) => (
        <span className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
          {item.category}
        </span>
      )
    },
    {
      key: 'currentStock',
      header: 'In-Stock',
      align: 'right',
      sortable: true,
      cell: (item) => (
        <span className="font-mono font-bold text-stone-900 text-sm tabular-nums">
          {item.currentStock}
        </span>
      )
    },
    {
      key: 'minThreshold',
      header: 'Min Buffer',
      align: 'right',
      sortable: true,
      cell: (item) => (
        <span className="font-mono text-stone-500 tabular-nums">
          {item.minThreshold}
        </span>
      )
    },
    {
      key: 'batchNumber',
      header: 'Batch & Expiry',
      cell: (item) => (
        <div className="font-mono text-[11px] text-stone-600">
          <div>{item.batchNumber}</div>
          <div className="text-stone-400">Exp: {item.expiryDate}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item) => {
        const isLow = item.currentStock <= item.minThreshold;
        return isLow ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase whitespace-nowrap">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Low Buffer</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Sufficient</span>
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (item) => {
        const menuItems: ActionMenuItem[] = [
          {
            label: 'Receive Stock Shipment',
            icon: Plus,
            onClick: () => {
              setSelectedItem(item);
              setRestockAmount(20);
            },
            variant: 'primary'
          },
          {
            label: 'Quick Add +50 Units',
            icon: Truck,
            onClick: () => {
              onRestock(item.id, 50);
              showToast(`Added +50 units of ${item.productName}`);
            }
          },
          {
            label: 'Audit Sealed Kit Batch',
            icon: RefreshCw,
            onClick: () => {
              showToast(`Batch ${item.batchNumber} validated with QA certificate`);
            },
            divider: true
          }
        ];

        return (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => {
                setSelectedItem(item);
                setRestockAmount(20);
              }}
              className="px-2.5 py-1 text-xs font-semibold text-[#601A24] bg-stone-100 hover:bg-[#601A24] hover:text-white rounded transition-colors inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Restock</span>
            </button>
            <ActionMenu items={menuItems} ariaLabel={`Actions for ${item.productName}`} />
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-editorial font-bold text-stone-900">
            Sealed Brand Kit & Consumables Inventory
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Tracking mono-dose sealed cosmetic packs and hospital-grade single-use disposables across hubs.
          </p>
        </div>

        <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center gap-3 shadow-2xs">
          <span>Total Warehoused Value:</span>
          <span className="font-mono font-bold text-stone-900 text-sm tabular-nums">
            {formatCurrency(totalValue)}
          </span>
        </div>
      </div>

      {/* Shared DataTable Component */}
      <DataTable<InventoryItem>
        data={preFiltered}
        columns={columns}
        idField="id"
        searchable={true}
        searchPlaceholder="Search brand, kit formulation, batch code..."
        filters={filters}
        onResetFilters={() => {
          setCategoryFilter('all');
          setStatusFilter('all');
        }}
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        emptyMessage="No inventory items found"
        emptySubtitle="Try adjusting the kit category or stock health filter."
      />

      {/* Restock Batch Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">
                Receive Supplier Shipment
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 text-stone-400 hover:text-stone-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400">Target Item</span>
              <p className="font-bold text-stone-900">{selectedItem.productName}</p>
              <p className="text-stone-500 font-mono">
                Current Stock: {selectedItem.currentStock} {selectedItem.unit}
              </p>
            </div>

            <form onSubmit={handleApplyRestock} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Additional Units Received:
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#601A24] font-mono font-bold"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600">
                <span>New Buffer: </span>
                <strong className="font-mono">
                  {selectedItem.currentStock + restockAmount} {selectedItem.unit}
                </strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#601A24] text-white font-semibold hover:bg-[#4a121a] shadow-xs"
                >
                  Confirm Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
