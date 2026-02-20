import { Category } from '@/types';

export type CreateListingStep = 'CATEGORY' | 'DETAILS' | 'PHOTOS' | 'LOCATION' | 'REVIEW';

export interface CreateListingState {
    step: CreateListingStep;
    // Category Data
    categoryId: string | null;
    categoryPath: Category[]; // To show breadcrumb of selection

    // Details Data
    title: string;
    description: string;
    price: string; // string for input handling, convert to number later
    priceNegotiable: boolean;
    hidePrice: boolean; // "Sur demande"
    etat: 'NEUF' | 'OCCASION' | 'RECONDITIONNE';

    // Location Data
    region: string;
    city: string;
    quartier: string;
    address: string;

    // Photos
    images: {
        file?: File;
        previewUrl: string;
        uploadUrl?: string; // Once uploaded
        uploading: boolean;
        error?: string;
    }[];

    // Attributes (Dynamic per category)
    attributes: Record<string, any>;

    // Submission
    isSubmitting: boolean;
    error: string | null;

    // Edit mode
    isEditing?: boolean;
    id?: string;
}

export const INITIAL_STATE: CreateListingState = {
    step: 'CATEGORY',
    categoryId: null,
    categoryPath: [],
    title: '',
    description: '',
    price: '',
    priceNegotiable: false,
    hidePrice: false,
    etat: 'OCCASION',
    region: '',
    city: '',
    quartier: '',
    address: '',
    images: [],
    attributes: {},
    isSubmitting: false,
    error: null,
};
