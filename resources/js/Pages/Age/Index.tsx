import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Container } from '@/Components/ui/Container';
import { Card } from '@/Components/ui/Card';
import {
    intervalToDuration,
    differenceInYears,
    differenceInMonths,
    differenceInWeeks,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
    format
} from 'date-fns';
import { id } from 'date-fns/locale';
import {
    CalendarDays,
    Clock3,
    Timer,
    Hourglass,
    Sparkles,
    RotateCcw,
    Moon,
    SunMedium,
    X,
    Maximize2
} from 'lucide-react';

export default function AgeIndex() {
    const defaultBirthDate = new Date(2005, 11, 13);
    const [birthDate, setBirthDate] = useState<Date>(defaultBirthDate);
    const [now, setNow] = useState<Date>(new Date());
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const duration = useMemo(() => {
        return intervalToDuration({ start: birthDate, end: now });
    }, [birthDate, now]);

    const stats = useMemo(() => {
        return {
            years: differenceInYears(now, birthDate),
            months: differenceInMonths(now, birthDate),
            weeks: differenceInWeeks(now, birthDate),
            days: differenceInDays(now, birthDate),
            hours: differenceInHours(now, birthDate),
            minutes: differenceInMinutes(now, birthDate),
            seconds: differenceInSeconds(now, birthDate),
        };
    }, [birthDate, now]);

    const quickStats = useMemo(() => {
        return [
            {
                label: 'Minggu Penuh',
                value: Math.floor(stats.days / 7).toLocaleString('id-ID'),
                icon: CalendarDays,
            },
            {
                label: 'Bulan Penuh',
                value: Math.floor(stats.days / 30).toLocaleString('id-ID'),
                icon: Moon,
            },
            {
                label: 'Musim Dilewati',
                value: Math.floor((stats.days / 365.25) * 12).toLocaleString('id-ID'),
                icon: SunMedium,
            },
            {
                label: 'Dekade',
                value: (stats.years / 10).toFixed(1),
                icon: Sparkles,
            },
        ];
    }, [stats.days, stats.years]);

    const breakdown = useMemo(() => {
        return [
            { label: 'Tahun', value: stats.years.toLocaleString('id-ID'), icon: Hourglass },
            { label: 'Bulan', value: stats.months.toLocaleString('id-ID'), icon: CalendarDays },
            { label: 'Minggu', value: stats.weeks.toLocaleString('id-ID'), icon: Timer },
            { label: 'Hari', value: stats.days.toLocaleString('id-ID'), icon: Clock3 },
            { label: 'Jam', value: stats.hours.toLocaleString('id-ID'), icon: Clock3 },
            { label: 'Menit', value: stats.minutes.toLocaleString('id-ID'), icon: Timer },
            { label: 'Detik', value: stats.seconds.toLocaleString('id-ID'), icon: Sparkles },
            { label: 'Dekade', value: (stats.years / 10).toFixed(1), icon: Hourglass },
        ];
    }, [stats]);

    return (
        <AppLayout title="Usia Saya">
            <Head>
                <meta
                    name="description"
                    content="Halaman personal untuk melihat usia saya secara real-time dalam berbagai satuan waktu."
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-12">
                <Container>
                    <div className="mx-auto max-w-5xl space-y-8">
                        {/* Hero */}
                        <Card className="overflow-hidden border border-gray-200 bg-white/90 shadow-sm backdrop-blur-sm">
                            <div className="relative p-8 md:p-10">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,0,0,0.04),_transparent_35%)]" />

                                <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600">
                                            <CalendarDays className="h-3.5 w-3.5 text-gray-500" />
                                            Personal age tracker
                                        </div>

                                        <div className="space-y-2">
                                            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
                                                Usia Saya
                                            </h1>
                                        </div>

                                        <div
                                            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm cursor-pointer hover:bg-muted/30 transition-colors group"
                                            onClick={() => setPreviewImage('/images/hero-foto-saya.png')}
                                        >
                                            <CalendarDays className="h-4 w-4 text-gray-500" />
                                            Lahir pada <span className="font-medium">13 Desember 2005</span>
                                            <Maximize2 className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Image Preview Modal */}
                        {previewImage && (
                            <div
                                className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
                                onClick={() => setPreviewImage(null)}
                            >
                                <button
                                    className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
                                    onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
                                >
                                    <X className="w-7 h-7" />
                                </button>
                                <img
                                    src={previewImage}
                                    className="max-w-[95vw] max-h-[90vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500"
                                    alt="Full size preview"
                                    draggable={false}
                                />
                            </div>
                        )}

                        {/* Main Age Card */}
                        <Card className="border border-gray-200 bg-white shadow-sm">
                            <div className="p-8 md:p-10">
                                <div className="mb-8 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100">
                                        <Hourglass className="h-5 w-5 text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                                            Usia Saat Ini
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Dihitung langsung hingga detik ini
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    {[
                                        { label: 'Tahun', value: duration.years ?? 0 },
                                        { label: 'Bulan', value: duration.months ?? 0 },
                                        { label: 'Hari', value: duration.days ?? 0 },
                                        { label: 'Jam', value: duration.hours ?? 0 },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-6 text-center"
                                        >
                                            <div className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
                                                {item.value}
                                            </div>
                                            <div className="mt-2 text-xs uppercase tracking-wider text-gray-400">
                                                {item.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-gray-100 pt-6 text-sm text-gray-500">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1">
                                        <Timer className="h-4 w-4 text-gray-500" />
                                        {duration.minutes ?? 0} menit
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1">
                                        <Clock3 className="h-4 w-4 text-gray-500" />
                                        {duration.seconds ?? 0} detik
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Breakdown */}
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-800">Dalam satuan waktu</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Ringkasan umur saya dalam berbagai skala.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                {breakdown.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Card
                                            key={item.label}
                                            className="border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5"
                                        >
                                            <div className="p-5">
                                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100">
                                                    <Icon className="h-5 w-5 text-gray-700" />
                                                </div>
                                                <div className="text-xs uppercase tracking-wider text-gray-400">
                                                    {item.label}
                                                </div>
                                                <div className="mt-1 text-2xl font-semibold tracking-tight text-gray-950">
                                                    {item.value}
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-800">Catatan kecil</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Beberapa angka menarik dari perjalanan waktu saya.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                {quickStats.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Card
                                            key={item.label}
                                            className="border border-gray-200 bg-white shadow-sm"
                                        >
                                            <div className="p-5 text-center">
                                                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100">
                                                    <Icon className="h-5 w-5 text-gray-700" />
                                                </div>
                                                <div className="text-2xl font-semibold tracking-tight text-gray-950">
                                                    {item.value}
                                                </div>
                                                <div className="mt-2 text-xs uppercase tracking-wider text-gray-400">
                                                    {item.label}
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer time */}
                        <div className="pt-2 text-center">
                            <p className="text-sm text-gray-400">
                                {format(now, 'EEEE, d MMMM yyyy • HH:mm:ss', { locale: id })}
                            </p>
                        </div>
                    </div>
                </Container>
            </div>
        </AppLayout>
    );
}