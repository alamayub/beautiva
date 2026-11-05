import React, { useState, useMemo } from 'react';
import { 
  Users, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  X, 
  Award,
  Phone,
  Power,
  RotateCw,
  Check,
  Package,
  Layers,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import { StylistRecord } from '../../data/dashboardData';
import { formatCurrency } from '../../lib/currency';
import { useToast } from '../../components/common/ToastProvider';
import { DataTable, ColumnDef, FilterDef } from '../../components/common/DataTable';
import { ActionMenu, ActionMenuItem } from '../../components/common/ActionMenu';

interface AdminStylistsProps {
  stylists: StylistRecord[];
  selectedCity: string;
  onAddStylist: (stylist: StylistRecord) => void;
  onToggleStatus: (id: string, status: StylistRecord['status']) => void;
}

export const AdminStylists: React.FC<AdminStylistsProps> = ({
  stylists,
  selectedCity,
  onAddStylist,
  onToggleStatus
}) => {
  const { showToast } = useToast();
  const [cityFilter, setCityFilter] = useState(selectedCity);
  const [dutyFilter, setDutyFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // New stylist form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState<'Lucknow' | 'Patna' | 'Kanpur' | 'Gorakhpur' | 'Varanasi'>('Lucknow');
  const [newLocality, setNewLocality] = useState('');
  const [newSpec, setNewSpec] = useState('');
  const [newExp, setNewExp] = useState(3);

  React.useEffect(() => {
    setCityFilter(selectedCity);
  }, [selectedCity]);

  // Filters for DataTable
  const filters: FilterDef[] = [
    {
      id: 'city',
      label: 'Hub City',
      value: cityFilter,
      defaultValue: 'all',
      options: [
        { label: 'All Hubs', value: 'all' },
        { label: 'Lucknow', value: 'Lucknow' },
        { label: 'Patna', value: 'Patna' },
        { label: 'Kanpur', value: 'Kanpur' },
        { label: 'Gorakhpur', value: 'Gorakhpur' },
        { label: 'Varanasi', value: 'Varanasi' },
      ],
      onChange: setCityFilter,
    },
    {
      id: 'duty',
      label: 'Field Status',
      value: dutyFilter,
      defaultValue: 'all',
      options: [
        { label: 'All Statuses', value: 'all' },
        { label: 'On Duty', value: 'on_duty' },
        { label: 'In Service', value: 'in_service' },
        { label: 'Off Duty', value: 'off_duty' },
      ],
      onChange: setDutyFilter,
    },
  ];

  const preFiltered = useMemo(() => {
    return stylists.filter((s) => {
      if (cityFilter !== 'all' && s.city !== cityFilter) return false;
      if (dutyFilter !== 'all' && s.status !== dutyFilter) return false;
      return true;
    });
  }, [stylists, cityFilter, dutyFilter]);

  const handleCreateStylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) {
      showToast('Please enter name and phone', 'error');
      return;
    }

    const created: StylistRecord = {
      id: `sty-${Date.now()}`,
      name: newName,
      phone: newPhone,
      city: newCity,
      locality: newLocality || `${newCity} Central Hub`,
      specialization: newSpec || 'Cosmetology & Facial Therapy',
      experienceYears: Number(newExp),
      rating: 5.0,
      totalTrips: 0,
      monthlyEarnings: 0,
      status: 'on_duty',
      policeVerified: true,
      academyCertified: true,
      avatarInitials: newName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      activeKitBatch: `BATCH-${newCity.slice(0, 3).toUpperCase()}-26`
    };

    onAddStylist(created);
    setIsModalOpen(false);
    setNewName('');
    setNewPhone('');
    showToast(`Added ${created.name} to Beautiva fleet!`);
  };

  const columns: ColumnDef<StylistRecord>[] = [
    {
      key: 'name',
      header: 'Beautician Partner',
      sortable: true,
      cell: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#601A24] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {s.avatarInitials}
          </div>
          <div>
            <div className="font-bold text-stone-900">{s.name}</div>
            <div className="text-[11px] text-stone-400 font-mono">{s.phone}</div>
          </div>
        </div>
      )
    },
    {
      key: 'city',
      header: 'Hub & Locality',
      sortable: true,
      cell: (s) => (
        <div>
          <div className="font-semibold text-stone-800">{s.city} Hub</div>
          <div className="text-[11px] text-stone-400">{s.locality}</div>
        </div>
      )
    },
    {
      key: 'specialization',
      header: 'Specialization',
      cell: (s) => (
        <div className="max-w-[200px]">
          <div className="font-medium text-stone-800 truncate" title={s.specialization}>
            {s.specialization}
          </div>
          <div className="text-[11px] text-stone-400">{s.experienceYears} yrs experience</div>
        </div>
      )
    },
    {
      key: 'rating',
      header: 'CSAT Rating',
      sortable: true,
      cell: (s) => (
        <div className="flex items-center gap-1 text-amber-700 font-mono font-bold text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span className="tabular-nums">{s.rating}</span>
          <span className="text-[10px] text-stone-400 font-normal">({s.totalTrips} visits)</span>
        </div>
      )
    },
    {
      key: 'verifications',
      header: 'Trust & Verification',
      cell: (s) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {s.policeVerified && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Police Verified</span>
            </span>
          )}
          {s.academyCertified && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-rose-900 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-semibold">
              <Award className="w-3 h-3 text-[#601A24]" />
              <span>Academy</span>
            </span>
          )}
        </div>
      )
    },
    {
      key: 'monthlyEarnings',
      header: 'Monthly Payout',
      align: 'right',
      sortable: true,
      cell: (s) => (
        <span className="font-mono font-bold text-emerald-700 tabular-nums">
          {formatCurrency(s.monthlyEarnings)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (s) => (
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border whitespace-nowrap ${
            s.status === 'on_duty'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : s.status === 'in_service'
              ? 'bg-purple-50 text-purple-800 border-purple-200'
              : 'bg-stone-100 text-stone-600 border-stone-200'
          }`}
        >
          {s.status.replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (s) => {
        const menuItems: ActionMenuItem[] = [
          {
            label: 'Set On Duty (Available)',
            icon: Check,
            onClick: () => {
              onToggleStatus(s.id, 'on_duty');
              showToast(`Marked ${s.name} as On Duty`);
            },
            disabled: s.status === 'on_duty'
          },
          {
            label: 'Set In Service (Busy)',
            icon: RotateCw,
            onClick: () => {
              onToggleStatus(s.id, 'in_service');
              showToast(`Marked ${s.name} as In Service`);
            },
            disabled: s.status === 'in_service'
          },
          {
            label: 'Set Off Duty',
            icon: Power,
            onClick: () => {
              onToggleStatus(s.id, 'off_duty');
              showToast(`Marked ${s.name} as Off Duty`);
            },
            disabled: s.status === 'off_duty'
          },
          {
            label: `Call (${s.phone})`,
            icon: Phone,
            onClick: () => {
              window.open(`tel:${s.phone}`);
            },
            divider: true
          },
          {
            label: 'Re-issue Kit Batch',
            icon: Package,
            onClick: () => {
              showToast(`Dispatched replenishment kit batch for ${s.name}`);
            }
          }
        ];

        return <ActionMenu items={menuItems} ariaLabel={`Actions for ${s.name}`} />;
      }
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-editorial font-bold text-stone-900">
            Stylist Fleet & Partner Roster
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Managing background-verified female aestheticians, verification statuses, and monthly payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center p-1 bg-white border border-stone-200 rounded-lg shadow-2xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'table' ? 'bg-[#601A24] text-white' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Table view"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-[#601A24] text-white' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Card Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard New Beautician</span>
          </button>
        </div>
      </div>

      {/* Main View: Shared DataTable or Grid */}
      {viewMode === 'table' ? (
        <DataTable<StylistRecord>
          data={preFiltered}
          columns={columns}
          idField="id"
          searchable={true}
          searchPlaceholder="Search stylist by name, phone, specialization, locality..."
          filters={filters}
          onResetFilters={() => {
            setCityFilter('all');
            setDutyFilter('all');
          }}
          pageSize={10}
          pageSizeOptions={[10, 20, 50]}
          emptyMessage="No beauticians found"
          emptySubtitle="Try adjusting the hub city or duty status filter."
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {preFiltered.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#601A24] text-white flex items-center justify-center font-bold text-sm font-editorial">
                        {s.avatarInitials}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 text-sm">{s.name}</h3>
                        <p className="text-[11px] text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{s.locality}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-600 font-mono font-bold text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{s.rating}</span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-0.5">
                      Core Specialization
                    </span>
                    <p className="font-medium text-stone-800">{s.specialization}</p>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    {s.policeVerified && (
                      <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Police Verified</span>
                      </span>
                    )}
                    {s.academyCertified && (
                      <span className="flex items-center gap-1 text-rose-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-semibold">
                        <Award className="w-3 h-3 text-[#601A24]" />
                        <span>Beauty School Alum</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Total Completed Trips</span>
                      <span className="font-mono font-bold text-stone-900">{s.totalTrips}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block">Monthly Earnings</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {formatCurrency(s.monthlyEarnings)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                    <span className="text-stone-500 font-medium">Field Status:</span>
                    <select
                      value={s.status}
                      onChange={(e) => onToggleStatus(s.id, e.target.value as any)}
                      className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                        s.status === 'on_duty'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : s.status === 'in_service'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      <option value="on_duty">On Duty</option>
                      <option value="in_service">In Service (Busy)</option>
                      <option value="off_duty">Off Duty</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Onboarding Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Onboard Female Beautician Partner
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStylist} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-stone-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Shalini Kashyap"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-[#601A24]"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-[#601A24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Operating City</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:outline-none"
                  >
                    <option value="Lucknow">Lucknow</option>
                    <option value="Patna">Patna</option>
                    <option value="Kanpur">Kanpur</option>
                    <option value="Gorakhpur">Gorakhpur</option>
                    <option value="Varanasi">Varanasi</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={newExp}
                    onChange={(e) => setNewExp(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Assigned Hub / Locality</label>
                <input
                  type="text"
                  value={newLocality}
                  onChange={(e) => setNewLocality(e.target.value)}
                  placeholder="e.g. Chinhat Hub / Gomti Nagar"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Specialization</label>
                <input
                  type="text"
                  value={newSpec}
                  onChange={(e) => setNewSpec(e.target.value)}
                  placeholder="e.g. VLCC Facials & Rica Waxing"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-stone-100 text-stone-700 font-semibold hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#601A24] text-white font-semibold hover:bg-[#4a121a] shadow-xs"
                >
                  Save & Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
