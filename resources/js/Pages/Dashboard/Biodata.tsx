import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { Typography } from '@/Components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { FormEventHandler } from 'react';
import { Save, User, Mail, Phone, Calendar, MapPin, Briefcase, TextQuote } from 'lucide-react';

interface Profile {
    id: number;
    full_name: string;
    birth_place: string | null;
    birth_date: string | null;
    email: string;
    phone: string | null;
    headline: string | null;
    bio: string | null;
}

interface Props {
    profile: Profile | null;
}

export default function Biodata({ profile }: Props) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        full_name: profile?.full_name || '',
        birth_place: profile?.birth_place || '',
        birth_date: profile?.birth_date || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        headline: profile?.headline || '',
        bio: profile?.bio || '',
        avatar: null as File | null,
        _method: 'PUT' as const,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('dashboard.biodata.update'), {
            forceFormData: true,
        });
    };

    return (
        <DashboardLayout
            header={
                <Typography variant="large" className="font-bold">Kelola Biodata</Typography>
            }
        >
            <Head title="Kelola Biodata" />

            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <Typography variant="h2" className="border-none pb-0 text-3xl font-bold tracking-tight">Biodata Saya</Typography>
                    <Typography variant="muted" className="text-lg">Informasi ini akan ditampilkan pada halaman publik situs Anda.</Typography>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card className="bg-white border-none shadow-sm ring-1 ring-zinc-200 overflow-hidden">
                        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Informasi Dasar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex flex-col items-center gap-4 mb-6">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-100 border-2 border-zinc-200 relative group">
                                    {(profile as any)?.avatar_url ? (
                                        <img src={(profile as any).avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                            <User className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1 text-center">
                                    <InputLabel value="Foto Profil" className="text-zinc-700 font-semibold" />
                                    <input 
                                        type="file" 
                                        onChange={(e) => setData('avatar', e.target.files ? e.target.files[0] : null)}
                                        className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                        accept="image/*"
                                    />
                                    <InputError message={errors.avatar} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <InputLabel htmlFor="full_name" value="Nama Lengkap" className="text-zinc-700 font-semibold" />
                                    <div className="relative">
                                        <TextInput
                                            id="full_name"
                                            className="w-full pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            required
                                            placeholder="Masukkan nama lengkap"
                                        />
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    </div>
                                    <InputError message={errors.full_name} />
                                </div>

                                <div className="space-y-2">
                                    <InputLabel htmlFor="headline" value="Headline / Tagline" className="text-zinc-700 font-semibold" />
                                    <div className="relative">
                                        <TextInput
                                            id="headline"
                                            className="w-full pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
                                            value={data.headline}
                                            onChange={(e) => setData('headline', e.target.value)}
                                            placeholder="Contoh: Fullstack Developer"
                                        />
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    </div>
                                    <InputError message={errors.headline} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <InputLabel htmlFor="email" value="Email" className="text-zinc-700 font-semibold" />
                                    <div className="relative">
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="w-full pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            placeholder="email@contoh.com"
                                        />
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <InputLabel htmlFor="phone" value="No. Telepon" className="text-zinc-700 font-semibold" />
                                    <div className="relative">
                                        <TextInput
                                            id="phone"
                                            className="w-full pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="081234567890"
                                        />
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    </div>
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <InputLabel htmlFor="birth_place" value="Tempat Lahir" className="text-zinc-700 font-semibold" />
                                    <div className="relative">
                                        <TextInput
                                            id="birth_place"
                                            className="w-full pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
                                            value={data.birth_place}
                                            onChange={(e) => setData('birth_place', e.target.value)}
                                            placeholder="Contoh: Jakarta"
                                        />
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    </div>
                                    <InputError message={errors.birth_place} />
                                </div>

                                <div className="space-y-2">
                                    <InputLabel htmlFor="birth_date" value="Tanggal Lahir" className="text-zinc-700 font-semibold" />
                                    <div className="relative">
                                        <TextInput
                                            id="birth_date"
                                            type="date"
                                            className="w-full pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                        />
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    </div>
                                    <InputError message={errors.birth_date} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <InputLabel htmlFor="bio" value="Bio Singkat" className="text-zinc-700 font-semibold" />
                                <div className="relative">
                                    <textarea
                                        id="bio"
                                        className="w-full pl-10 pt-3 min-h-[150px] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 transition-all focus:ring-2 focus:ring-primary/20"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        placeholder="Ceritakan sedikit tentang diri Anda..."
                                    />
                                    <TextQuote className="absolute left-3 top-4 w-4 h-4 text-zinc-400" />
                                </div>
                                <InputError message={errors.bio} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-4">
                        {recentlySuccessful && (
                            <p className="text-sm text-green-600 animate-in fade-in slide-in-from-right-2">Berhasil disimpan.</p>
                        )}
                        <Button 
                            disabled={processing} 
                            className="rounded-xl h-11 px-8 gap-2 font-bold shadow-lg shadow-primary/20"
                        >
                            <Save className="w-4 h-4" />
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
