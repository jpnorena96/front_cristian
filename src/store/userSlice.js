import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    isAuthenticated: false,
    token: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            // action.payload should be { user: {...}, token: "..." }
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.currentUser = null;
            state.token = null;
            state.isAuthenticated = false;
        },
        // Optional: Update user data without re-login
        updateUser: (state, action) => {
            if (state.currentUser) {
                state.currentUser = { ...state.currentUser, ...action.payload };
            }
        }
    },
});

export const { setUser, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
