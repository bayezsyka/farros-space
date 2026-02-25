import React from 'react';
import { Button } from '@/Components/ui/Button';
import { Typography } from '@/Components/ui/Typography';

export const ContactForm = () => {
    return (
        <div className="max-w-md mx-auto space-y-6">
            <Typography variant="h3">Send a message</Typography>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Type your message here" />
                </div>
                <Button className="w-full">Send Message</Button>
            </div>
        </div>
    );
};
