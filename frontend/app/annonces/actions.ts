'use server';

import { z } from 'zod';

const createListingSchema = z.object({
    category_id: z.string(),
    title: z.string().min(5).max(100),
    description: z.string().min(20),
    price: z.number().min(0),
    price_negotiable: z.boolean(),
    etat: z.enum(['NEUF', 'OCCASION', 'RECONDITIONNE']),
    city: z.string(),
    region: z.string(),
    quartier: z.string().optional(),
    address: z.string().optional(),
    photos: z.array(z.string().min(1)).min(1, "Au moins une photo est requise"),
    attributes: z.record(z.any()).optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;

export async function createListing(input: CreateListingInput) {
    // Mock simulation
    console.log("Mock creating listing:", input);

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response
    return {
        success: true,
        data: {
            id: 'mock-listing-' + Date.now(),
            ...input,
            slug: 'mock-slug-' + Date.now(),
            created_at: new Date().toISOString(),
            status: 'ACTIVE'
        }
    };
}
