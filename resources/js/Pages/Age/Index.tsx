import React, { useState, useEffect, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
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
import { id, enUS } from 'date-fns/locale';
import {
    CalendarDays,
    Clock3,
    Timer,
    Hourglass,
    Sparkles,
    RotateCcw,
    Moon,
    SunMedium,
    X
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { PageProps } from '@/types';

export default function AgeIndex() {
    const { __ } = useTranslation();
    const { locale } = usePage<PageProps>().props;
    const dateLocale = locale === 'en' ? enUS : id;
    const numberLocale = locale === 'en' ? 'en-US' : 'id-ID';

    const defaultBirthDate = new Date(2005, 11, 13);
    const [birthDate, setBirthDate] = useState<Date>(defaultBirthDate);
    const [now, setNow] = useState<Date>(new Date());

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
                label: __('age.stats.full_weeks'),
                value: Math.floor(stats.days / 7).toLocaleString(numberLocale),
                icon: CalendarDays,
            },
            {
                label: __('age.stats.full_months'),
                value: Math.floor(stats.days / 30).toLocaleString(numberLocale),
                icon: Moon,
            },
            {
                label: __('age.stats.seasons_passed'),
                value: Math.floor((stats.days / 365.25) * 12).toLocaleString(numberLocale),
                icon: SunMedium,
            },
            {
                label: __('age.stats.decades'),
                value: (stats.years / 10).toFixed(1),
                icon: Sparkles,
            },
        ];
    }, [stats.days, stats.years, numberLocale, __]);

    const breakdown = useMemo(() => {
        return [
            { label: __('age.time.years'), value: stats.years.toLocaleString(numberLocale), icon: Hourglass },
            { label: __('age.time.months'), value: stats.months.toLocaleString(numberLocale), icon: CalendarDays },
            { label: __('age.time.weeks'), value: stats.weeks.toLocaleString(numberLocale), icon: Timer },
            { label: __('age.time.days'), value: stats.days.toLocaleString(numberLocale), icon: Clock3 },
            { label: __('age.time.hours'), value: stats.hours.toLocaleString(numberLocale), icon: Clock3 },
            { label: __('age.time.minutes'), value: stats.minutes.toLocaleString(numberLocale), icon: Timer },
            { label: __('age.time.seconds'), value: stats.seconds.toLocaleString(numberLocale), icon: Sparkles },
            { label: __('age.time.decades'), value: (stats.years / 10).toFixed(1), icon: Hourglass },
        ];
    }, [stats, numberLocale, __]);

    return (
        <AppLayout title={__('age.title')}>
            <Head>
                <meta
                    name="description"
                    content={__('age.meta_description')}
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
                                            {__('age.hero.badge')}
                                        </div>

                                        <div className="space-y-2">
                                            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
                                                {__('age.title')}
                                            </h1>
                                        </div>

                                        <div
                                            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-colors group"
                                        >
                                            <CalendarDays className="h-4 w-4 text-gray-500" />
                                            {__('age.hero.born_at')} <span className="font-medium">{format(birthDate, 'd MMMM yyyy', { locale: dateLocale })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>



                        {/* Main Age Card */}
                        <Card className="border border-gray-200 bg-white shadow-sm">
                            <div className="p-8 md:p-10">
                                <div className="mb-8 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100">
                                        <Hourglass className="h-5 w-5 text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                                            {__('age.current.title')}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {__('age.current.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    {[
                                        { label: __('age.time.years'), value: duration.years ?? 0 },
                                        { label: __('age.time.months'), value: duration.months ?? 0 },
                                        { label: __('age.time.days'), value: duration.days ?? 0 },
                                        { label: __('age.time.hours'), value: duration.hours ?? 0 },
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
                                        {duration.minutes ?? 0} {__('age.time.minutes').toLowerCase()}
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1">
                                        <Clock3 className="h-4 w-4 text-gray-500" />
                                        {duration.seconds ?? 0} {__('age.time.seconds').toLowerCase()}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Breakdown */}
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-800">{__('age.breakdown.title')}</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {__('age.breakdown.subtitle')}
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
                                <h2 className="text-sm font-semibold text-gray-800">{__('age.notes.title')}</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {__('age.notes.subtitle')}
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
                                {format(now, 'EEEE, d MMMM yyyy • HH:mm:ss', { locale: dateLocale })}
                            </p>
                        </div>
                    </div>
                </Container>
            </div>
        </AppLayout>
    );
}