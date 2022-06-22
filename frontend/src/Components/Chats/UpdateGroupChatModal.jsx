import React, { useEffect, useState } from 'react'
import {
  Box,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  FormControl,
  Input,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import UserBadgeItem from '../UserListItem/UserBadgeItem';
import { groupChatRename, groupChatAddMember, groupChatRemoveMember } from '../../Actions/chatAction'
import { searchUser } from '../../Actions/userAction'
import UserListItem from '../UserListItem/UserListItem';
import {fetchChats} from '../../Actions/chatAction'
import { fetchMessages } from '../../Actions/messageAction'
import io from 'socket.io-client'
const ENDPOINT = "http://localhost:5000/";
var socket, selectedChatCompare;

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain}) => {
  const dispatch = useDispatch();
  const {chat: SelectedChat} = useSelector((state) => state.userChat);
  const {isAuthenticated, user} = useSelector((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { allUsers } = useSelector((state) => state.user);
  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();
  const handleRemove = (delUser) => {
    if (SelectedChat.groupAdmin._id !== user.user._id) {
      toast({
        title: "admins can remove someone or person himself can remove himself!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
      // || delUser._id !== user._id
    }
    dispatch(groupChatRemoveMember(SelectedChat, delUser));
    fetchMessagesHandler();
  }

  const handleSearch = (query) => {
    if(!query){
        return;
    }
    dispatch(searchUser(query));
  }

  const handleRename = () => {
    if(!groupChatName){
      return;
    }

    dispatch(groupChatRename(SelectedChat, groupChatName));

    setGroupChatName("");

  }


  const handleAddUser = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)){
        toast({
            title: "user already exist",
            status: "warning",
            duration: 1000,
            isClosable: true,
            position: "top",
        });
            return;
        }
        if (SelectedChat.groupAdmin._id !== user.user._id) {
          toast({
            title: "Only admins can add someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
        // setSelectedUsers([...selectedUsers, userToAdd]);
        dispatch(groupChatAddMember(SelectedChat, userToAdd));
        setGroupChatName("");
    }

    // fetch messages
    const fetchMessagesHandler = () => {
      if(!SelectedChat){
          return;
      }

      dispatch(fetchMessages(SelectedChat._id));
      socket.emit('join chat', SelectedChat._id);

    }
  useEffect(() => {
    setSelectedUsers(SelectedChat.users);

    socket = io(ENDPOINT);
    socket.emit("setup", user.user);
    socket.on("connection", setSocketConnected(true));
    dispatch(fetchChats());

  }, [dispatch]);
  return (
    <Box>
      <IconButton 
        onClick={onOpen} 
        display = {{ base: "flex",  }}
        icon = {<ViewIcon/>}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize = "35px"
            fontFamily = "Work sans"
            display = "flex"
            justifyContent="center"
          >
            {SelectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              w = "100%"
              display = "flex"
              flexWrap = "wrap"
              p = {2}
            >
              {selectedUsers && selectedUsers.map((user, index) => (
                <UserBadgeItem
                  key = {index}
                  user = {user}
                  handleFunction = {() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* rander searched users */}
            {
                allUsers.users && allUsers.users.map((user, index) => (
                    <UserListItem 
                        key = {index} 
                        user = {user} 
                        handleFunction = {() => handleAddUser(user)}
                    />
                ))
            }
          </ModalBody>
            
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default UpdateGroupChatModal