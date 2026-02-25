import React from 'react';
import { Container } from '@/Components/ui/Container';
import { Section } from '@/Components/ui/Section';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';
import { Link } from '@inertiajs/react';
import { Mail, Phone } from 'lucide-react';

interface HeroSectionProps {
    profile: {
        full_name?: string;
        headline?: string;
        email?: string;
        phone?: string;
    };
}

export const HeroSection = ({ profile }: HeroSectionProps) => {
    return (
        <Section spacing="xl" className="bg-muted/30 border-b">
            <Container className="flex flex-col items-center text-center space-y-8">
                <div className="space-y-4">
                    <Typography variant="h1" className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        {profile.full_name || 'Farros Space'}
                    </Typography>
                    <Typography variant="lead" className="max-w-[700px] mx-auto text-muted-foreground">
                        {profile.headline || 'Welcome to my digital space.'}
                    </Typography>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                    {profile.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{profile.email}</span>
                        </div>
                    )}
                    {profile.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{profile.phone}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/contact">
                        <Button size="lg" className="rounded-full px-8">
                            Get in Touch
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="rounded-full px-8" onClick={() => document.getElementById('threads-feed')?.scrollIntoView({ behavior: 'smooth' })}>
                        Read Threads
                    </Button>
                </div>
            </Container>
        </Section>
    );
};
