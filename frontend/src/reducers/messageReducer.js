import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    messages: [],
    error: null,
    messageSocket: null,
    messageSocketSuccess: false,
    notifications: [],
}

export const messageReducer = createReducer(initialState, {
    // userMessageReducer
    sendMessageRequest: (state, action) => {
        state.loading = true;
    },
    
    sendMessageSuccess: (state, action) => {
        state.loading = false;
        state.messages = [...state.messages, action.payload];
    },

    sendMessageSocketFalse: (state, action) => {
        state.messageSocket = null;
        state.messageSocketSuccess = false;
    },

    sendMessageFailure: (state, action) => {
        state.loading = true;
        state.error = action.payload;
    },

    // fetchMessages reducer
    fetchMessageRequest: (state, action) => {
        state.loading = true;
    },
    fetchMessageSuccess: (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
    },
    fetchMessageFailure: (state, action) => {
        state.loading = false;
    },

    receivedMessageRequest: (state, action) => {
        state.loading = true;
    },
    receivedMessageSuccess: (state, action) => {
        state.loading = false;
        state.messages = [...state.messages, action.payload];
    },
    receivedMessageFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    sendMessageNotificationRequest: (state, action) => {
        state.loading = true;
    },
    sendMessageNotificationSuccess: (state, action) => {
        state.loading = false;
        state.notifications = [action.payload, ...state.notifications];
    },
    sendMessageNotificationfailure: (state, action) => {
        state.loading = false;
    },

});

