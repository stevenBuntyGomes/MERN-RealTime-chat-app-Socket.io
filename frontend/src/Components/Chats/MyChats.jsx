import React, {useState, useEffect} from 'react'
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import {fetchChats} from '../../Actions/chatAction'
import { useDispatch, useSelector } from 'react-redux';
import {getSender} from '../../config/ChatLogics'
import GroupChatModal from './GroupChatModal';
import { setSelectedChat } from '../../Actions/chatAction'

const MyChats = ({user, fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const dispatch = useDispatch();
  const {userChats, chat: SelectedChat} = useSelector((state) => state.userChat);

  // set selected chat handler

  const setSelectedChathandler = (chat) => {
    dispatch(setSelectedChat(chat));
  }


  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);
  return (
    <Box
      display = {{ base: SelectedChat !== null ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chats
          </Button>
        </GroupChatModal>
        
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {userChats.chats && userChats.chats ? (
          <Stack 
            overflowY="scroll"
            
          >
            {userChats.chats && userChats.chats.map((chat, index) => (
              <Box
                onClick={() => setSelectedChathandler(chat)}
                cursor="pointer"
                bg={SelectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={SelectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={index}
              >
                {console.log(user)}
                <Text>{!chat.isGroupChat ? (
                  
                    getSender(user && user, chat.users)
                  ) : (
                    chat.chatName
                )}</Text>
              </Box>  
            ))}
          </Stack>
        ) : (
          <Box>

          </Box>
        )}
          
        
      </Box>
    </Box>
  )
}

export default MyChats