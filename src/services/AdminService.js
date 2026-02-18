const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AdminService = {
    getStats: async (token) => {
        // In real app, pass token in Authorization header
        const res = await fetch(`${API_URL}/api/admin/stats`);
        return res.json();
    },

    getUsers: async (token) => {
        const res = await fetch(`${API_URL}/api/admin/users`);
        return res.json();
    },

    getRecentConversations: async (token) => {
        const res = await fetch(`${API_URL}/api/admin/conversations`);
        return res.json();
    }
};
