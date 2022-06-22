import axios from 'axios'

export const sendMessage = (data) => async (dispatch) => {
    try{
        dispatch({type: "sendMessageRequest"});
        
        await dispatch({
            type: "sendMessageSuccess",
            payload: data,
        });
    }catch(error){
        dispatch({
            type: "sendMessageFailure",
            payload: error,
        });
    }
}

export const sendMessageSocketFalse = () => async (dispatch) => {
    try{
        dispatch({
            type: "sendMessageSocketFalse",
            payload: false,
        });
    }catch(error){

    }
} 

export const fetchMessages = (chatId) => async (dispatch) => {
    try{
        dispatch({type: "fetchMessageRequest"});
        const config = {
            headers: {"Content-Type": "application/json"}
        }

        const {data} = await axios.get(`/api/message/${chatId}`);
        dispatch({
            type: "fetchMessageSuccess",
            payload: data,
        });
    }catch(error){
        dispatch({
            type: "fetchMessageFailure",
            payload: error,
        });
    }
}


// receive messages
export const receiveMessage = (newMessageReceived) => async (dispatch) => {
    try{
        dispatch({type: "receivedMessageRequest"});
        const config = {
            headers: {"Content-Type": "application/json"}
        }

        // const {data} = await axios.get(`/api/message/${chatId}`);
        dispatch({
            type: "receivedMessageSuccess",
            payload: newMessageReceived,
        });
    }catch(error){
        dispatch({
            type: "receivedMessageFailure",
            payload: error,
        });
    }
}

// send notification action
export const sendMessageNotifications = (newMessageReceived) => async (dispatch) => {
    try{
        dispatch({type: "sendMessageNotificationRequest"});
        const config = {
            headers: {"Content-Type": "application/json"}
        }

        // const {data} = await axios.get(`/api/message/${chatId}`);
        dispatch({
            type: "sendMessageNotificationSuccess",
            payload: newMessageReceived,
        });
    }catch(error){
        dispatch({
            type: "sendMessageNotificationfailure",
            payload: error,
        });
    }
}