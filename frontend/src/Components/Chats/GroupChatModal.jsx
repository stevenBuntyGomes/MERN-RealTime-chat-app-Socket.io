import React, {useState, useEffect, useDeferredValue} from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Box,
} from '@chakra-ui/react'
import { fetchChats } from '../../Actions/chatAction'
import { useDispatch, useSelector } from 'react-redux'
import { searchUser } from '../../Actions/userAction'
import { createGroupChat } from '../../Actions/chatAction'
import UserListItem from '../UserListItem/UserListItem'
import UserBadgeItem from '../UserListItem/UserBadgeItem'

const GroupChatModal = ({ children }) => {
  const { allUsers } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

//   search users
  const handleSearch = (query) => {
    if(!query){
        return;
    }
    dispatch(searchUser(query));
  }
//   create group chat
  const handleSubmit = () => {
    if(!groupChatName || !selectedUsers){
        toast({
            title: "complete the required fields",
            status: "warning",
            duration: 1000,
            isClosable: true,
            position: "top",
        });
        return;
    }
    dispatch(createGroupChat({
        name: groupChatName, 
        users: JSON.stringify(selectedUsers.map((u) => u._id))
    }));
    toast({
        title: "new group chat created!",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top",
    });
  }
// handle user delete from group
const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
}

//   handle group user
const handleGroup = (userToAdd) => {
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
    setSelectedUsers([...selectedUsers, userToAdd]);
}


//   useEffect
  useEffect(() => {
  }, [dispatch]);

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Modal Title
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
          >
            <FormControl>
                <Input
                    placeholder='Chat Name'
                    mb = {3}
                    onChange = {(e) => setGroupChatName(e.target.value)}
                />
            </FormControl>
            <FormControl>
                <Input
                    placeholder='Add Users'
                    mb = {3}
                    onChange = {(e) => handleSearch(e.target.value)}
                />
            </FormControl>
            {/* selected users */}
            <Box
                w = "100%"
                display = "flex"
                flexWrap = "wrap"
            >
                {selectedUsers && selectedUsers.map((user) => (
                    <UserBadgeItem 
                        key = {user._id} 
                        user = {user}
                        handleFunction = {() => handleDelete(user)}
                    />
                ))}
            </Box>
            
            {/* rander searched users */}
            {loading ? (<div>
                <Spinner />
            </div>) : (
                allUsers.users && allUsers.users.map((user) => (
                    <UserListItem 
                        key = {user._id} 
                        user = {user} 
                        handleFunction = {() => handleGroup(user)}
                    />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Group Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal