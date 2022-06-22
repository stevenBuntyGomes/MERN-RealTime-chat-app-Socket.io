import axios from 'axios'

export const registerUser = (name, email, password, confirmPassword, pic) => async (dispatch) => {
    try{
        dispatch({type: "registerRequest"});
        const config = {
            headers: {"Content-Type": "application/json"}
        }

        const {data} = await axios.post('/api/user/signup', {name, email, password, confirmPassword, pic}, config);
        dispatch({
            type: "RegisterSuccess",
            payload: data,
        });
    }catch(error){
        dispatch({
            type: "Registerfailure",
            payload: error,
        });
    }
}
// login user
export const loginUser = (email, password) => async (dispatch) => {
    try{
        dispatch({type: "loginRequest"});
        const config = {
            headers: {"Content-Type": "application/json"}
        }
        const {data} = await axios.post('/api/user/login', {email, password}, config);
        dispatch({
            type: "loginSuccess",
            payload: data,
        });
    }catch(error){
        dispatch({
            type: "Registerfailure",
            payload: error,
        });
    }
}

// load user
export const loadUser = () => async (dispatch) => {
    try{
        dispatch({type: "loadUserRequest"});
        const {data} = await axios.get('/api/user/me');
        dispatch({
            type: "loadUserSuccess",
            payload: data,
        });
    }catch(error){
        dispatch({
            type: "LoadUserFailure",
            payload: error.response.data.message,
        });
    }
}

// logout user

export const logoutUser = () => async (dispatch) => {
    try{
        dispatch({type: "logoutUserRequest"});
        await axios.get('/api/user/logout');

        dispatch({
            type: "logoutUserSuccess"
        });
    }catch(error){
        dispatch({
            type: "logoutUserFailure",
            payload: error.response.data.message,
        });
    }
}

// search user

export const searchUser = (search) => async (dispatch) => {
    try{
        dispatch({type: "searchUserRequest"});
        const config = {
            headers: {"Content-Type": "application/json"}
        };
        const {data} = await axios.get(`/api/user?search=${search}`, config);
        dispatch({
            type: "searchUserSuccess",
            payload: data,
        });
    }catch(error){
        dispatch({
            type: "searchUserFailuer",
            payload: error.response.data.message,
        });
    }
}