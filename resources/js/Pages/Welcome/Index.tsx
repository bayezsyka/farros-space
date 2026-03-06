import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { HeroSection } from '@/Features/Home/sections/HeroSection';
import { ThreadFeedSection } from '@/Features/Threads/sections/ThreadFeedSection';

interface Props {
    profile: any;
    education: any[];
    latestThreads: any[];
    publicThreads: any[];
}

export default function Index({ profile, latestThreads, publicThreads }: Props) {
    return (
        <AppLayout title="Home" overlayHeader={true}>
            <HeroSection profile={profile} />
            <ThreadFeedSection
                threads={latestThreads}
                publicThreads={publicThreads}
                profile={profile}
            />
        </AppLayout>
    );
}
