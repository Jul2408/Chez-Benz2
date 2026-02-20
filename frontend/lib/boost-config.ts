export const BOOST_PRICING = {
    // Base prices per day (in FCFA)
    BASE_PRICE_PER_DAY: 500,

    // Category multipliers (some categories are more expensive)
    CATEGORY_MULTIPLIERS: {
        'vehicules': 2.0, // Cars are more expensive to boost
        'immobilier': 2.0, // Real estate is more expensive
        'default': 1.0,
    } as Record<string, number>,

    // Duration discounts (longer duration = lower daily rate)
    DURATION_DISCOUNTS: {
        3: 0,      // 0% discount for 3 days
        7: 0.10,   // 10% discount for 7 days
        14: 0.15,  // 15% discount for 14 days
        30: 0.25,  // 25% discount for 30 days
    } as Record<number, number>,

    // Available durations in days
    DURATIONS: [3, 7, 14, 30]
};

export const calculateBoostPrice = (categorySlug: string, days: number): number => {
    const basePrice = BOOST_PRICING.BASE_PRICE_PER_DAY;

    // Get multiplier (check main category slug)
    // Assuming simple logic for now: check if slug contains key words
    let multiplier = BOOST_PRICING.CATEGORY_MULTIPLIERS.default;

    if (categorySlug) {
        const slug = categorySlug.toLowerCase();
        if (slug.includes('voiture') || slug.includes('vehicule') || slug.includes('moto')) {
            multiplier = BOOST_PRICING.CATEGORY_MULTIPLIERS.vehicules;
        } else if (slug.includes('immo') || slug.includes('maison') || slug.includes('appartement')) {
            multiplier = BOOST_PRICING.CATEGORY_MULTIPLIERS.immobilier;
        }
    }

    // Calculate gross price
    const grossPrice = basePrice * multiplier * days;

    // Apply discount
    const discountPercent = BOOST_PRICING.DURATION_DISCOUNTS[days] || 0;
    const finalPrice = grossPrice * (1 - discountPercent);

    // Round to nearest 100 FCFA for clean pricing
    return Math.ceil(finalPrice / 100) * 100;
};
