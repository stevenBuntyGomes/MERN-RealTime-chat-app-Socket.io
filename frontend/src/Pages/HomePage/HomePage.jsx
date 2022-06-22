import React from 'react'
import {
  Container, 
  Box, 
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
}  from '@chakra-ui/react'
import Login from '../../Components/Authentication/Login'
import SignUp from '../../Components/Authentication/SignUp'

const HomePage = () => {
  return (
    <Container maxW = "xl" centerContent>
      <Box
        d = "flex"
        p = {3}
        justifyContent = "center"
        textAlign="center"
        bg = {"white"}
        w = "100%"
        m = "40px 0 15px 0"
        borderRadius="lg"
        borderWidth= "1px"
      >
        <Text 
          fontSize="4xl"
          fontFamily="Work Sans"
          color = "black"  
        >
          Talk-A-Tive
        </Text>
      </Box>
      <Box bg = "white" w= "100%" p = {4} borderRadius = "lg" borderWidth = "1px">
        <Tabs variant='soft-rounded' color = "black">
          <TabList mb = "1em">
            <Tab width = "50%">Login</Tab>
            <Tab width = "50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage