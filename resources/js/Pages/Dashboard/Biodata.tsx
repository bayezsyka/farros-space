import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { FormEventHandler } from 'react';
import { Save, User, Mail, Phone, Calendar, MapPin, Briefcase, TextQuote, Home } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { AdminPageHeader } from '@/Components/ui/AdminPageHeader';
import useTranslation from '@/Hooks/useTranslation';

interface Profile {
    id: number;
    full_name: string;
    birth_place: string | null;
    birth_date: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    headline: string | null;
    bio: string | null;
}

interface Props {
    profile: Profile | null;
}

export default function Biodata({ profile }: Props) {
    const { __ } = useTranslation();
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        full_name: profile?.full_name || '',
        birth_place: profile?.birth_place || '',
        birth_date: profile?.birth_date || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
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

    const fieldClass = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-700 transition-all shadow-sm";
    const labelClass = "block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5";

    return (
        <DashboardLayout header={__('Biodata')}>
            <Head title={__('Manage Biodata')} />

            <AdminPageHeader
                title={__('Biodata')}
                description={__('This information will be displayed on your site\'s public page.')}
                icon={<User className="w-5 h-5" />}
            />

            <form onSubmit={submit} className="space-y-5 max-w-3xl">
                {/* Avatar */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm">
                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-4">{__('Profile Photo')}</p>
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 shrink-0">
                            {(profile as any)?.avatar_url ? (
                                <img src={(profile as any).avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                                    <User className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                onChange={(e) => setData('avatar', e.target.files ? e.target.files[0] : null)}
                                className="text-sm text-zinc-500 dark:text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border file:border-zinc-200 dark:file:border-zinc-800 file:text-xs file:font-semibold file:bg-zinc-50 dark:file:bg-zinc-800 file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-100 dark:hover:file:bg-zinc-700 cursor-pointer file:transition-colors"
                                accept="image/*"
                            />
                            <InputError message={errors.avatar} className="mt-1" />
                            <p className="text-xs text-zinc-400 mt-1.5">{__('JPG, PNG, or WEBP. Max 10MB.')}</p>
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-4 shadow-sm">
                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{__('Basic Information')}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="full_name" className={labelClass}>{__('Full Name')}</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                                <TextInput
                                    id="full_name"
                                    className="w-full pl-9"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    required
                                    placeholder={__('Enter full name')}
                                />
                            </div>
                            <InputError message={errors.full_name} className="mt-1" />
                        </div>

                        <div>
                            <label htmlFor="headline" className={labelClass}>{__('Headline / Tagline')}</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                                <TextInput
                                    id="headline"
                                    className="w-full pl-9"
                                    value={data.headline}
                                    onChange={(e) => setData('headline', e.target.value)}
                                    placeholder={__('Example: Fullstack Developer')}
                                />
                            </div>
                            <InputError message={errors.headline} className="mt-1" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className={labelClass}>Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 dark:text-zinc-700" />
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
                            <label htmlFor="phone" className={labelClass}>{__('Phone Number')}</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 dark:text-zinc-700" />
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

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className={labelClass}>{__('Address (for CV)')}</label>
                        <div className="relative">
                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                            <TextInput
                                id="address"
                                className="w-full pl-9"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder={__('Example: Jakarta, Indonesia')}
                            />
                        </div>
                        <InputError message={errors.address} className="mt-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="birth_place" className={labelClass}>{__('Birth Place')}</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                                <TextInput
                                    id="birth_place"
                                    className="w-full pl-9"
                                    value={data.birth_place}
                                    onChange={(e) => setData('birth_place', e.target.value)}
                                    placeholder={__('Example: Jakarta')}
                                />
                            </div>
                            <InputError message={errors.birth_place} className="mt-1" />
                        </div>

                        <div>
                            <label htmlFor="birth_date" className={labelClass}>{__('Birth Date')}</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 dark:text-zinc-700" />
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
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm">
                    <label htmlFor="bio" className={labelClass}>{__('Short Bio')}</label>
                    <div className="relative">
                        <TextQuote className="absolute left-3 top-3.5 w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                        <textarea
                            id="bio"
                            className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-700 transition-all resize-none min-h-[120px]"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            placeholder={__('Tell us about yourself...')}
                        />
                    </div>
                    <InputError message={errors.bio} className="mt-1" />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pb-8 pt-1">
                    {recentlySuccessful && (
                        <p className="text-sm text-emerald-600 font-medium animate-in fade-in slide-in-from-bottom-1">
                            ✓ {__('Successfully saved')}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={processing}
                        className="ml-auto inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 shadow-lg shadow-zinc-900/10 dark:shadow-none"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? __('Saving...') : __('Save Changes')}
                    </button>
                </div>
            </form>
        </DashboardLayout >
    );
}
