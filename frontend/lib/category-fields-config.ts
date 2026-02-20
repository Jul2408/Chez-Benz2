/**
 * Configuration des champs dynamiques par catégorie
 * Définit les champs spécifiques à afficher pour chaque type de catégorie
 */

export type FieldType = 'text' | 'number' | 'select' | 'boolean' | 'textarea' | 'date';

export interface CategoryField {
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
    options?: string[] | { value: string; label: string }[];
    min?: number;
    max?: number;
    unit?: string;
    description?: string;
}

export interface CategoryFieldsConfig {
    fields: CategoryField[];
    icon?: string;
    color?: string;
}

/**
 * Configuration des champs par catégorie (slug de la catégorie parente)
 */
export const CATEGORY_FIELDS_CONFIG: Record<string, CategoryFieldsConfig> = {
    // ============================================
    // IMMOBILIER
    // ============================================
    'immobilier': {
        icon: 'Home',
        color: '#10B981',
        fields: [
            {
                name: 'type_bien', label: 'Type de bien', type: 'select', required: true, options: [
                    { value: 'APPARTEMENT', label: 'Appartement' },
                    { value: 'MAISON', label: 'Maison / Villa' },
                    { value: 'STUDIO', label: 'Studio' },
                    { value: 'DUPLEX', label: 'Duplex' },
                    { value: 'TERRAIN', label: 'Terrain' },
                    { value: 'BUREAU', label: 'Bureau' },
                    { value: 'COMMERCE', label: 'Local commercial' },
                    { value: 'ENTREPOT', label: 'Entrepôt' },
                ]
            },
            { name: 'surface', label: 'Surface', type: 'number', required: true, unit: 'm²', min: 1, placeholder: 'Ex: 120' },
            { name: 'pieces', label: 'Nombre de pièces', type: 'number', required: true, min: 1, placeholder: 'Ex: 4' },
            { name: 'chambres', label: 'Chambres', type: 'number', required: true, min: 0, placeholder: 'Ex: 2' },
            { name: 'salles_bain', label: 'Salles de bain', type: 'number', min: 0, placeholder: 'Ex: 1' },
            { name: 'etage', label: 'Étage', type: 'number', min: 0, placeholder: 'Ex: 3' },
            { name: 'meuble', label: 'Meublé', type: 'boolean' },
            { name: 'ascenseur', label: 'Ascenseur', type: 'boolean' },
            { name: 'parking', label: 'Parking', type: 'boolean' },
            { name: 'jardin', label: 'Jardin', type: 'boolean' },
            { name: 'piscine', label: 'Piscine', type: 'boolean' },
            { name: 'climatisation', label: 'Climatisation', type: 'boolean' },
            { name: 'securite', label: 'Gardiennage/Sécurité', type: 'boolean' },
        ]
    },

    // ============================================
    // VÉHICULES
    // ============================================
    'vehicules': {
        icon: 'Car',
        color: '#EF4444',
        fields: [
            { name: 'marque', label: 'Marque', type: 'text', required: true, placeholder: 'Ex: Toyota' },
            { name: 'modele', label: 'Modèle', type: 'text', required: true, placeholder: 'Ex: Camry' },
            { name: 'annee', label: 'Année', type: 'number', required: true, min: 1950, max: new Date().getFullYear() + 1, placeholder: 'Ex: 2018' },
            { name: 'kilometrage', label: 'Kilométrage', type: 'number', required: true, unit: 'km', min: 0, placeholder: 'Ex: 85000' },
            {
                name: 'carburant', label: 'Carburant', type: 'select', required: true, options: [
                    { value: 'ESSENCE', label: 'Essence' },
                    { value: 'DIESEL', label: 'Diesel' },
                    { value: 'HYBRIDE', label: 'Hybride' },
                    { value: 'ELECTRIQUE', label: 'Électrique' },
                    { value: 'GPL', label: 'GPL' },
                ]
            },
            {
                name: 'transmission', label: 'Transmission', type: 'select', required: true, options: [
                    { value: 'MANUELLE', label: 'Manuelle' },
                    { value: 'AUTOMATIQUE', label: 'Automatique' },
                    { value: 'SEMI_AUTO', label: 'Semi-automatique' },
                ]
            },
            { name: 'couleur', label: 'Couleur', type: 'text', placeholder: 'Ex: Noir' },
            { name: 'nombre_portes', label: 'Nombre de portes', type: 'number', min: 2, max: 5 },
            { name: 'nombre_places', label: 'Nombre de places', type: 'number', min: 2, max: 9 },
            { name: 'climatisation', label: 'Climatisation', type: 'boolean' },
            { name: 'premiere_main', label: 'Première main', type: 'boolean' },
            { name: 'visite_technique', label: 'Visite technique à jour', type: 'boolean' },
            { name: 'assurance', label: 'Assurance à jour', type: 'boolean' },
        ]
    },

    // ============================================
    // ÉLECTRONIQUE
    // ============================================
    'electronique': {
        icon: 'Smartphone',
        color: '#3B82F6',
        fields: [
            { name: 'marque', label: 'Marque', type: 'text', required: true, placeholder: 'Ex: Samsung' },
            { name: 'modele', label: 'Modèle', type: 'text', placeholder: 'Ex: Galaxy S21' },
            {
                name: 'stockage', label: 'Stockage', type: 'select', options: [
                    '16 Go', '32 Go', '64 Go', '128 Go', '256 Go', '512 Go', '1 To', '2 To'
                ]
            },
            {
                name: 'ram', label: 'RAM', type: 'select', options: [
                    '2 Go', '4 Go', '6 Go', '8 Go', '12 Go', '16 Go', '32 Go', '64 Go'
                ]
            },
            { name: 'couleur', label: 'Couleur', type: 'text', placeholder: 'Ex: Noir' },
            { name: 'garantie', label: 'Sous garantie', type: 'boolean' },
            { name: 'duree_garantie', label: 'Durée garantie restante', type: 'number', unit: 'mois', min: 0 },
            { name: 'accessoires_inclus', label: 'Accessoires inclus', type: 'textarea', placeholder: 'Ex: Chargeur, écouteurs, étui...' },
        ]
    },

    // ============================================
    // ÉLECTROMÉNAGER
    // ============================================
    'electromenager': {
        icon: 'Refrigerator',
        color: '#F59E0B',
        fields: [
            { name: 'marque', label: 'Marque', type: 'text', required: true, placeholder: 'Ex: LG' },
            { name: 'modele', label: 'Modèle', type: 'text', placeholder: 'Ex: GR-X257' },
            { name: 'capacite', label: 'Capacité', type: 'text', placeholder: 'Ex: 350L, 7kg, etc.' },
            {
                name: 'consommation', label: 'Classe énergétique', type: 'select', options: [
                    'A+++', 'A++', 'A+', 'A', 'B', 'C', 'D'
                ]
            },
            { name: 'couleur', label: 'Couleur', type: 'text', placeholder: 'Ex: Blanc' },
            { name: 'garantie', label: 'Sous garantie', type: 'boolean' },
            { name: 'duree_garantie', label: 'Durée garantie restante', type: 'number', unit: 'mois', min: 0 },
            { name: 'facture_disponible', label: 'Facture disponible', type: 'boolean' },
        ]
    },

    // ============================================
    // EMPLOI & SERVICES
    // ============================================
    'emploi-services': {
        icon: 'Briefcase',
        color: '#8B5CF6',
        fields: [
            {
                name: 'type_contrat', label: 'Type de contrat', type: 'select', options: [
                    { value: 'CDI', label: 'CDI - Contrat à Durée Indéterminée' },
                    { value: 'CDD', label: 'CDD - Contrat à Durée Déterminée' },
                    { value: 'STAGE', label: 'Stage' },
                    { value: 'FREELANCE', label: 'Freelance / Indépendant' },
                    { value: 'INTERIM', label: 'Intérim' },
                    { value: 'APPRENTISSAGE', label: 'Apprentissage' },
                ]
            },
            { name: 'experience_requise', label: 'Expérience requise', type: 'number', unit: 'années', min: 0, placeholder: 'Ex: 3' },
            {
                name: 'niveau_etude', label: 'Niveau d\'études', type: 'select', options: [
                    { value: 'AUCUN', label: 'Aucun diplôme requis' },
                    { value: 'BEPC', label: 'BEPC' },
                    { value: 'BAC', label: 'Baccalauréat' },
                    { value: 'BAC_2', label: 'Bac+2 (BTS, DUT)' },
                    { value: 'BAC_3', label: 'Bac+3 (Licence)' },
                    { value: 'BAC_5', label: 'Bac+5 (Master)' },
                    { value: 'DOCTORAT', label: 'Doctorat' },
                ]
            },
            { name: 'salaire_min', label: 'Salaire minimum', type: 'number', unit: 'FCFA', min: 0, placeholder: 'Ex: 150000' },
            { name: 'salaire_max', label: 'Salaire maximum', type: 'number', unit: 'FCFA', min: 0, placeholder: 'Ex: 300000' },
            { name: 'teletravail', label: 'Télétravail possible', type: 'boolean' },
            { name: 'secteur', label: 'Secteur d\'activité', type: 'text', placeholder: 'Ex: Informatique, Commerce, etc.' },
            { name: 'competences', label: 'Compétences requises', type: 'textarea', placeholder: 'Listez les compétences nécessaires...' },
        ]
    },

    // ============================================
    // MODE & BEAUTÉ
    // ============================================
    'mode-beaute': {
        icon: 'Shirt',
        color: '#EC4899',
        fields: [
            { name: 'marque', label: 'Marque', type: 'text', placeholder: 'Ex: Nike' },
            {
                name: 'taille', label: 'Taille', type: 'select', options: [
                    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
                    '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'
                ]
            },
            { name: 'couleur', label: 'Couleur', type: 'text', placeholder: 'Ex: Bleu' },
            { name: 'matiere', label: 'Matière', type: 'text', placeholder: 'Ex: Coton, Cuir, etc.' },
            {
                name: 'genre', label: 'Genre', type: 'select', options: [
                    { value: 'HOMME', label: 'Homme' },
                    { value: 'FEMME', label: 'Femme' },
                    { value: 'ENFANT', label: 'Enfant' },
                    { value: 'UNISEXE', label: 'Unisexe' },
                ]
            },
            { name: 'etiquette_presente', label: 'Étiquette présente', type: 'boolean' },
        ]
    },

    // ============================================
    // MAISON & JARDIN
    // ============================================
    'maison-jardin': {
        icon: 'Sofa',
        color: '#F59E0B',
        fields: [
            { name: 'marque', label: 'Marque', type: 'text', placeholder: 'Ex: IKEA' },
            { name: 'dimensions', label: 'Dimensions', type: 'text', placeholder: 'Ex: 200x150x80 cm' },
            { name: 'couleur', label: 'Couleur', type: 'text', placeholder: 'Ex: Beige' },
            { name: 'matiere', label: 'Matière', type: 'text', placeholder: 'Ex: Bois, Tissu, Métal...' },
            { name: 'livraison_possible', label: 'Livraison possible', type: 'boolean' },
            { name: 'montage_possible', label: 'Montage possible', type: 'boolean' },
        ]
    },

    // ============================================
    // ANIMAUX
    // ============================================
    'animaux': {
        icon: 'Dog',
        color: '#84CC16',
        fields: [
            { name: 'race', label: 'Race', type: 'text', placeholder: 'Ex: Berger Allemand' },
            { name: 'age', label: 'Âge', type: 'number', unit: 'mois', min: 0, placeholder: 'Ex: 6' },
            {
                name: 'sexe', label: 'Sexe', type: 'select', options: [
                    { value: 'MALE', label: 'Mâle' },
                    { value: 'FEMELLE', label: 'Femelle' },
                ]
            },
            { name: 'vaccine', label: 'Vacciné', type: 'boolean' },
            { name: 'puce', label: 'Pucé', type: 'boolean' },
            { name: 'pedigree', label: 'Pedigree', type: 'boolean' },
            { name: 'sterilise', label: 'Stérilisé', type: 'boolean' },
        ]
    },

    // ============================================
    // AGRICULTURE
    // ============================================
    'agriculture': {
        icon: 'Tractor',
        color: '#65A30D',
        fields: [
            {
                name: 'type_produit', label: 'Type de produit', type: 'select', options: [
                    { value: 'MATERIEL', label: 'Matériel agricole' },
                    { value: 'SEMENCE', label: 'Semences' },
                    { value: 'PLANT', label: 'Plants' },
                    { value: 'ANIMAL', label: 'Animal' },
                    { value: 'PRODUIT', label: 'Produit agricole' },
                ]
            },
            { name: 'marque', label: 'Marque', type: 'text', placeholder: 'Ex: John Deere' },
            { name: 'annee', label: 'Année', type: 'number', min: 1950, placeholder: 'Ex: 2015' },
            { name: 'heures_utilisation', label: 'Heures d\'utilisation', type: 'number', unit: 'heures', min: 0 },
            { name: 'quantite', label: 'Quantité disponible', type: 'number', min: 1, placeholder: 'Ex: 100' },
            {
                name: 'unite', label: 'Unité', type: 'select', options: [
                    'kg', 'tonnes', 'litres', 'sacs', 'unités', 'hectares'
                ]
            },
        ]
    },

    // ============================================
    // CONSTRUCTION & MATÉRIAUX
    // ============================================
    'construction-materiaux': {
        icon: 'HardHat',
        color: '#78716C',
        fields: [
            { name: 'type_materiau', label: 'Type de matériau', type: 'text', required: true, placeholder: 'Ex: Ciment, Fer, Bois...' },
            { name: 'marque', label: 'Marque', type: 'text', placeholder: 'Ex: Cimencam' },
            { name: 'quantite', label: 'Quantité disponible', type: 'number', min: 1, placeholder: 'Ex: 50' },
            {
                name: 'unite', label: 'Unité', type: 'select', options: [
                    'sacs', 'tonnes', 'mètres', 'm²', 'm³', 'pièces', 'cartons'
                ]
            },
            { name: 'dimensions', label: 'Dimensions', type: 'text', placeholder: 'Ex: 2.5m x 1.2m' },
            { name: 'livraison_possible', label: 'Livraison possible', type: 'boolean' },
        ]
    },

    // ============================================
    // ÉNERGIE & ENVIRONNEMENT
    // ============================================
    'energie-environnement': {
        icon: 'Zap',
        color: '#EAB308',
        fields: [
            {
                name: 'type_equipement', label: 'Type d\'équipement', type: 'select', required: true, options: [
                    { value: 'PANNEAU_SOLAIRE', label: 'Panneau solaire' },
                    { value: 'GENERATEUR', label: 'Générateur' },
                    { value: 'BATTERIE', label: 'Batterie' },
                    { value: 'ONDULEUR', label: 'Onduleur' },
                    { value: 'EOLIENNE', label: 'Éolienne' },
                ]
            },
            { name: 'marque', label: 'Marque', type: 'text', placeholder: 'Ex: Victron' },
            { name: 'puissance', label: 'Puissance', type: 'number', unit: 'W/kW', min: 0, placeholder: 'Ex: 5000' },
            { name: 'capacite', label: 'Capacité', type: 'text', placeholder: 'Ex: 200Ah, 10kWh' },
            { name: 'garantie', label: 'Sous garantie', type: 'boolean' },
            { name: 'installation_incluse', label: 'Installation incluse', type: 'boolean' },
        ]
    },

    // ============================================
    // ÉDUCATION & FORMATION
    // ============================================
    'education-formation': {
        icon: 'GraduationCap',
        color: '#7C3AED',
        fields: [
            {
                name: 'type_formation', label: 'Type de formation', type: 'select', options: [
                    { value: 'COURS_PARTICULIER', label: 'Cours particulier' },
                    { value: 'FORMATION_PRO', label: 'Formation professionnelle' },
                    { value: 'COURS_LIGNE', label: 'Cours en ligne' },
                    { value: 'ATELIER', label: 'Atelier' },
                ]
            },
            { name: 'matiere', label: 'Matière / Domaine', type: 'text', required: true, placeholder: 'Ex: Mathématiques, Informatique...' },
            {
                name: 'niveau', label: 'Niveau', type: 'select', options: [
                    'Primaire', 'Collège', 'Lycée', 'Université', 'Professionnel', 'Tous niveaux'
                ]
            },
            { name: 'duree', label: 'Durée', type: 'text', placeholder: 'Ex: 3 mois, 20 heures...' },
            { name: 'certificat', label: 'Certificat délivré', type: 'boolean' },
            { name: 'en_ligne', label: 'Formation en ligne', type: 'boolean' },
        ]
    },
};

/**
 * Récupère la configuration des champs pour une catégorie donnée
 */
export function getCategoryFields(categorySlug: string): CategoryField[] {
    // Chercher d'abord par slug exact
    if (CATEGORY_FIELDS_CONFIG[categorySlug]) {
        return CATEGORY_FIELDS_CONFIG[categorySlug].fields;
    }

    // Chercher par slug parent (pour les sous-catégories)
    const parentSlug = categorySlug.split('/')[0];
    if (CATEGORY_FIELDS_CONFIG[parentSlug]) {
        return CATEGORY_FIELDS_CONFIG[parentSlug].fields;
    }

    // Aucune configuration trouvée
    return [];
}

/**
 * Vérifie si une catégorie a des champs dynamiques configurés
 */
export function hasDynamicFields(categorySlug: string): boolean {
    return getCategoryFields(categorySlug).length > 0;
}
