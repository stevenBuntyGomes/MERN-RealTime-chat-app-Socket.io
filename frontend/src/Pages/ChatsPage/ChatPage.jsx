import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { loadUser } from '../../Actions/userAction';
import {Box} from '@chakra-ui/react'
import SideBar from '../../Components/SideBar/SideBar';
import MyChats from '../../Components/Chats/MyChats';
import ChatBox from '../../Components/Chats/ChatBox';

const ChatPage = () => {
  const dispatch = useDispatch();
    const {isAuthenticated, user} = useSelector((state) => state.user);
    const [chats, setChats] = useState([]); 
    const [fetchAgain, setFetchAgain] = useState(false);
    // const fetchChats = async () => {
    //     const {data} = await axios.get('/api/chat');
    //     setChats(data);
    // }
    useEffect(() => {
        dispatch(loadUser());
    }, [isAuthenticated]);
  return (
    <div style = {{ width: "100%" }}>
      <SideBar user = {user.user && user.user}/>
      <Box style = {{ display: "flex", justifyContent: "space-between" }}
          w = "100%"
          h = "91.5vh"
          p = {3}
        >
          <MyChats fetchAgain = {fetchAgain} user = {user.user && user.user}/>
          <ChatBox fetchAgain = {fetchAgain} setFetchAgain = {setFetchAgain}/>
      </Box>
    </div>
  )
}

export default ChatPage