import React from 'react'
import { 
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, 
    Button,
    Image,
    Text,
} from '@chakra-ui/react'
import {IconButton} from '@chakra-ui/button'
import { ViewIcon } from '@chakra-ui/icons';

const ProfileModel = ({user, children}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>{children ? (
        <span onClick = {onOpen}>{children}</span>
    )
    : (
        <IconButton
            style = {{ display: "flex" }}
            icon = {<ViewIcon/>}
            onClick = {onOpen}
        />
        )}
        <Modal size = "lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h = "410px">
          <ModalHeader
            style = {{ display: "flex", justifyContent: "center" }}
            fontSize="40px"
            fontFamily = "Work sans"
          >{user && user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            style = {{ display: "flex", alignItems:"center"}}
            flexDir = "column"
            
          >
            <Image
                borderRadius="full"
                boxSize="150px"
                src = {user && user.pic.url}
                alt = {user && user.name}
            />
            <Text
                fontSize="24px"
                fontFamily = "Work sans"
            >{user && user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
</>
  )
}

export default ProfileModel