import DashboardLayout from '@/Layouts/DashboardLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Typography } from '@/Components/ui/Typography';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <DashboardLayout
            header={
                <Typography variant="large" className="font-bold">
                    Profile Settings
                </Typography>
            }
        >
            <Head title="Profile" />

            <div className="space-y-6">
                <div className="bg-white p-4 shadow-sm border rounded-2xl sm:p-8 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="bg-white p-4 shadow-sm border rounded-2xl sm:p-8 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="bg-white p-4 shadow-sm border rounded-2xl sm:p-8 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </DashboardLayout>
    );
}

