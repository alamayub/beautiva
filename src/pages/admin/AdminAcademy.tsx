import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Award, 
  UserCheck, 
  Plus, 
  X,
  MapPin,
  Phone,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { initialAcademyStudents, AcademyStudent } from '../../data/dashboardData';
import { useToast } from '../../components/common/ToastProvider';
import { DataTable, ColumnDef, FilterDef } from '../../components/common/DataTable';
import { ActionMenu, ActionMenuItem } from '../../components/common/ActionMenu';

export const AdminAcademy: React.FC = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState<AcademyStudent[]>(initialAcademyStudents);
  const [campusFilter, setCampusFilter] = useState('all');
  const [placementFilter, setPlacementFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New trainee state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCourse, setNewCourse] = useState('Diploma in Cosmetology & Skin Science');
  const [newCity, setNewCity] = useState<'Lucknow' | 'Patna'>('Lucknow');

  const filters: FilterDef[] = [
    {
      id: 'campus',
      label: 'Campus',
      value: campusFilter,
      defaultValue: 'all',
      options: [
        { label: 'All Campuses', value: 'all' },
        { label: 'Lucknow Campus', value: 'Lucknow' },
        { label: 'Patna Campus', value: 'Patna' },
      ],
      onChange: setCampusFilter,
    },
    {
      id: 'placement',
      label: 'Placement Status',
      value: placementFilter,
      defaultValue: 'all',
      options: [
        { label: 'All Trainees', value: 'all' },
        { label: 'Inducted in Fleet', value: 'placed_salonline' },
        { label: 'In Training', value: 'pending' },
      ],
      onChange: setPlacementFilter,
    },
  ];

  const preFiltered = useMemo(() => {
    return students.filter((s) => {
      if (campusFilter !== 'all' && s.city !== campusFilter) return false;
      if (placementFilter !== 'all' && s.placementStatus !== placementFilter) return false;
      return true;
    });
  }, [students, campusFilter, placementFilter]);

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newStudent: AcademyStudent = {
      id: `acad-${Date.now()}`,
      studentName: newName,
      phone: newPhone,
      course: newCourse,
      city: newCity,
      enrollmentDate: new Date().toISOString().slice(0, 10),
      progressPercent: 10,
      apprenticeshipHours: 0,
      status: 'training',
      placementStatus: 'pending'
    };

    setStudents([newStudent, ...students]);
    setIsModalOpen(false);
    setNewName('');
    setNewPhone('');
    showToast(`Enrolled ${newStudent.studentName} into Salonline Beauty School`);
  };

  const handleAddHours = (studentId: string, hours: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newHours = s.apprenticeshipHours + hours;
          const newStatus = newHours >= 40 ? 'apprenticeship' : s.status;
          return {
            ...s,
            apprenticeshipHours: newHours,
            status: newStatus,
          };
        }
        return s;
      })
    );
    showToast(`Logged +${hours} apprenticeship hours`);
  };

  const handleInductFleet = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, placementStatus: 'placed_salonline', progressPercent: 100 }
          : s
      )
    );
    showToast('Trainee inducted into Salonline verified stylist fleet!');
  };

  const columns: ColumnDef<AcademyStudent>[] = [
    {
      key: 'studentName',
      header: 'Student Name',
      sortable: true,
      cell: (s) => (
        <div>
          <div className="font-bold text-stone-900">{s.studentName}</div>
          <div className="text-[11px] text-stone-400 font-mono">{s.phone}</div>
        </div>
      )
    },
    {
      key: 'course',
      header: 'Course Track',
      sortable: true,
      cell: (s) => <span className="font-semibold text-stone-800">{s.course}</span>
    },
    {
      key: 'city',
      header: 'Campus',
      sortable: true,
      cell: (s) => (
        <span className="inline-flex items-center gap-1 text-[11px] text-stone-600">
          <MapPin className="w-3.5 h-3.5 text-stone-400" />
          <span>{s.city} Campus</span>
        </span>
      )
    },
    {
      key: 'enrollmentDate',
      header: 'Enrolled Date',
      sortable: true,
      cell: (s) => <span className="font-mono text-[11px] text-stone-500">{s.enrollmentDate}</span>
    },
    {
      key: 'progressPercent',
      header: 'Curriculum Progress',
      sortable: true,
      cell: (s) => (
        <div className="min-w-[130px]">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1 text-stone-700">
            <span>{s.progressPercent}% Completed</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#601A24] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${s.progressPercent}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'apprenticeshipHours',
      header: 'Apprenticeship',
      align: 'right',
      sortable: true,
      cell: (s) => (
        <span className="font-mono font-bold text-stone-900 tabular-nums">
          {s.apprenticeshipHours} hrs
        </span>
      )
    },
    {
      key: 'placementStatus',
      header: 'Placement Status',
      cell: (s) =>
        s.placementStatus === 'placed_salonline' ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Inducted in Fleet</span>
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded whitespace-nowrap">
            In Training
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
            label: 'Log +5 Apprenticeship Hours',
            icon: Clock,
            onClick: () => handleAddHours(s.id, 5),
            variant: 'primary'
          },
          {
            label: 'Induct into Stylist Fleet',
            icon: UserCheck,
            onClick: () => handleInductFleet(s.id),
            disabled: s.placementStatus === 'placed_salonline'
          },
          {
            label: `Call Student (${s.phone})`,
            icon: Phone,
            onClick: () => {
              window.open(`tel:${s.phone}`);
            },
            divider: true
          },
          {
            label: 'Issue Diploma Certificate',
            icon: Award,
            onClick: () => {
              showToast(`Generated Salonline Beauty School Diploma for ${s.studentName}`);
            }
          }
        ];

        return <ActionMenu items={menuItems} ariaLabel={`Actions for ${s.studentName}`} />;
      }
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-editorial font-bold text-stone-900">
            Salonline Beauty School · Vocational Trainees
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Tracking cosmetology students, practical salon apprenticeships, and doorstep fleet placements.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Enroll New Trainee</span>
        </button>
      </div>

      {/* Trainee Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 font-medium block">Total Active Trainees</span>
          <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block tabular-nums">
            {students.length} Students
          </span>
          <span className="text-[11px] text-emerald-700">Lucknow & Patna Campuses</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 font-medium block">In Doorstep Apprenticeship</span>
          <span className="text-2xl font-bold font-mono text-[#601A24] mt-1 block tabular-nums">
            {students.filter(s => s.status === 'apprenticeship').length} Trainees
          </span>
          <span className="text-[11px] text-stone-500">Mentored by Senior Stylists</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 font-medium block">Fleet Induction Rate</span>
          <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block tabular-nums">
            100% Guaranteed
          </span>
          <span className="text-[11px] text-stone-500">Immediate field onboarding</span>
        </div>
      </div>

      {/* Shared DataTable Component */}
      <DataTable<AcademyStudent>
        data={preFiltered}
        columns={columns}
        idField="id"
        searchable={true}
        searchPlaceholder="Search student name, phone, course..."
        filters={filters}
        onResetFilters={() => {
          setCampusFilter('all');
          setPlacementFilter('all');
        }}
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        emptyMessage="No students found"
        emptySubtitle="Try adjusting the campus or placement status filter."
      />

      {/* Enroll Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">Enroll Beauty School Student</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnroll} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Aarti Mishra"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-[#601A24]"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-[#601A24]"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Course Track</label>
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:outline-none"
                >
                  <option value="Diploma in Cosmetology & Skin Science">Diploma in Cosmetology & Skin Science</option>
                  <option value="Advanced Bridal & HD Makeup Artistry">Advanced Bridal & HD Makeup Artistry</option>
                  <option value="Professional Hair Technology">Professional Hair Technology</option>
                  <option value="Nail Art, Extensions & Reflexology">Nail Art, Extensions & Reflexology</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Campus</label>
                <select
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:outline-none"
                >
                  <option value="Lucknow">Lucknow Campus (Faizabad Rd)</option>
                  <option value="Patna">Patna Campus (Patliputra)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#601A24] text-white font-semibold rounded-lg hover:bg-[#4a121a] shadow-xs"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
