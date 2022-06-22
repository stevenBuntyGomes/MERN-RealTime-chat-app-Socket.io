import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { useDispatch, useSelector } from 'react-redux';
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from '../../config/ChatLogics';
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollableChat = (messages) => {
    const {isAuthenticated, user} = useSelector((state) => state.user);
    return (
    <ScrollableFeed>
        {/* {console.log(messages.messages)} */}
        {messages.messages && messages.messages.map((message, index) => (
            <div
                style = {{ display: "flex" }}
                key = {index}
            >
                {
                    (isSameSender(messages.messages, message, index, user.user._id)
                       || isLastMessage(messages.messages, index, user.user._id)
                    ) && (
                        <Tooltip
                            label = {message.sender.name}
                            placement = "bottom-start"
                            hasArrow
                        >
                            <Avatar
                                mt="7px"
                                mr={1}
                                size="sm"
                                cursor="pointer"
                                name={message.sender.name}
                                src={message.sender.pic}
                            />
                        </Tooltip>
                    )
                }
                <span
                    style={{
                        backgroundColor: `${
                        message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                        }`,
                        marginLeft: isSameSenderMargin(messages.messages, message, index, user.user._id),
                        marginTop: isSameUser(messages.messages, message, index, user.user._id) ? 3 : 10,
                        borderRadius: "20px",
                        padding: "5px 15px",
                        maxWidth: "75%",
                    }}
                    >
              {message.content}
            </span>
            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat