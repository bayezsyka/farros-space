import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { FormEvent, useState, ChangeEvent } from 'react';
import { Upload, Package, Star, Clock, Tag, Crop, CheckCircle2 } from 'lucide-react';
import { AdminPageHeader } from '@/Components/ui/AdminPageHeader';
import ImageCropModal from '@/Components/ui/ImageCropModal';

interface MarketplaceItem {
    id: number;
    name: string;
    slug: string;
    image_path: string | null;
    image_cropped_path: string | null;
    status: 'baru' | 'bekas';
    description: string | null;
    price: number;
    whatsapp: string | null;
}

interface Props {
    item: MarketplaceItem;
}

export default function Edit({ item }: Props) {
    // Original image preview
    const [preview, setPreview] = useState<string | null>(item.image_path);
    // Cropped 1:1 preview
    const [croppedPreview, setCroppedPreview] = useState<string | null>(item.image_cropped_path);
    const [showCrop, setShowCrop] = useState(false);
    const [cropSrc, setCropSrc] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: item.name,
        image: null as File | null,
        image_cropped: null as File | null,
        status: item.status,
        description: item.description ?? '',
        price: item.price?.toString() ?? '',
        _method: 'put',
    });

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('image', file);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setCropSrc(objectUrl);
        setShowCrop(true);
        setCroppedPreview(null);
        e.target.value = '';
    };

    const handleCropConfirm = (croppedFile: File, croppedUrl: string) => {
        setData('image_cropped', croppedFile);
        setCroppedPreview(croppedUrl);
        setShowCrop(false);
    };

    const handleCropCancel = () => {
        setShowCrop(false);
    };

    // Re-crop existing image (use existing image_path as crop source)
    const handleReCrop = () => {
        const src = preview ?? item.image_path;
        if (src) {
            setCropSrc(src);
            setShowCrop(true);
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('dashboard.marketplace.update', item.slug), {
            forceFormData: true,
        });
    };

    const fieldClass = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all";
    const labelClass = "block text-sm font-semibold text-zinc-700 mb-1.5";

    return (
        <DashboardLayout header="Marketplace">
            <Head title={`Edit - ${item.name}`} />

            <AdminPageHeader
                title="Edit Item"
                description={`marketplace/${item.slug}`}
                icon={<Package className="w-5 h-5" />}
                backHref={route('dashboard.marketplace.index')}
            />

            <form onSubmit={submit} className="space-y-5 max-w-2xl">
                {/* Nama & Harga */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className={labelClass}>
                            Nama Item <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            className={fieldClass}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Laptop MacBook Pro M2"
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div>
                        <label htmlFor="price" className={labelClass}>
                            <span className="inline-flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5 text-zinc-400" />
                                Harga <span className="text-red-400">*</span>
                            </span>
                        </label>
                        <input
                            id="price"
                            type="number"
                            className={fieldClass}
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            placeholder="Contoh: 15000000"
                        />
                        <InputError message={errors.price} className="mt-1" />
                    </div>
                </div>

                {/* Foto */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                    <p className={labelClass}>Foto Produk</p>

                    <div className="flex items-start gap-5">
                        <label htmlFor="image" className="relative group cursor-pointer shrink-0">
                            <div className="w-24 h-24 rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-200 group-hover:border-zinc-400 transition-colors overflow-hidden flex items-center justify-center">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Package className="w-7 h-7 text-zinc-300" />
                                )}
                                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
                                    <Upload className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <input type="file" id="image" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>

                        <div className="pt-1 flex-1">
                            <label htmlFor="image" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 cursor-pointer hover:text-zinc-500 transition-colors">
                                <Upload className="w-4 h-4" />
                                {preview ? 'Ganti Gambar' : 'Pilih Gambar'}
                            </label>
                            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                                Biarkan kosong jika tidak ingin mengubah foto.<br />
                                Foto asli disimpan penuh. Foto kolase di-crop 1:1.
                            </p>
                            <InputError message={errors.image} className="mt-1" />

                            {/* Crop result info */}
                            {(croppedPreview || item.image_cropped_path) && (
                                <div className="mt-3 flex items-center gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100">
                                    <img
                                        src={croppedPreview ?? item.image_cropped_path!}
                                        alt="Crop preview"
                                        className="w-10 h-10 rounded-lg object-cover border border-violet-200 shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                                            <p className="text-xs font-semibold text-violet-700">
                                                {croppedPreview ? 'Foto kolase diperbarui (1:1)' : 'Foto kolase tersimpan (1:1)'}
                                            </p>
                                        </div>
                                        {preview && (
                                            <button
                                                type="button"
                                                onClick={handleReCrop}
                                                className="text-[11px] text-violet-500 hover:text-violet-700 transition-colors mt-0.5 inline-flex items-center gap-1"
                                            >
                                                <Crop className="w-3 h-3" />
                                                Ubah posisi crop
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* If has image but no crop yet, offer to crop */}
                            {preview && !croppedPreview && !item.image_cropped_path && (
                                <button
                                    type="button"
                                    onClick={handleReCrop}
                                    className="mt-3 text-xs text-violet-600 hover:text-violet-800 font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-100 transition-colors"
                                >
                                    <Crop className="w-3.5 h-3.5" />
                                    Set foto kolase (1:1)
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Kondisi */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                    <p className={labelClass}>Kondisi Barang <span className="text-red-400">*</span></p>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { value: 'baru', label: 'Barang Baru', desc: 'Belum pernah dipakai', icon: Star },
                            { value: 'bekas', label: 'Barang Bekas', desc: 'Pernah digunakan', icon: Clock },
                        ].map(({ value, label, desc, icon: Icon }) => (
                            <label
                                key={value}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${data.status === value
                                    ? value === 'baru' ? 'border-emerald-400 bg-emerald-50' : 'border-amber-400 bg-amber-50'
                                    : 'border-zinc-100 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-200'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${data.status === value
                                    ? value === 'baru' ? 'bg-emerald-500' : 'bg-amber-500'
                                    : 'bg-zinc-200'
                                    }`}>
                                    <Icon className={`w-4 h-4 ${data.status === value ? 'text-white' : 'text-zinc-400'}`} />
                                </div>
                                <div>
                                    <p className={`text-sm font-semibold ${data.status === value ? (value === 'baru' ? 'text-emerald-700' : 'text-amber-700') : 'text-zinc-600'}`}>
                                        {label}
                                    </p>
                                    <p className="text-xs text-zinc-400">{desc}</p>
                                </div>
                                <input type="radio" name="status" value={value} className="hidden" onChange={() => setData('status', value as 'baru' | 'bekas')} />
                            </label>
                        ))}
                    </div>
                    <InputError message={errors.status} className="mt-2" />
                </div>

                {/* Deskripsi */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                    <label htmlFor="description" className={labelClass}>
                        Deskripsi <span className="font-normal text-zinc-400">(opsional)</span>
                    </label>
                    <textarea
                        id="description"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all resize-none min-h-[130px]"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Kondisi, spesifikasi, alasan jual, dan info lainnya..."
                    />
                    <InputError message={errors.description} className="mt-1" />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pb-8">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold transition-colors disabled:opacity-60"
                    >
                        {processing ? 'Menyimpan...' : 'Perbarui Item'}
                    </button>
                    <Link href={route('dashboard.marketplace.index')} className="flex-1">
                        <button type="button" className="w-full py-3 rounded-xl border border-zinc-200 text-zinc-700 text-sm font-semibold hover:bg-zinc-50 transition-colors">
                            Batal
                        </button>
                    </Link>
                </div>
            </form>

            {/* Crop Modal */}
            {showCrop && cropSrc && (
                <ImageCropModal
                    src={cropSrc}
                    onConfirm={handleCropConfirm}
                    onCancel={handleCropCancel}
                />
            )}
        </DashboardLayout>
    );
}
