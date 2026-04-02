import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
import { createBreadcrumbJsonLd } from '@/lib/structuredData';
import useTranslation from '@/Hooks/useTranslation';
import { ContactSection } from '@/Features/Contact/sections/ContactSection';

interface Props {
    profile: any;
    education: any[];
}

export default function Index({ profile, education }: Props) {
    const { __ } = useTranslation();
    
    return (
        <AppLayout title={__('Contact')}>
            <SeoHead 
                title={__('Contact — Get in Touch')}
                description={__('Feel free to reach out for collaborations, inquiries, or just to say hello.')}
                canonicalPath="contact"
                jsonLd={createBreadcrumbJsonLd([{ name: __('Contact'), url: route('contact') }])}
            />
            <ContactSection profile={profile} education={education} />
        </AppLayout>
    );
}
