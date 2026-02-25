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
        <Section spacing="lg">
            <Container>
                <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <Typography variant="h1" className="text-4xl font-bold tracking-tight">
                                Get in Touch
                            </Typography>
                            <Typography variant="lead" className="text-muted-foreground">
                                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                            </Typography>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <Card className="border-none bg-muted/30 shadow-none">
                                <CardContent className="p-6 space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <Typography variant="small" className="font-medium text-muted-foreground uppercase tracking-wider">Email</Typography>
                                        <a href={`mailto:${profile.email}`} className="text-lg font-semibold hover:text-primary transition-colors block break-all">
                                            {profile.email}
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none bg-muted/30 shadow-none">
                                <CardContent className="p-6 space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <Typography variant="small" className="font-medium text-muted-foreground uppercase tracking-wider">Phone / WA</Typography>
                                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:text-primary transition-colors block">
                                            {profile.phone}
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6 pt-6 border-t">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-primary mt-1" />
                                <div>
                                    <Typography variant="large">Location Info</Typography>
                                    <Typography variant="p" className="mt-1 text-muted-foreground">
                                        Born in {profile.birth_place}, {new Date(profile.birth_date || '').toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-card border rounded-2xl p-8 shadow-sm">
                            <Typography variant="h3" className="mb-6 flex items-center gap-2">
                                <GraduationCap className="w-6 h-6 text-primary" />
                                Education
                            </Typography>
                            <div className="space-y-8">
                                {education.map((edu, index) => (
                                    <div key={index} className="relative pl-6 border-l-2 border-primary/20 last:border-0 pb-2">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                                        <div className="space-y-1">
                                            <Typography variant="large" className="font-bold leading-tight">
                                                {edu.program_major}
                                            </Typography>
                                            <Typography variant="p" className="mt-0 font-medium opacity-80">
                                                {edu.institution}
                                            </Typography>
                                            <Typography variant="small" className="text-muted-foreground">
                                                {edu.start_year} — {edu.end_year}
                                            </Typography>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-primary text-primary-foreground rounded-2xl p-8 space-y-4">
                            <Typography variant="h4" className="text-white">Quick Message?</Typography>
                            <Typography variant="small" className="opacity-90 block">
                                Preferred method of contact is via WhatsApp or Email for faster response.
                            </Typography>
                            <div className="flex gap-4 pt-4">
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full">
                                    <Button variant="secondary" className="w-full gap-2">
                                        Chat on WA <ExternalLink className="w-4 h-4" />
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
