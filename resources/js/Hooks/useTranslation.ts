import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function useTranslation() {
    const { translations } = usePage<PageProps>().props;

    const translate = (key: string, replacements: Record<string, string> = {}) => {
        let translation = (translations && translations[key]) || key;

        Object.keys(replacements).forEach((replacementKey) => {
            translation = String(translation).replace(
                `:${replacementKey}`,
                replacements[replacementKey]
            );
        });

        return translation;
    };

    return { __: translate };
}
