export const TEST_MODE_CONFIG = {
    enabled: process.env.NODE_ENV === 'development',
    testEmail: 'admin@ocomstudio.com',
    testPassword: 'admin@ocomstudio.com',
    testProfile: {
        id: 'test-admin-id',
        email: 'admin@ocomstudio.com',
        full_name: 'Admin Global',
        role: 'ADMIN',
        status: 'ACTIF',
    },
    // Clé locale pour activer le mode test manuellement
    storageKey: 'chezben2_test_mode',
    cookieKey: 'chezben2_test_session',
};
