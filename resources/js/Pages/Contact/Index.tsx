import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { ContactSection } from '@/Features/Contact/sections/ContactSection';

interface Props {
    profile: any;
    education: any[];
}

export default function Index({ profile, education }: Props) {
    return (
        <AppLayout title="Contact — Farros Space">
            <ContactSection profile={profile} education={education} />
        </AppLayout>
    );
}
