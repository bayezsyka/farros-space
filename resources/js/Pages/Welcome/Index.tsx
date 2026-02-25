import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { HeroSection } from '@/Features/Home/sections/HeroSection';
import { ThreadFeedSection } from '@/Features/Threads/sections/ThreadFeedSection';

interface Props {
    profile: any;
    education: any[];
    latestThreads: any[];
}

export default function Index({ profile, latestThreads }: Props) {
    return (
        <AppLayout title="Farros Space">
            <HeroSection profile={profile} />
            <ThreadFeedSection threads={latestThreads} profile={profile} />
        </AppLayout>
    );
}
