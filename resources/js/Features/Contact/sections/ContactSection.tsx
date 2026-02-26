import React from 'react';
import { Container } from '@/Components/ui/Container';
import { Section } from '@/Components/ui/Section';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Mail, Phone, MapPin, GraduationCap, ExternalLink } from 'lucide-react';

interface ContactSectionProps {
    profile: {
        full_name?: string;
        email?: string;
        phone?: string;
        birth_place?: string;
        birth_date?: string;
    };
    education: any[];
}

export const ContactSection = ({ profile, education = [] }: ContactSectionProps) => {
    const whatsappLink = profile.phone ? `https://wa.me/${profile.phone.replace(/^0/, '62')}` : '#';

    return (
        <Section spacing="none" className="py-10 sm:py-16 md:py-20 lg:py-24">
            <Container className="px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start max-w-6xl mx-auto">
                    <div className="space-y-8 sm:space-y-12">
                        <div className="space-y-3 sm:space-y-4">
                            <Typography variant="h1" className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                                Get in Touch
                            </Typography>
                            <Typography variant="lead" className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                            </Typography>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <Card className="border-none bg-muted/30 shadow-none">
                                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <Typography variant="small" className="font-medium text-muted-foreground uppercase tracking-wider text-[10px] sm:text-xs">Email</Typography>
                                        <a href={`mailto:${profile.email}`} className="text-sm sm:text-lg font-semibold hover:text-primary transition-colors block break-all">
                                            {profile.email}
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none bg-muted/30 shadow-none">
                                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <Typography variant="small" className="font-medium text-muted-foreground uppercase tracking-wider text-[10px] sm:text-xs">Phone / WA</Typography>
                                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-lg font-semibold hover:text-primary transition-colors block">
                                            {profile.phone}
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 border-t">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <Typography variant="large" className="text-sm sm:text-base">Location Info</Typography>
                                    <Typography variant="p" className="mt-1 text-muted-foreground text-xs sm:text-sm">
                                        Born in {profile.birth_place}, {new Date(profile.birth_date || '').toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        <div className="bg-card border rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-sm">
                            <Typography variant="h3" className="mb-4 sm:mb-6 flex items-center gap-2 text-lg sm:text-xl">
                                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                Education
                            </Typography>
                            <div className="space-y-6 sm:space-y-8">
                                {education.map((edu, index) => (
                                    <div key={index} className="relative pl-5 sm:pl-6 border-l-2 border-primary/20 last:border-0 pb-2">
                                        <div className="absolute -left-[8px] sm:-left-[9px] top-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-background border-2 border-primary" />
                                        <div className="space-y-0.5 sm:space-y-1">
                                            <Typography variant="large" className="font-bold leading-tight text-sm sm:text-base">
                                                {edu.program_major}
                                            </Typography>
                                            <Typography variant="p" className="mt-0 font-medium opacity-80 text-xs sm:text-sm">
                                                {edu.institution}
                                            </Typography>
                                            <Typography variant="small" className="text-muted-foreground text-[11px] sm:text-xs">
                                                {edu.start_year} — {edu.end_year}
                                            </Typography>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-primary text-primary-foreground rounded-xl sm:rounded-2xl p-5 sm:p-8 space-y-3 sm:space-y-4">
                            <Typography variant="h4" className="text-white text-base sm:text-lg">Quick Message?</Typography>
                            <Typography variant="small" className="opacity-90 block text-[11px] sm:text-sm">
                                Preferred method of contact is via WhatsApp or Email for faster response.
                            </Typography>
                            <div className="flex gap-3 sm:gap-4 pt-2 sm:pt-4">
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full">
                                    <Button variant="secondary" className="w-full gap-2 text-xs sm:text-sm">
                                        Chat on WA <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
