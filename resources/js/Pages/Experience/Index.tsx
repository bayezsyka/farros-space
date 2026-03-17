import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Container } from '@/Components/ui/Container';
import { PageHeader } from '@/Components/ui/PageHeader';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Experience } from '@/types';
import { formatExperienceDate } from '@/lib/utils';
import { Plus, Briefcase, Users, UserCog, Calendar, Pencil, Trash2, ArrowRight } from 'lucide-react';

interface Props {
    experiences: Experience[];
    auth: {
        user: any;
        canManage: boolean;
    };
}

export default function Index({ experiences, auth }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        type: 'work' as 'work' | 'organization' | 'committee',
        company_or_event_name: '',
        umbrella_organization: '',
        role: '',
        start_date: '',
        end_date: '' as string | null,
        is_current: false,
    });

    const openModal = (experience: Experience | null = null) => {
        setEditingExperience(experience);
        if (experience) {
            setData({
                type: experience.type,
                company_or_event_name: experience.company_or_event_name,
                umbrella_organization: experience.umbrella_organization || '',
                role: experience.role,
                start_date: experience.start_date,
                end_date: experience.end_date,
                is_current: experience.end_date === null,
            });
        } else {
            reset();
        }
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            ...data,
            end_date: data.is_current ? null : data.end_date,
        };

        if (editingExperience) {
            put(route('experiences.update', editingExperience.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('experiences.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus pengalaman ini? Semua cerita di dalamnya juga akan terhapus.')) {
            router.delete(route('experiences.destroy', id));
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'work': return <Briefcase className="w-5 h-5 text-blue-500" />;
            case 'organization': return <Users className="w-5 h-5 text-green-500" />;
            case 'committee': return <UserCog className="w-5 h-5 text-orange-500" />;
            default: return <Briefcase className="w-5 h-5" />;
        }
    };

    return (
        <AppLayout title="Experiences">
            <Head title="Experiences" />
            
            <PageHeader
                breadcrumbs={[{ label: 'Experiences' }]}
                badge={{ icon: Briefcase, label: 'Karier & Organisasi' }}
                title="Experiences"
                subtitle="Daftar perjalanan karier, organisasi, dan kepanitiaan yang pernah saya ikuti."
                actions={auth.canManage ? (
                    <Button 
                        onClick={() => openModal()}
                        className="bg-foreground text-background hover:opacity-90 rounded-2xl px-6 font-bold shadow-lg shadow-foreground/10 h-11"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Pengalaman
                    </Button>
                ) : null}
            />

            <section className="py-8 md:py-12">
                <Container className="max-w-5xl px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {experiences.map((exp) => (
                            <Link key={exp.id} href={route('experiences.show', exp.id)}>
                                <Card className="group rounded-[2rem] border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 h-full flex flex-col">
                                    <div className="p-6 pb-2 relative overflow-hidden flex-grow">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                                                {getTypeIcon(exp.type)}
                                            </div>
                                            {auth.canManage && (
                                                <div className="flex items-center gap-1">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            openModal(exp);
                                                        }}
                                                        className="w-9 h-9 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDelete(exp.id);
                                                        }}
                                                        className="w-9 h-9 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 mb-2">
                                                {exp.type}
                                            </div>
                                            <Typography variant="h3" className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors">
                                                {exp.role}
                                            </Typography>
                                            <Typography variant="muted" className="text-sm font-bold text-muted-foreground">
                                                {exp.company_or_event_name}
                                            </Typography>
                                        </div>
                                    </div>

                                    <CardContent className="px-6 pb-6 pt-0">
                                        <div className="pt-4 border-t border-border/50 flex flex-col gap-4">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatExperienceDate(exp.start_date, exp.end_date)}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                                        {exp.updates?.length || 0}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                        Cerita
                                                    </span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}

                        {experiences.length === 0 && (
                            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-muted/20 rounded-[2rem] border border-dashed border-border border-2">
                                <div className="p-6 rounded-full bg-muted mb-4">
                                    <Briefcase className="w-12 h-12 text-muted-foreground/20" />
                                </div>
                                <Typography variant="h3" className="text-lg font-black mb-1">Belum ada pengalaman</Typography>
                                <Typography variant="muted" className="max-w-xs mx-auto mb-6 text-sm">
                                    Mulai catat perjalanan karier atau organisasi pertamamu sekarang.
                                </Typography>
                                {auth.canManage && (
                                    <Button 
                                        onClick={() => openModal()}
                                        className="bg-foreground text-background hover:opacity-90 rounded-2xl px-8 h-12 font-bold shadow-lg shadow-foreground/10"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Tambah Pertama
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </Container>
            </section>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
                <form onSubmit={submit} className="p-6 sm:p-8">
                    <div className="mb-6">
                        <Typography variant="h2" className="text-xl font-black mb-1">
                            {editingExperience ? 'Edit Pengalaman' : 'Tambah Pengalaman'}
                        </Typography>
                        <Typography variant="muted" className="text-xs">Lengkapi detail perjalanan karier atau organisasimu.</Typography>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1.5">
                            <InputLabel htmlFor="type" value="Tipe" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1" />
                            <select
                                id="type"
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value as any)}
                            >
                                <option value="work">Pekerjaan</option>
                                <option value="organization">Organisasi</option>
                                <option value="committee">Kepanitiaan</option>
                            </select>
                            <InputError message={errors.type} className="mt-1" />
                        </div>

                        <div className="space-y-1.5">
                            <InputLabel htmlFor="company_or_event_name" value="Nama Instansi/Acara" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1" />
                            <TextInput
                                id="company_or_event_name"
                                className="w-full px-4 py-2.5 rounded-xl border-border bg-muted/30 text-sm"
                                value={data.company_or_event_name}
                                onChange={(e) => setData('company_or_event_name', e.target.value)}
                                placeholder="Google, BEM Univ, dsb"
                                required
                            />
                            <InputError message={errors.company_or_event_name} className="mt-1" />
                        </div>

                        {data.type === 'committee' && (
                            <div className="md:col-span-2 space-y-1.5">
                                <InputLabel htmlFor="umbrella_organization" value="Organisasi Induk" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1" />
                                <TextInput
                                    id="umbrella_organization"
                                    className="w-full px-4 py-2.5 rounded-xl border-border bg-muted/30 text-sm"
                                    value={data.umbrella_organization}
                                    onChange={(e) => setData('umbrella_organization', e.target.value)}
                                    placeholder="Opsional: BEM, Himpunan, dsb"
                                />
                                <InputError message={errors.umbrella_organization} className="mt-1" />
                            </div>
                        )}

                        <div className="md:col-span-2 space-y-1.5">
                            <InputLabel htmlFor="role" value="Peran / Jabatan" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1" />
                            <TextInput
                                id="role"
                                className="w-full px-4 py-2.5 rounded-xl border-border bg-muted/30 text-sm"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                placeholder="Contoh: Web Developer, Ketua, dsb"
                                required
                            />
                            <InputError message={errors.role} className="mt-1" />
                        </div>

                        <div className="space-y-1.5">
                            <InputLabel htmlFor="start_date" value="Mulai" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1" />
                            <TextInput
                                id="start_date"
                                type="date"
                                className="w-full px-4 py-2.5 rounded-xl border-border bg-muted/30 text-sm"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.start_date} className="mt-1" />
                        </div>

                        <div className="space-y-1.5">
                            <InputLabel htmlFor="end_date" value="Selesai" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1" />
                            <TextInput
                                id="end_date"
                                type="date"
                                className="w-full px-4 py-2.5 rounded-xl border-border bg-muted/30 text-sm disabled:opacity-30"
                                value={data.end_date || ''}
                                onChange={(e) => setData('end_date', e.target.value)}
                                disabled={data.is_current}
                            />
                            <InputError message={errors.end_date} className="mt-1" />
                        </div>

                        <div className="md:col-span-2 mt-2">
                            <label className="flex items-center cursor-pointer group w-fit">
                                <Checkbox
                                    name="is_current"
                                    checked={data.is_current}
                                    onChange={(e) => setData('is_current', e.target.checked)}
                                    className="w-5 h-5 rounded-lg text-foreground border-border bg-muted/30"
                                />
                                <span className="ml-3 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">Masih aktif hingga saat ini</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-6 border-t border-border/40">
                        <SecondaryButton onClick={closeModal} className="rounded-xl h-10 px-6 font-bold text-xs">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton className="rounded-xl h-10 px-6 bg-foreground text-background hover:opacity-90 font-bold text-xs" disabled={processing}>
                            {processing ? '...' : (editingExperience ? 'Simpan' : 'Tambah')}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
