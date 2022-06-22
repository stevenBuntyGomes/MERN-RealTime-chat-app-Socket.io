import React, {useState, useEffect} from 'react'
import {
    Box, 
    Text, 
    IconButton, 
    FormControl,
    Input,
    useToast,
} from '@chakra-ui/react'
import './styles.css'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowBackIcon } from '@chakra-ui/icons';
import { setSelectedChat, fetchChats } from '../../Actions/chatAction'
import { getSender, getSenderFull } from '../../config/ChatLogics'
import ProfileModel from '../ProfileModel/ProfileModel'
import {loadUser} from '../../Actions/userAction'
import UpdateGroupChatModal from './UpdateGroupChatModal';
import { Spinner } from '@chakra-ui/react';
import { 
    sendMessage, 
    fetchMessages, 
    sendMessageNotifications, 
} from '../../Actions/messageAction'
import ScrollableChat from './ScrollableChat';
import { isSameSender, isLastMessage } from '../../config/ChatLogics';
import animationData from "../../Animations/typing.json";
import Lottie from "react-lottie";
import io from 'socket.io-client';
const ENDPOINT = "http://localhost:5000/";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
  const toast = useToast();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [emptyChat, setEmptyChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch();
  const {chat: SelectedChat, loading} = useSelector((state) => state.userChat);
  const {
    messages, 
    loading: loadingMessage, 
    notifications,
  } = useSelector((state) => state.messages);
  const {isAuthenticated, user} = useSelector((state) => state.user);
  const [socketConnected, setSocketConnected] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const setSelectedChathandler = (chat) => {
    dispatch(loadUser());
    dispatch(setSelectedChat(chat));
  }

//   send message using onKeyDown
  const sendMessageHandler = async (event) => {
    if(event.key === "Enter" && newMessage){
        try{  
            socket.emit("stop typing", SelectedChat._id);
            setNewMessage("");
            const config = {
                headers: {"Content-Type": "application/json"}
            }
            const {data} = await axios.post('/api/message', {
                content: newMessage,
                chatId: SelectedChat._id,
            }, config);
            dispatch(sendMessage(data.message));
            socket.emit("new message", data.message);
            setNewMessage("");
        }catch(error){
            toast({
                title: "Error Occured!",
                description: "Failed to send the Message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }
    
    // if(event.key === "Enter" && newMessage){
    //     console.log("working");
    //     dispatch(sendMessage(newMessage, SelectedChat._id));
    //     setNewMessage("");
    // }
  }

//   fetch all of the messages
  const fetchMessagesHandler = () => {
    if(!SelectedChat){
        return;
    }

    dispatch(fetchMessages(SelectedChat._id));

    socket.emit('join chat', SelectedChat._id);
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    if(user.user && user.user !== null){
        socket.emit("setup", user.user && user.user);
        socket.on("connection", setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }
  }, []);

  

  useEffect(() => {
    fetchMessagesHandler();
    
    
    selectedChatCompare = SelectedChat;
    
  },[SelectedChat]);

  

  const messageReceivedSocket = (newMessageReceived) => {
    if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
            if(!notifications.includes(newMessageReceived)){
                dispatch(sendMessageNotifications(newMessageReceived));
                dispatch(fetchChats());
            }
        }else{
            dispatch(sendMessage(newMessageReceived));

        }
  }

  useEffect(() => {
        // socket.on("message received", (newMessageReceived) => {
        //     console.log(newMessageReceived);
        //     if(!selectedChatCompare || selectedChatCompare._id !==newMessageReceived.chat._id){
        //         // give notification
        //     }else{
        //         dispatch(sendMessage(newMessageReceived));

        //     }
        // });
        socket.on("message received", (newMessageReceived) =>  messageReceivedSocket(newMessageReceived));
        socket.off("message received", (newMessageReceived) =>  messageReceivedSocket(newMessageReceived));
    }, []);


    //   type handler of input
    const typeHandler = (e) => {
        setNewMessage(e.target.value);
        if(!socketConnected){
            return;
        }
        if(!typing){
            setTyping(true);
            socket.emit("typing", SelectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDifference = timeNow - lastTypingTime;
            if(timeDifference >= timerLength && typing){
                socket.emit("stop typing", SelectedChat._id);
                setTyping(false);
            }
        }, timerLength);
        // typing indicator logic
    }
  return (
    <>
        {SelectedChat ? (
            <>
                <Box
                    fontSize = {{ base: "28px", md: "30px" }}
                    pb = {3}
                    px = {2}
                    w = "100%"
                    fontFamily= 'Work Sans'
                    display = "flex"
                    justifyContent = {{ base: "space-between"  }}
                    alignItems = "center"
                >
                    <IconButton
                        display = {{ base: "flex", md: "none" }}
                        icon = {<ArrowBackIcon/>}
                        onClick={() => setSelectedChathandler(emptyChat)}
                    />
                    {!SelectedChat.isGroupChat ? (
                        <>
                            {getSender(user.user && user.user, SelectedChat.users)}
                            <ProfileModel user = {getSenderFull(user.user && user.user, SelectedChat.users)}/>
                        </>
                    ) : (
                        <>
                            {SelectedChat.chatName.toUpperCase()}
                            <UpdateGroupChatModal
                                fetchAgain = {fetchAgain}
                                setFetchAgain = {setFetchAgain}
                            />
                        </>
                    )}
                </Box>
                <Box
                    display = "flex"
                    flexDir="column"
                    justifyContent= "flex-end"
                    p = {3}
                    bg = "#E8E8E8"
                    w= "100%"
                    h = "100%"
                    borderRadius= "lg"
                    overflowY="hidden"
                >
                    
                    {
                        loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className='messages'>
                                <ScrollableChat messages = {messages} />
                            </div>
                        )
                    }
                    <FormControl 
                        onKeyDown={sendMessageHandler}
                        mt = {3}
                        isRequired
                    >
                        {isTyping ? 
                        <div>
                            <Lottie
                                options = {defaultOptions}
                                width = {70}
                                style = {{ marginBottom: 15, marginLeft: 0 }}
                            />
                        </div> : <></>}
                        <Input
                            variant = "filled"
                            bg = "#E0E0E0"
                            placeholder="enter a message"
                            onChange = {typeHandler}
                            value = {newMessage}
                        />
                    </FormControl>
                </Box>
            </>
        ) : (
            <>
                <Box
                    display = "flex"
                    alignItems = "center"
                    justifyContent= 'center'
                    h = "100%"
                >
                    <Text
                        fontSize = "3xl"
                        pb = {3}
                        fontFamily = "Work sans"
                    >
                        Click On A User To Start Chatting
                    </Text>
                </Box>
            </>
        )}
    </>
  )
}

export default SingleChat