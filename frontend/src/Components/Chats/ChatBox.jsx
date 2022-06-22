import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const dispatch = useDispatch();
  const {chat: SelectedChat} = useSelector((state) => state.userChat);


  useEffect(() => {

  }, []);

  return (
    <Box
      display = {{ base: SelectedChat ? "flex" : "none", md: "flex" }}
      alignItems = "center"
      flexDir="column"
      p = {3}
      bg = "white"
      w = {{ base: "100%", md: "63%" }}
      borderRadius = "lg"
      borderWidth = "1px"
    >
      <SingleChat fetchAgain = {fetchAgain} setFetchAgain = {setFetchAgain}/>
    </Box>
  )
}

export default ChatBox