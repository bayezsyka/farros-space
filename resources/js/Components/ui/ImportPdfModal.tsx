import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Typography } from './Typography';
import { Button } from './Button';
import { FileUp, X, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface Props {
    show: boolean;
    onClose: () => void;
}

export default function ImportPdfModal({ show, onClose }: Props) {
    const [dragActive, setDragActive] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('file', e.target.files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                setData('file', file);
            }
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('experiences.import-pdf'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Sparkles className="w-5 h-5 font-black" />
                        </div>
                        <div>
                            <Typography variant="h3" className="text-xl font-black">Import dari PDF (AI)</Typography>
                            <Typography variant="muted" className="text-xs">Ekstrak pengalaman otomatis dengan Gemini AI</Typography>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div 
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`
                            relative border-2 border-dashed rounded-[2rem] p-8 text-center transition-all duration-300
                            ${dragActive ? 'border-primary bg-primary/5 scale-[0.98]' : 'border-border/50 bg-muted/20'}
                            ${data.file ? 'border-primary/50 bg-primary/5' : ''}
                        `}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept=".pdf"
                            onChange={handleFileChange}
                            required
                        />
                        
                        <div className="flex flex-col items-center gap-4">
                            {data.file ? (
                                <div className="p-4 rounded-2xl bg-primary/10 inline-flex items-center gap-3">
                                    <FileUp className="w-6 h-6 text-primary" />
                                    <span className="text-sm font-bold text-foreground max-w-[200px] truncate">{data.file.name}</span>
                                    <button 
                                        type="button" 
                                        onClick={(e) => { e.preventDefault(); setData('file', null); }}
                                        className="p-1 hover:bg-primary/20 rounded-lg text-primary transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm border border-border/10">
                                        <FileUp className="w-8 h-8 text-muted-foreground/40" />
                                    </div>
                                    <div>
                                        <Typography className="text-sm font-black mb-1">Pilih atau Taruh File PDF</Typography>
                                        <Typography variant="muted" className="text-[11px]">Upload laporan magang/kerja (Maks 10MB)</Typography>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-3 items-start">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <Typography className="text-[11px] font-black text-amber-600 uppercase tracking-wider">AI Note</Typography>
                            <Typography className="text-[11px] text-amber-600/80 leading-relaxed font-medium">
                                Data rahasia dan internal perusahaan akan otomatis diabaikan oleh AI. Sistem hanya akan mengekstrak aktivitas pengalaman kerja Anda.
                            </Typography>
                        </div>
                    </div>

                    {errors.file && (
                        <div className="text-destructive text-xs font-bold bg-destructive/10 p-3 rounded-xl border border-destructive/20">
                            {errors.file}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 pt-2">
                        <Button
                            type="submit"
                            disabled={processing || !data.file}
                            className="bg-foreground text-background hover:opacity-90 rounded-2xl h-12 font-black shadow-lg shadow-foreground/10 w-full relative overflow-hidden group"
                        >
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Memproses AI... (Hingga 1 menit)</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Jalankan Ekstraksi AI</span>
                                </div>
                            )}
                        </Button>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose} 
                            disabled={processing}
                            className="rounded-2xl h-11 font-bold text-xs"
                        >
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
