import { configureStore } from '@reduxjs/toolkit'
import { 
    userReducer 
} from './reducers/userReducer'
import {
    userChatReducer
} from './reducers/chatReducer'

import { messageReducer } from './reducers/messageReducer';

const store = configureStore({
    reducer: {
        user: userReducer,
        userChat: userChatReducer,
        messages: messageReducer,
    }
});

export default store;