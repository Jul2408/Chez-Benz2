'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimeAgoProps {
    date: string | Date;
    className?: string;
}

export function TimeAgo({ date, className }: TimeAgoProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <span className={className}>...</span>;
    }

    return (
        <span className={className} suppressHydrationWarning>
            {formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })}
        </span>
    );
}
