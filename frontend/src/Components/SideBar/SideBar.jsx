import React, {useState, useEffect} from 'react'
import { 
    Box, 
    Button, 
    Tooltip, 
    Text, 
    Menu, 
    MenuButton, 
    MenuList, 
    Avatar, 
    MenuItem, 
    MenuDivider, 
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Input,
    useToast
} from '@chakra-ui/react';
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import {useDispatch, useSelector} from 'react-redux'
import { loadUser, logoutUser, searchUser } from '../../Actions/userAction';
import { userChat, fetchChats, setSelectedChat } from '../../Actions/chatAction';
import ProfileModal from '../ProfileModel/ProfileModel';
import {useDisclosure} from '@chakra-ui/hooks' 
import ChatLoading from '../Chats/ChatLoading';
import UserListItem from '../UserListItem/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge, {Effect} from "react-notification-badge";

const SideBar = () => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();
    const dispatch = useDispatch();
    const {isAuthenticated, user, loading: userLoading, allUsers} = useSelector((state) => state.user);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const {
    messages, 
    loading: loadingMessage, 
    notifications,
  } = useSelector((state) => state.messages);


    const logoutHandler = () => {
        dispatch(logoutUser());
    }

    const handleSearch = () => {
        if(!search){
            toast({
                title: "please enter something in search",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-left"
            });
            return;
        }
        setLoading(true);
        dispatch(searchUser(search));
        setLoading(false);
    }

    const accessChat = (userId) => {
        dispatch(userChat(userId));
    }

    useEffect(() => {
        dispatch(loadUser());
        dispatch(fetchChats());
    }, [dispatch, isAuthenticated]);
  return (
    <> {userLoading === true ? (
        <div>loading</div>
    ) : (
        <>
        <Box 
            style = {{ display: "flex", justifyContent: "space-between", alignItems: "center"  }}
            bg = "white"
            w = "100%"
            p = "5px 10px 5px 10px"
            borderWidth="5px"
        >
            <Tooltip 
                label = "search users to chat" 
                hasArrow  
                placement='bottom-end'
            >
                <Button variant = "ghost" onClick = {onOpen}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <Text
                        d = {{ base: "none", md: "flex"}}

                        px = "4"
                    >
                        Search User
                    </Text>
                </Button>
            </Tooltip>
            <Text
                fontSize = "2xl"
                fontFamily="Work Sans"
            >
                TALK-A-TIVE
            </Text>
            <div>
                <Menu>
                    <MenuButton p={1}>
                        <NotificationBadge
                            count={notifications.length}
                            effect={Effect.SCALE}
                        />
                        <BellIcon fontSize="2xl" m = {1}/>
                        
                        
                    </MenuButton>
                    <MenuList pl = {2}>
                        {notifications && notifications.length < 1 ? (
                            <Text>No New Messages</Text>
                        ) : notifications && notifications.map((notify, index) => (
                            <MenuItem key = {index} onClick = {() => {
                                dispatch(setSelectedChat(notify.chat))
                            }}>
                                {notify.chat.isGroupChat ? 
                                    `New Message from ${notify.chat.chatName}` 
                                    : `New Message from ${getSender(user.user && user.user, notify.chat.users)}`}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton p = {1} as = {Button} rightIcon = {<ChevronDownIcon fontSize="2xl" m = {1}/>}>
                        <Avatar 
                            size = "sm" 
                            cursor="pointer" 
                            name = {user.user && user.user.name}
                            src = {user.user && user.user.pic.url}
                        />
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user = {user.user}>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider/>
                        <MenuItem onClick = {logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>
        <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay/>
        <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
            <DrawerBody>
                <Box
                    style = {{ display: "flex" }}
                    pb = {2}
                >
                    <Input
                        placeholder = "search by name or email"
                        mr = {2}
                        value = {search}
                        onChange = {(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={handleSearch}>Go</Button>
                </Box>
                {loading ? (
                    <ChatLoading/>
                ) : (
                    allUsers.users && allUsers.users.map((user) => (
                        <UserListItem
                            key = {user._id}
                            user = {user}
                            handleFunction={() => accessChat(user._id)}
                        />
                    ))
                )}
            </DrawerBody>
        </DrawerContent>
      </Drawer>
      </>
    )}
        
    </>
  )
}

export default SideBar