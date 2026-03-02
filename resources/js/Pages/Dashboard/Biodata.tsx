import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { FormEventHandler } from 'react';
import { Save, User, Mail, Phone, Calendar, MapPin, Briefcase, TextQuote } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { AdminPageHeader } from '@/Components/ui/AdminPageHeader';

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

    const fieldClass = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all";
    const labelClass = "block text-sm font-semibold text-zinc-700 mb-1.5";

    return (
        <DashboardLayout header="Biodata">
            <Head title="Kelola Biodata" />

            <AdminPageHeader
                title="Biodata"
                description="Informasi ini akan ditampilkan pada halaman publik situs Anda."
                icon={<User className="w-5 h-5" />}
            />

            <form onSubmit={submit} className="space-y-5 max-w-3xl">
                {/* Avatar */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                    <p className="text-sm font-bold text-zinc-700 mb-4">Foto Profil</p>
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-100 border-2 border-zinc-200 shrink-0">
                            {(profile as any)?.avatar_url ? (
                                <img src={(profile as any).avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                    <User className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                onChange={(e) => setData('avatar', e.target.files ? e.target.files[0] : null)}
                                className="text-sm text-zinc-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border file:border-zinc-200 file:text-xs file:font-semibold file:bg-zinc-50 file:text-zinc-700 hover:file:bg-zinc-100 cursor-pointer file:transition-colors"
                                accept="image/*"
                            />
                            <InputError message={errors.avatar} className="mt-1" />
                            <p className="text-xs text-zinc-400 mt-1.5">JPG, PNG, atau WEBP. Maks 10MB.</p>
                        </div>
                    </div>
                </div>

                {/* Info Dasar */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-6 space-y-4">
                    <p className="text-sm font-bold text-zinc-700">Informasi Dasar</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="full_name" className={labelClass}>Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                <TextInput
                                    id="full_name"
                                    className="w-full pl-9"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    required
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>
                            <InputError message={errors.full_name} className="mt-1" />
                        </div>

                        <div>
                            <label htmlFor="headline" className={labelClass}>Headline / Tagline</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                <TextInput
                                    id="headline"
                                    className="w-full pl-9"
                                    value={data.headline}
                                    onChange={(e) => setData('headline', e.target.value)}
                                    placeholder="Contoh: Fullstack Developer"
                                />
                            </div>
                            <InputError message={errors.headline} className="mt-1" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className={labelClass}>Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="w-full pl-9"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    placeholder="email@contoh.com"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div>
                            <label htmlFor="phone" className={labelClass}>No. Telepon</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                <TextInput
                                    id="phone"
                                    className="w-full pl-9"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="081234567890"
                                />
                            </div>
                            <InputError message={errors.phone} className="mt-1" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="birth_place" className={labelClass}>Tempat Lahir</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                <TextInput
                                    id="birth_place"
                                    className="w-full pl-9"
                                    value={data.birth_place}
                                    onChange={(e) => setData('birth_place', e.target.value)}
                                    placeholder="Contoh: Jakarta"
                                />
                            </div>
                            <InputError message={errors.birth_place} className="mt-1" />
                        </div>

                        <div>
                            <label htmlFor="birth_date" className={labelClass}>Tanggal Lahir</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                <TextInput
                                    id="birth_date"
                                    type="date"
                                    className="w-full pl-9"
                                    value={data.birth_date}
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.birth_date} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                    <label htmlFor="bio" className={labelClass}>Bio Singkat</label>
                    <div className="relative">
                        <TextQuote className="absolute left-3 top-3.5 w-4 h-4 text-zinc-300" />
                        <textarea
                            id="bio"
                            className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all resize-none min-h-[120px]"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            placeholder="Ceritakan sedikit tentang diri Anda..."
                        />
                    </div>
                    <InputError message={errors.bio} className="mt-1" />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pb-8 pt-1">
                    {recentlySuccessful && (
                        <p className="text-sm text-emerald-600 font-medium animate-in fade-in slide-in-from-bottom-1">
                            ✓ Berhasil disimpan
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={processing}
                        className="ml-auto inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
