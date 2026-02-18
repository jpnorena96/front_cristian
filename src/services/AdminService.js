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

    createUser: async (userData) => {
        const res = await fetch(`${API_URL}/api/admin/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return res.json();
    },

    updateUser: async (id, userData) => {
        const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return res.json();
    },

    deleteUser: async (id) => {
        const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
            method: 'DELETE'
        });
        return res.json();
    },

    getRecentConversations: async (token) => {
        const res = await fetch(`${API_URL}/api/admin/conversations`);
        return res.json();
    },

    uploadKnowledge: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_URL}/api/admin/knowledge`, {
            method: 'POST',
            body: formData
        });
        return res.json();
    },

    getKnowledgeBase: async () => {
        const res = await fetch(`${API_URL}/api/admin/knowledge`);
        return res.json();
    },

    deleteKnowledge: async (id) => {
        const res = await fetch(`${API_URL}/api/admin/knowledge/${id}`, {
            method: 'DELETE'
        });
        return res.json();
    }
};
