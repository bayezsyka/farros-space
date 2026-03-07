import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { AdminPageHeader } from '@/Components/ui/AdminPageHeader';
import { Button } from '@/Components/ui/Button';
import { Typography } from '@/Components/ui/Typography';
import {
    Plus, Trash2, Edit2, Check, X, GraduationCap,
    GripVertical, ExternalLink,
} from 'lucide-react';

// DND Kit imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ── Level options ────────────────────────────────────────────────────────────
const LEVELS = [
    { value: 'SD', label: 'SD', full: 'Sekolah Dasar', color: 'bg-orange-100 text-orange-700', hasMajor: false },
    { value: 'SMP', label: 'SMP', full: 'Sekolah Menengah Pertama', color: 'bg-yellow-100 text-yellow-700', hasMajor: false },
    { value: 'SMA', label: 'SMA', full: 'Sekolah Menengah Atas', color: 'bg-lime-100 text-lime-700', hasMajor: true },
    { value: 'SMK', label: 'SMK', full: 'Sekolah Menengah Kejuruan', color: 'bg-teal-100 text-teal-700', hasMajor: true },
    { value: 'D1', label: 'D1', full: 'Diploma 1', color: 'bg-cyan-100 text-cyan-700', hasMajor: true },
    { value: 'D2', label: 'D2', full: 'Diploma 2', color: 'bg-cyan-100 text-cyan-700', hasMajor: true },
    { value: 'D3', label: 'D3', full: 'Diploma 3', color: 'bg-sky-100 text-sky-700', hasMajor: true },
    { value: 'D4', label: 'D4', full: 'Diploma 4', color: 'bg-sky-100 text-sky-700', hasMajor: true },
    { value: 'S1', label: 'S1', full: 'Sarjana', color: 'bg-blue-100 text-blue-700', hasMajor: true },
    { value: 'S2', label: 'S2', full: 'Magister', color: 'bg-violet-100 text-violet-700', hasMajor: true },
    { value: 'S3', label: 'S3', full: 'Doktor', color: 'bg-purple-100 text-purple-700', hasMajor: true },
    { value: 'Lainnya', label: 'Lainnya', full: 'Lainnya', color: 'bg-zinc-100 text-zinc-600', hasMajor: true },
];

const getLevelMeta = (value: string) =>
    LEVELS.find((l) => l.value === value) ?? LEVELS[LEVELS.length - 1];

// ─────────────────────────────────────────────────────────────────────────────

interface EducationItem {
    id: number;
    level: string;
    institution: string;
    program_major: string | null;
    start_year: string;
    end_year: string | null;
    sort_order: number;
}

interface Props {
    education: EducationItem[];
}

const inputClass =
    'w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all';
const labelClass =
    'block text-xs font-semibold text-zinc-600 mb-1 uppercase tracking-wider';

// ── Reusable form fields ──────────────────────────────────────────────
function EducationForm({
    data, setData, errors, processing, onSubmit, onCancel, submitLabel,
}: {
    data: any;
    setData: (key: string, value: string) => void;
    errors: any;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    submitLabel?: string;
}) {
    const meta = getLevelMeta(data.level);

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Tingkat *</label>
                    <select
                        className={inputClass}
                        value={data.level}
                        onChange={(e) => setData('level', e.target.value)}
                        required
                    >
                        {LEVELS.map((l) => (
                            <option key={l.value} value={l.value}>
                                {l.label} — {l.full}
                            </option>
                        ))}
                    </select>
                    {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level}</p>}
                </div>

                <div>
                    <label className={labelClass}>Nama Sekolah / Institusi *</label>
                    <input
                        type="text"
                        className={inputClass}
                        placeholder={
                            meta.value === 'SD' ? 'Contoh: SDN Margahayu 01'
                                : meta.value === 'SMP' ? 'Contoh: SMPN 1 Jakarta'
                                    : meta.value === 'SMA' || meta.value === 'SMK' ? 'Contoh: SMAN 1 Brebes'
                                        : 'Contoh: Universitas Diponegoro'
                        }
                        value={data.institution}
                        onChange={(e) => setData('institution', e.target.value)}
                        required
                    />
                    {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
                </div>

                {meta.hasMajor && (
                    <div className="md:col-span-2">
                        <label className={labelClass}> Jurusan / Program Studi <span className="ml-1 text-zinc-400 normal-case font-normal">(opsional)</span></label>
                        <input
                            type="text"
                            className={inputClass}
                            value={data.program_major}
                            onChange={(e) => setData('program_major', e.target.value)}
                        />
                    </div>
                )}

                <div>
                    <label className={labelClass}>Tahun Masuk *</label>
                    <input
                        type="text"
                        className={inputClass}
                        maxLength={4}
                        value={data.start_year}
                        onChange={(e) => setData('start_year', e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>Tahun Lulus <span className="ml-1 text-zinc-400 normal-case font-normal">(kosongkan jika aktif)</span></label>
                    <input
                        type="text"
                        className={inputClass}
                        maxLength={10}
                        value={data.end_year}
                        onChange={(e) => setData('end_year', e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Batal
                </Button>
                <Button type="submit" disabled={processing} className="rounded-xl">
                    <Check className="w-3.5 h-3.5 mr-1" />
                    {processing ? 'Menyimpan...' : (submitLabel ?? 'Simpan')}
                </Button>
            </div>
        </form>
    );
}

// ── Sortable Item row ───────────────────────────────────────────────
function SortableRow({
    item,
    editingId,
    startEdit,
    handleDelete,
    editForm,
    handleUpdate,
    setEditingId,
}: {
    item: EducationItem;
    editingId: number | null;
    startEdit: (item: EducationItem) => void;
    handleDelete: (id: number) => void;
    editForm: any;
    handleUpdate: (e: React.FormEvent, id: number) => void;
    setEditingId: (id: number | null) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : undefined,
    };

    const meta = getLevelMeta(item.level);

    if (editingId === item.id) {
        return (
            <div ref={setNodeRef} style={style} className="bg-zinc-50 px-6 py-5 border-b border-zinc-100">
                <EducationForm
                    data={editForm.data}
                    setData={(k, v) => editForm.setData(k as any, v)}
                    errors={editForm.errors}
                    processing={editForm.processing}
                    onSubmit={(e) => handleUpdate(e, item.id)}
                    onCancel={() => setEditingId(null)}
                />
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/60 transition-colors group border-b border-zinc-100 ${isDragging ? 'bg-white shadow-lg relative' : ''}`}
        >
            {/* Draggable Handle */}
            <div
                {...attributes}
                {...listeners}
                className="p-1 rounded text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100 cursor-grab active:cursor-grabbing shrink-0"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Level badge */}
            <span className={`shrink-0 inline-flex items-center justify-center w-12 h-8 rounded-lg text-xs font-bold ${meta.color}`}>
                {meta.label}
            </span>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 truncate">
                    {item.institution}
                </p>
                {item.program_major && (
                    <p className="text-xs text-zinc-500 italic mt-0.5 truncate">
                        {item.program_major}
                    </p>
                )}
            </div>

            {/* Year */}
            <div className="text-xs text-zinc-500 font-medium shrink-0 text-right whitespace-nowrap">
                {item.start_year} –{' '}
                {item.end_year
                    ? (item.end_year === 'now' ? 'Sekarang' : item.end_year)
                    : <span className="text-green-600 font-semibold">Aktif</span>
                }
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                    onClick={() => startEdit(item)}
                    className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function EducationIndex({ education: initialEducation }: Props) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [localEducation, setLocalEducation] = useState(initialEducation);

    // Sync state when props change
    useEffect(() => {
        setLocalEducation(initialEducation);
    }, [initialEducation]);

    /* ── Forms ── */
    const createForm = useForm({
        level: 'S1',
        institution: '',
        program_major: '',
        start_year: '',
        end_year: '',
        sort_order: '',
    });

    const editForm = useForm({
        level: 'S1',
        institution: '',
        program_major: '',
        start_year: '',
        end_year: '',
        sort_order: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('dashboard.education.store'), {
            preserveScroll: true,
            onSuccess: () => { setIsCreating(false); createForm.reset(); },
        });
    };

    const startEdit = (item: EducationItem) => {
        setEditingId(item.id);
        editForm.setData({
            level: item.level,
            institution: item.institution,
            program_major: item.program_major ?? '',
            start_year: item.start_year,
            end_year: item.end_year ?? '',
            sort_order: String(item.sort_order),
        });
    };

    const handleUpdate = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        editForm.put(route('dashboard.education.update', id), {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Yakin ingin menghapus data pendidikan ini?')) return;
        router.delete(route('dashboard.education.destroy', id), { preserveScroll: true });
    };

    /* ── Drag & Drop Handlers ── */
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = localEducation.findIndex(i => i.id === active.id);
            const newIndex = localEducation.findIndex(i => i.id === over.id);

            const newOrder = arrayMove(localEducation, oldIndex, newIndex);
            setLocalEducation(newOrder);

            // Send reorder request to backend
            router.post(route('dashboard.education.reorder'), {
                ids: newOrder.map(item => item.id),
            }, {
                preserveScroll: true,
            });
        }
    };

    const sorted = [...localEducation].sort((a, b) => a.sort_order - b.sort_order);

    return (
        <DashboardLayout header="Pendidikan">
            <Head title="Kelola Pendidikan" />

            <AdminPageHeader
                title="Riwayat Pendidikan"
                description="Tarik dan lepas (drag & drop) untuk mengatur urutan. Data ini akan muncul otomatis di CV."
                icon={<GraduationCap className="w-5 h-5" />}
            />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                        {localEducation.length} data
                    </span>
                    <a href="/cv" target="_blank" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <ExternalLink className="w-3 h-3" /> Preview CV
                    </a>
                </div>
                {!isCreating && (
                    <Button onClick={() => setIsCreating(true)} className="gap-2 rounded-xl">
                        <Plus className="w-4 h-4" /> Tambah Pendidikan
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {isCreating && (
                    <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm ring-1 ring-blue-100">
                        <Typography variant="large" className="font-semibold mb-5 text-zinc-900">✦ Tambah Riwayat Pendidikan</Typography>
                        <EducationForm
                            data={createForm.data}
                            setData={(k, v) => createForm.setData(k as any, v)}
                            errors={createForm.errors}
                            processing={createForm.processing}
                            onSubmit={handleCreate}
                            onCancel={() => { setIsCreating(false); createForm.reset(); }}
                            submitLabel="Tambahkan"
                        />
                    </div>
                )}

                <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                    {localEducation.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-zinc-500">
                            <GraduationCap className="w-12 h-12 mb-4 text-zinc-200" />
                            <p>Belum ada data pendidikan.</p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={localEducation.map(i => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="divide-y divide-zinc-100">
                                    {localEducation.map((item) => (
                                        <SortableRow
                                            key={item.id}
                                            item={item}
                                            editingId={editingId}
                                            startEdit={startEdit}
                                            handleDelete={handleDelete}
                                            editForm={editForm}
                                            handleUpdate={handleUpdate}
                                            setEditingId={setEditingId}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
