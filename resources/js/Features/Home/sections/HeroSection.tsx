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
        <Section spacing="none" className="bg-muted/30 border-b py-16 sm:py-20 md:py-28 lg:py-32">
            <Container className="flex flex-col items-center text-center space-y-6 sm:space-y-8 px-6">
                <div className="space-y-3 sm:space-y-4">
                    <Typography variant="h1" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                        {profile.full_name || 'Farros Space'}
                    </Typography>
                    <Typography variant="lead" className="max-w-[600px] lg:max-w-[700px] mx-auto text-muted-foreground text-sm sm:text-base md:text-lg">
                        {profile.headline || 'Welcome to my digital space.'}
                    </Typography>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                    {profile.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="truncate max-w-[200px] sm:max-w-none">{profile.email}</span>
                        </div>
                    )}
                    {profile.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{profile.phone}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <Link href="/contact" className="w-full sm:w-auto">
                        <Button size="lg" className="rounded-full px-8 w-full sm:w-auto">
                            Get in Touch
                        </Button>
                    </Link>
                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="rounded-full px-8 w-full sm:w-auto" 
                        onClick={() => document.getElementById('threads-feed')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Read Threads
                    </Button>
                </div>
            </Container>
        </Section>
    );
};
