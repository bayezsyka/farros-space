import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
import { createBreadcrumbJsonLd } from '@/lib/structuredData';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Container } from '@/Components/ui/Container';
import { PageHeader } from '@/Components/ui/PageHeader';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';
import { usePage } from '@inertiajs/react';
import useTranslation from '@/Hooks/useTranslation';
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
import { Plus, Briefcase, Users, UserCog, Calendar, Pencil, Trash2, ArrowRight, Download, Archive, ArchiveRestore, Sparkles } from 'lucide-react';
import ImportPdfModal from '@/Components/ui/ImportPdfModal';

interface Props {
    experiences: Experience[];
    auth: {
        user: any;
        canManage: boolean;
    };
}

export default function Index({ experiences, auth }: Props) {
    const { locale } = usePage<any>().props;
    const { __ } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isAiUpdating, setIsAiUpdating] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors, transform } = useForm({
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
                start_date: experience.start_date ? experience.start_date.substring(0, 7) : '',
                end_date: experience.end_date ? experience.end_date.substring(0, 7) : '',
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
        
        transform((data) => ({
            ...data,
            start_date: data.start_date ? `${data.start_date}-01` : '',
            end_date: data.is_current ? null : (data.end_date ? `${data.end_date}-01` : null),
        }));

        if (editingExperience) {
            put(route('experiences.update', { locale: locale, experience: editingExperience.slug }), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('experiences.store', { locale: locale }), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (experience: Experience) => {
        if (confirm(__('Delete this experience? All stories within it will also be deleted.'))) {
            router.delete(route('experiences.destroy', { locale: locale, experience: experience.slug }));
        }
    };

    const handleArchive = (experience: Experience) => {
        if (confirm(__('Archive ":role"? This experience will not appear on the public page.', { role: experience.role }))) {
            router.post(route('experiences.archive', { locale: locale, experience: experience.slug }));
        }
    };

    const handleUnarchive = (experience: Experience) => {
        if (confirm(__('Reactivate ":role"?', { role: experience.role }))) {
            router.post(route('experiences.unarchive', { locale: locale, experience: experience.slug }));
        }
    };

    const handleBulkAiUpdate = () => {
        if (confirm(__('Are you sure you want to update all experiences using AI? This will refresh all summaries based on current content.'))) {
            setIsAiUpdating(true);
            router.post(route('experiences.bulk-update-ai', { locale }), {}, {
                onFinish: () => setIsAiUpdating(false)
            });
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
        <AppLayout title={__('Experiences')}>
            <SeoHead 
                title={__('Experiences')} 
                description={__('Professional career journey, organizations, and committees.')}
                jsonLd={createBreadcrumbJsonLd([{ name: __('Experiences'), url: route('experiences.index', { locale: locale }) }])}
            />
            
            <PageHeader
                breadcrumbs={[{ label: __('Experiences') }]}
                badge={{ icon: Briefcase, label: __('Career & Organization') }}
                title={__('Experiences')}
                subtitle={__('A list of my career journey, organizations, and committees.')}
                actions={(
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href={route('cv.index', { locale: locale })}>
                            <Button 
                                variant="outline"
                                className="rounded-2xl px-6 font-bold h-11 border-border/50 hover:bg-muted"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {__('Download CV')}
                            </Button>
                        </Link>
                        {auth.canManage && (
                            <div className="flex items-center gap-3">
                                <Button 
                                    onClick={() => setIsImportModalOpen(true)}
                                    variant="outline"
                                    className="rounded-2xl px-6 font-bold h-11 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span className="hidden sm:inline">{__('Import from PDF')}</span>
                                    <span className="sm:hidden">{__('Import PDF')}</span>
                                </Button>
                                <Button 
                                    onClick={handleBulkAiUpdate}
                                    variant="outline"
                                    disabled={isAiUpdating}
                                    className="rounded-2xl px-6 font-bold h-11 border-amber-500/20 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-all gap-2"
                                >
                                    <Sparkles className={`w-4 h-4 ${isAiUpdating ? 'animate-spin' : ''}`} />
                                    <span className="hidden sm:inline">{isAiUpdating ? 'Updating...' : 'Update AI'}</span>
                                    <span className="sm:hidden">{isAiUpdating ? '...' : 'AI'}</span>
                                </Button>
                                <Button 
                                    onClick={() => openModal()}
                                    className="bg-foreground text-background hover:opacity-90 rounded-2xl px-6 font-bold shadow-lg shadow-foreground/10 h-11"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    {__('Add Experience')}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            />

            <section className="py-8 md:py-12">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="relative">
                                <Link href={route('experiences.show', { locale: locale, experience: exp.slug })}>
                                    <Card className={`group rounded-[2rem] border-border/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 h-full flex flex-col ${!!exp.is_archived ? 'bg-muted/10 grayscale-[0.8] opacity-70' : 'bg-card hover:bg-muted/30'}`}>
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
                                                            if (exp.is_archived) {
                                                                handleUnarchive(exp);
                                                            } else {
                                                                handleArchive(exp);
                                                            }
                                                        }}
                                                        className={`w-9 h-9 rounded-full transition-all ${exp.is_archived ? 'hover:bg-green-500/10 text-green-600' : 'hover:bg-amber-500/10 text-muted-foreground hover:text-amber-600'}`}
                                                        title={!!exp.is_archived ? __('Activate') : __('Archive')}
                                                    >
                                                        {!!exp.is_archived ? <ArchiveRestore className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDelete(exp);
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
                                                {__(exp.type.charAt(0).toUpperCase() + exp.type.slice(1))}
                                            </div>
                                            <Typography variant="h3" className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors">
                                                {locale === 'en' ? (exp.role_en || exp.role) : (exp.role_id || exp.role)}
                                            </Typography>
                                            <Typography variant="muted" className="text-sm font-bold text-muted-foreground">
                                                {locale === 'en' ? (exp.company_or_event_name_en || exp.company_or_event_name) : (exp.company_or_event_name_id || exp.company_or_event_name)}
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
                                                        {__('Stories')}
                                                    </span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                            {!!exp.is_archived && (
                                <div className="absolute top-4 left-6 z-20 pointer-events-none">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest shadow-sm">
                                        <Archive className="w-3 h-3" />
                                        {__('Archive')}
                                    </div>
                                </div>
                            )}
                            </div>
                        ))}

                        {experiences.length === 0 && (
                            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-muted/20 rounded-[2rem] border border-dashed border-border border-2">
                                <div className="p-6 rounded-full bg-muted mb-4">
                                    <Briefcase className="w-12 h-12 text-muted-foreground/20" />
                                </div>
                                <Typography variant="h3" className="text-lg font-black mb-1">{__('No experiences yet')}</Typography>
                                <Typography variant="muted" className="max-w-xs mx-auto mb-6 text-sm">
                                    {__('Start recording your first career or organization journey now.')}
                                </Typography>
                                {auth.canManage && (
                                    <Button 
                                        onClick={() => openModal()}
                                        className="bg-foreground text-background hover:opacity-90 rounded-2xl px-8 h-12 font-bold shadow-lg shadow-foreground/10"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        {__('Add First')}
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
                            {editingExperience ? __('Edit Experience') : __('Add Experience')}
                        </Typography>
                        <Typography variant="muted" className="text-xs">{__('Complete details of your career or organization journey.')}</Typography>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1.5">
                            <InputLabel htmlFor="type" value={__('Type')} className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1" />
                            <select
                                id="type"
                                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value as any)}
                            >
                                <option value="work">{__('Work')}</option>
                                <option value="organization">{__('Organization')}</option>
                                <option value="committee">{__('Committee')}</option>
                            </select>
                            <InputError message={errors.type} className="mt-1" />
                        </div>

                        <div className="space-y-1.5">
                            <InputLabel htmlFor="company_or_event_name" value={__('Institution/Event Name')} className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1" />
                            <TextInput
                                id="company_or_event_name"
                                value={data.company_or_event_name}
                                onChange={(e) => setData('company_or_event_name', e.target.value)}
                                placeholder={__('Google, BEM Univ, etc.')}
                                required
                            />
                            <InputError message={errors.company_or_event_name} className="mt-1" />
                        </div>

                        {data.type === 'committee' && (
                            <div className="md:col-span-2 space-y-1.5">
                                <InputLabel htmlFor="umbrella_organization" value={__('Umbrella Organization')} className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1" />
                                <TextInput
                                    id="umbrella_organization"
                                    value={data.umbrella_organization}
                                    onChange={(e) => setData('umbrella_organization', e.target.value)}
                                    placeholder={__('Optional: BEM, Himpunan, etc.')}
                                />
                                <InputError message={errors.umbrella_organization} className="mt-1" />
                            </div>
                        )}

                        <div className="md:col-span-2 space-y-1.5">
                            <InputLabel htmlFor="role" value={__('Role / Position')} className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1" />
                            <TextInput
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                placeholder={__('Example: Web Developer, Chair, etc.')}
                                required
                            />
                            <InputError message={errors.role} className="mt-1" />
                        </div>

                        <div className="space-y-1.5">
                            <InputLabel htmlFor="start_date" value={__('Start')} className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1" />
                            <TextInput
                                id="start_date"
                                type="month"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.start_date} className="mt-1" />
                        </div>

                        <div className="space-y-1.5">
                            <InputLabel htmlFor="end_date" value={__('End')} className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1" />
                            <TextInput
                                id="end_date"
                                type="month"
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
                                <span className="ml-3 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{__('Currently active')}</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-6 border-t border-border/40">
                        <SecondaryButton onClick={closeModal} className="rounded-xl h-10 px-6 font-bold text-xs" type="button">
                            {__('Cancel')}
                        </SecondaryButton>
                        <PrimaryButton className="rounded-xl h-10 px-6 bg-foreground text-background hover:opacity-90 font-bold text-xs" disabled={processing} type="submit">
                            {processing ? '...' : (editingExperience ? __('Save') : __('Add'))}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
            <ImportPdfModal 
                show={isImportModalOpen} 
                onClose={() => setIsImportModalOpen(false)} 
            />
        </AppLayout>
    );
}
