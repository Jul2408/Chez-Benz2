const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
    refreshSubscribers.map((cb) => cb(token));
    refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('chezben2_refresh_token') : null;
    if (!refreshToken) return null;

    try {
        const response = await fetch(`${API_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) throw new Error('Refresh failed');

        const data = await response.json();
        if (typeof window !== 'undefined') {
            if (data.access) localStorage.setItem('chezben2_token', data.access);
            if (data.refresh) localStorage.setItem('chezben2_refresh_token', data.refresh);
        }
        return data.access;
    } catch (error) {
        if (typeof window !== 'undefined') {
            console.warn('[API] Session expired or refresh failed, logging out');
            localStorage.removeItem('chezben2_token');
            localStorage.removeItem('chezben2_refresh_token');
            localStorage.removeItem('chezben2_user_id');
            // Check if we are already on the login page to avoid loops
            if (!window.location.pathname.includes('/connexion')) {
                window.location.href = '/connexion';
            }
        }
        return null;
    }
}

export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('chezben2_token') : null;

    const headers = new Headers(options.headers);
    const isFormData = options.body instanceof FormData;

    if (!isFormData) {
        headers.set('Content-Type', 'application/json');
    }

    if (token && token !== 'undefined' && token !== 'null') {
        headers.set('Authorization', `Bearer ${token}`);
    }


    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/token/refresh')) {

        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    onRefreshed(newToken);
                } else {
                    onRefreshed('');
                    throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
                }
            } catch (err: any) {
                onRefreshed('');
                throw err;
            } finally {
                isRefreshing = false;
            }
        }

        // Wait for refresh to complete
        return new Promise((resolve, reject) => {
            subscribeTokenRefresh((newToken: string) => {
                if (!newToken) {
                    reject(new Error('Votre session a expiré. Veuillez vous reconnecter.'));
                    return;
                }
                headers.set('Authorization', `Bearer ${newToken}`);
                resolve(fetchApi<T>(endpoint, { ...options, headers }));
            });
        });
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Gérer les erreurs de validation DRF
        if (typeof errorData === 'object' && errorData !== null) {
            // Check for specific error keys
            if (errorData.error) throw new Error(`${errorData.error} [Status: ${response.status}]`);
            if (errorData.detail) throw new Error(`${errorData.detail} [Status: ${response.status}]`);
            if (errorData.message) throw new Error(`${errorData.message} [Status: ${response.status}]`);

            const firstError = Object.values(errorData)[0];
            const message = Array.isArray(firstError) ? firstError[0] : (errorData.detail || errorData.message);
            if (message) throw new Error(`${message} [Status: ${response.status}]`);
        }

        throw new Error(`Une erreur est survenue lors de la communication avec le serveur [Status: ${response.status}]`);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}
