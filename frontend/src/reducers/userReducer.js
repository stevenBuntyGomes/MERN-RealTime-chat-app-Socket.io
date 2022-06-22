import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    token: null,
    allUsers: []
}

export const userReducer = createReducer(initialState, {
    // register reducers
    registerRequest: (state) => {
        state.loading = true;
    },
    RegisterSuccess: (state, action) =>{
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true; 
        state.token = action.payload.token;
    },
    Registerfailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },
    //login reducer
    loginRequest: (state) => {
        state.loading = true;
    },
    loginSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true; 
        state.token = action.payload.token;
    },
    loginFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },
    // load user reducer
    loadUserRequest: (state) => {
        state.loading = true;
    }, 
    loadUserSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true; 
    },
    LoadUserFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },

    // logout user request
    logoutUserRequest: (state, action) => {
        state.loading = true;
    },
    logoutUserSuccess: (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
    },
    logoutUserFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = true;
    },
    // search user reducer
    searchUserRequest: (state, action) => {
        state.loading = true;
    },
    searchUserSuccess: (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
    },
    searchUserFailuer: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

}); 