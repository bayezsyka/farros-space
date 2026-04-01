import React, { useState, useRef } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Container } from '@/Components/ui/Container';
import { PageHeader } from '@/Components/ui/PageHeader';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Experience } from '@/types';
import { formatExperienceDate } from '@/lib/utils';
import { 
    ArrowLeft, 
    Image as ImageIcon, 
    X, 
    Calendar, 
    Briefcase, 
    Users, 
    UserCog,
    Clock,
    Trash2,
    MessageSquare
} from 'lucide-react';

interface Props {
    experience: Experience;
    auth: {
        user: any;
        canManage: boolean;
    };
}

export default function Show({ experience, auth }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        content: '',
        image: null as File | null,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (fileInput.current) fileInput.current.value = '';
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('experience-updates.store', experience.id), {
            onSuccess: () => {
                reset();
                setImagePreview(null);
                clearErrors();
            },
            forceFormData: true,
        });
    };

    const handleFinalSave = () => {
        import('@inertiajs/react').then(({ router }) => {
            router.put(route('experiences.update', experience.id), {
                type: experience.type,
                company_or_event_name: experience.company_or_event_name,
                umbrella_organization: experience.umbrella_organization,
                role: experience.role,
                start_date: experience.start_date,
                end_date: experience.end_date,
            }, {
                onSuccess: () => setIsEditing(false),
            });
        });
    };

    const handleDeleteUpdate = (id: number) => {
        if (confirm('Hapus cerita ini?')) {
            import('@inertiajs/react').then(({ router }) => {
                router.delete(route('experience-updates.destroy', id));
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
        <AppLayout title={experience.role}>
            <Head title={`${experience.role} at ${experience.company_or_event_name}`} />

            <PageHeader
                breadcrumbs={[
                    { label: 'Experiences', href: route('experiences.index') },
                    { label: experience.role }
                ]}
                badge={{ icon: Briefcase, label: 'Detail Pengalaman' }}
                title={experience.role}
                subtitle={experience.company_or_event_name}
            />

            <section className="py-8 md:py-12">
                <Container className="max-w-3xl px-4 sm:px-6">
                    <Link 
                        href={route('experiences.index')}
                        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Daftar
                    </Link>

                    {/* Quick Info Card */}
                    <div className="mb-8 bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                        
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shadow-inner">
                                    {getTypeIcon(experience.type)}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                                            {experience.type}
                                        </span>
                                    </div>
                                    <Typography variant="h3" className="text-xl font-black">{experience.role}</Typography>
                                    <Typography variant="muted" className="text-sm font-bold">{experience.company_or_event_name}</Typography>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <div className="flex flex-wrap gap-2 justify-end">
                                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-xl border border-border/50 text-[11px] font-bold text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {formatExperienceDate(experience.start_date, experience.end_date)}
                                    </div>
                                    {experience.umbrella_organization && (
                                        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-xl border border-border/50 text-[11px] font-bold text-muted-foreground">
                                            <Users className="w-3 h-3" />
                                            {experience.umbrella_organization}
                                        </div>
                                    )}
                                </div>

                                {auth.canManage && (
                                    <div className="flex gap-2">
                                        {isEditing ? (
                                            <>
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => setIsEditing(false)}
                                                    className="rounded-xl h-9 px-4 font-bold text-xs"
                                                >
                                                    Batal
                                                </Button>
                                                <Button 
                                                    onClick={handleFinalSave}
                                                    className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl h-9 px-6 font-bold text-xs shadow-lg shadow-primary/20"
                                                >
                                                    Simpan (Update AI)
                                                </Button>
                                            </>
                                        ) : (
                                            <Button 
                                                onClick={() => setIsEditing(true)}
                                                className="bg-foreground text-background hover:opacity-90 rounded-xl h-9 px-5 font-bold text-xs"
                                            >
                                                Perbarui Experience
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Add Update Form */}
                    {auth.canManage && isEditing && (
                        <div className="mb-12">
                            <Card className="rounded-[2rem] border border-border bg-card overflow-hidden shadow-sm">
                                <form onSubmit={submit} className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-9 h-9 rounded-2xl bg-primary/5 flex items-center justify-center">
                                            <MessageSquare className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <Typography variant="h3" className="text-sm font-black">Bagikan Cerita</Typography>
                                            <Typography variant="muted" className="text-[11px]">Bagikan progres atau momen pengalamanmu</Typography>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <textarea
                                            id="content"
                                            name="content"
                                            value={data.content}
                                            rows={3}
                                            className="w-full bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 rounded-2xl p-4 text-sm font-medium resize-none text-foreground placeholder:text-muted-foreground/30 transition-all"
                                            onChange={(e) => setData('content', e.target.value)}
                                            placeholder="Tulis ceritamu di sini..."
                                            required
                                        />
                                        <InputError message={errors.content} />

                                        {imagePreview && (
                                            <div className="relative rounded-xl overflow-hidden border border-border mt-2 group">
                                                <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-60 object-cover" />
                                                <button 
                                                    type="button" 
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    ref={fileInput}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                                <Button 
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => fileInput.current?.click()}
                                                    className="rounded-xl h-9 px-4 font-bold text-xs hover:bg-muted text-muted-foreground hover:text-foreground transition-all flex items-center gap-2"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                    Lampirkan Foto
                                                </Button>
                                            </div>

                                            <PrimaryButton 
                                                className="bg-foreground text-background hover:opacity-90 rounded-xl h-9 px-5 font-bold text-xs" 
                                                disabled={processing}
                                            >
                                                {processing ? '...' : 'Posting'}
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </form>
                            </Card>
                        </div>
                    )}

                    {/* Timeline Updates */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Typography variant="h4" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Linimasa Cerita</Typography>
                            <div className="h-px bg-border/50 flex-grow" />
                        </div>

                        {experience.updates && experience.updates.length > 0 ? (
                            <div className="relative pl-6 space-y-10 before:content-[''] before:absolute before:left-[10px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
                                {experience.updates.map((update) => (
                                    <div key={update.id} className="relative group">
                                        <div className="absolute -left-[20px] top-6 w-[10px] h-[10px] rounded-full bg-background border-2 border-foreground z-10 transition-transform group-hover:scale-125" />

                                        <Card className="rounded-2xl border-border bg-card shadow-sm hover:shadow transition-all duration-300 overflow-hidden">
                                            <CardContent className="p-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase bg-muted/50 px-2.5 py-1 rounded-lg border border-border/50">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(update.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                    {auth.canManage && isEditing && (
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => handleDeleteUpdate(update.id)}
                                                            className="w-7 h-7 rounded-full hover:bg-destructive/5 hover:text-destructive text-muted-foreground/30 transition-all"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                                
                                                <Typography className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80 font-medium">
                                                    {update.content}
                                                </Typography>

                                                {update.image_path && (
                                                    <div className="rounded-xl overflow-hidden border border-border mt-4">
                                                        <img 
                                                            src={`/storage/${update.image_path}`} 
                                                            alt="Experience update image" 
                                                            className="w-full h-auto object-cover max-h-[300px]" 
                                                        />
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-muted/5 border border-dashed border-border rounded-2xl">
                                <Typography variant="muted" className="text-xs font-bold italic opacity-40">Belum ada cerita perjalanan...</Typography>
                            </div>
                        )}
                    </div>
                </Container>
            </section>
        </AppLayout>
    );
}
