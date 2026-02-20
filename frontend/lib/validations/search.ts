import { z } from 'zod';
import { listingConfig } from '@/config/site';

export const searchParamsSchema = z.object({
    q: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(8).max(50).default(listingConfig.itemsPerPage || 12),
    category: z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    etat: z.array(z.string()).optional(), // Will need preprocessing from URL
    sort: z.enum(['date', 'price_asc', 'price_desc', 'views']).default('date'),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
