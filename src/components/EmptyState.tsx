'use client';

import { VideoIcon, CheckCircle2Icon, XCircleIcon } from 'lucide-react';

interface Props {
    title: string;
    description: string;
    state?: 'upcoming' | 'processing' | 'cancelled';
}

const ICONS = {
    upcoming: VideoIcon,
    processing: CheckCircle2Icon,
    cancelled: XCircleIcon,
};

const EmptyState = ({ title, description, state }: Props) => {
    const IconComponent = state ? ICONS[state] : null;

    return (
        <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
            {/* Card Preview */}
            <div className="relative w-[260px] sm:w-[300px] md:w-[360px] h-[120px] bg-white shadow-xl rounded-xl overflow-hidden animate-pulse mb-6">
                <div className="absolute inset-0 flex flex-col gap-2 p-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                        {IconComponent && (
                            <IconComponent className="text-[#38bdf8] w-8 h-8" />
                        )}
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="w-3/4 h-4 rounded bg-[#38bdf8]" />
                        <div className="w-2/3 h-3 rounded bg-[#38bdf8]/50" />
                    </div>
                </div>
            </div>

            {/* Text Content */}
            <div className="max-w-md mx-auto">
                <h6 className="text-lg font-semibold">{title}</h6>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
};

export default EmptyState;
