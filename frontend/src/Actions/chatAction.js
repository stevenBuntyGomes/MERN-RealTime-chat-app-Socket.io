import axios from 'axios'

export const userChat = (userId) => async (dispatch) => {
    try{
        dispatch({type: "userChatRequest"});
        const config = {
            headers: {"Content-Type": "application/json"}
        }

        const {data} = await axios.post('/api/chat', {userId}, config);
        dispatch({
            type: "userChatSuccess",
            payload: data,
        });
    }catch(error){
        dispatch({
            type: "userChatFailure",
            payload: error,
        });
    }
}

// fetch Chats

export const fetchChats = () => async (dispatch) => {
    try{
        dispatch({type: "fetchChatsRequest"});
        const config = {
            headers: {"Content-Type": "application/json"}
        }

        const {data} = await axios.get('/api/chat', config);
        dispatch({
            type: "fetchChatsSuccess",
            payload: data,
        });
    }catch(error){
        dispatch({
            type: "fetchChatsFailure",
            payload: error,
        });
    }
}

// create group chat action
export const createGroupChat = ({name, users}) => async (dispatch) => {
    try{
        dispatch({type: "createGroupChatRequest"});
        const config = {
            headers: {"Content-Type": "application/json"}
        }
        const {data} = await axios.post('/api/chat/group', {
            name: name, 
            users: users,
        }, config);
        dispatch({
            type: "createGroupChatSuccess",
            payload: data,
        });
    }catch(error){
        dispatch({
            type: "createGroupChatFailure",
            payload: error,
        });
    }
}

// set selectedChat
export const setSelectedChat = (chat) => async (dispatch) => {
    try{
    //selectedChatRequest
    // selectedChatSuccess
    // selectedChatFailure
        dispatch({type: "selectedChatRequest"});
        const config = {
            headers: {"Content-Type": "application/json"}
        }
        dispatch({
            type: "selectedChatSuccess",
            payload: chat,
        });
    }catch(error){
        dispatch({
            type: "selectedChatFailure",
            payload: error,
        });
    }
}


export const groupChatRename = (setSelectedChat, groupChatName) => async (dispatch) => {
    try{
        dispatch({type: "renameGroupChatRequest"});
        const config = {
            headers: {"Content-Type": "application/json"}
        };
        const {data} = await axios.put('/api/chat/rename', {
            chatId: setSelectedChat._id,
            chatName: groupChatName, 
        }, config);
        dispatch({
            type: "renameGroupChatSuccess",
            payload: data,
        });
    }catch(error){
        dispatch({
            type: "renameGroupChatFailure",
            payload: error,
        });
    }
}

// 
export const groupChatAddMember = (setSelectedChat, user) => async (dispatch) => {
    try{
        dispatch({type: "groupChatAddMemberRequest"});
        const config = {
            headers: {"Content-Type": "application/json"}
        };
        const { data } = await axios.put('/api/chat/groupadd', {
            chatId: setSelectedChat._id,
            userId: user._id, 
        }, config);
        dispatch({
            type: "groupChatAddMemberSuccess",
            payload: data,
        });
    }catch(error){
        dispatch({
            type: "groupChatAddMemberFailure",
            payload: error,
        });
    }
}

export const groupChatRemoveMember = (setSelectedChat, user) => async (dispatch) => {
    try{
        dispatch({type: "groupChatRemoveMemberRequest"});
        const config = {
            headers: {"Content-Type": "application/json"}
        };
        const { data } = await axios.put('/api/chat/groupremove', {
            chatId: setSelectedChat._id,
            userId: user._id, 
        }, config);
        dispatch({
            type: "groupChatRemoveMemberSuccess",
            payload: data,
        });
    }catch(error){
        dispatch({
            type: "groupChatRemoveMemberFailure",
            payload: error,
        });
    }
}