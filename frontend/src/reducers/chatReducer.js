import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    userChats: [],
    error: null,
    chat: null,
};

export const userChatReducer = createReducer(initialState, {
    userChatRequest: (state, action) => {
        state.loading= true;
    },
    userChatSuccess: (state, action) => {

    },
    userChatFailure: (state, action) => {

    },

    // fetch Chats
    fetchChatsRequest: (state, action) =>{
        state.loading = true;
    },
    fetchChatsSuccess: (state, action) => {
        state.loading = false;
        state.userChats = action.payload;
    },
    fetchChatsFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    // createGroupChatRequest
// createGroupChatSuccess
// createGroupChatFailure
    createGroupChatRequest: (state, action) => {
        state.loading = true;
    },
    createGroupChatSuccess: (state, action) => {
        state.loading = false;
        state.userChats.chats = [action.payload.fullGroupChat, ...state.userChats.chats];
    },
    createGroupChatFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    // selected chat reducer part
    selectedChatRequest: (state) => {
        state.loading = true;
    },
    selectedChatSuccess: (state, action) => {
        state.loading = false;
        state.chat = action.payload;
    },
    selectedChatFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    // group chat rename reducer
    renameGroupChatRequest: (state, action) => {
        state.loading = true;
    },
    renameGroupChatSuccess: (state, action) => {
        state.loading = false;
        state.chat = action.payload.updatedChat;
        const index = state.userChats.chats.findIndex((l) => l._id === action.payload.updatedChat._id);
        if(index !== -1){
            state.userChats.chats[index].chatName = action.payload.updatedChat.chatName;
        }
    },
    renameGroupChatFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    // group chat add member reducers
    groupChatAddMemberRequest: (state, action) => {
        state.loading = true;
    },
    groupChatAddMemberSuccess: (state, action) => {
        state.loading = false;
        state.chat = null;
        const index = state.userChats.chats.findIndex((l) => l._id === action.payload.updatedChat._id);
        if(index !== -1){
            state.userChats.chats[index].users = action.payload.updatedChat.users;
        }
    },
    groupChatAddMemberFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    // remove members from group chat
    groupChatRemoveMemberRequest: (state, action) => {
        state.loading = true;
    },
    groupChatRemoveMemberSuccess: (state, action) => {
        state.loading = false;
        state.chat = null;
        const index = state.userChats.chats.findIndex((l) => l._id === action.payload.updatedChat._id);
        if(index !== -1){
            state.userChats.chats[index].users = action.payload.updatedChat.users;
        }
    },
    groupChatRemoveMemberFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },


    
});