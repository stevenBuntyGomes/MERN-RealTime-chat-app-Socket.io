import React, {useState} from 'react'
import {
    VStack,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    FormControl, 
    FormLabel,
} from '@chakra-ui/react'
import {useDispatch, useSelector} from 'react-redux'
import { loginUser } from '../../Actions/userAction'

const Login = () => {
    const {} = useSelector
    const dispatch = useDispatch();
  const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleClick = () => setShow(!show);

    const submitHandler = (e) => {
        e.preventDefault();
        if(email === "" || password === ""){
            alert("the fields can not be empty");
        }else{
            dispatch(loginUser(email, password));
        }
    }

    const guestLogin = (email, password) => {
        let mailer = "example234@gmail.com";
        let mailer2 = "example2nd@gmail.com";
        let pass = "12345678";
        dispatch(loginUser(mailer, pass));
    }
    const guestLogin2 = (email, password) => {
        let mailer = "example2nd@gmail.com";
        let pass = "12345678";
        dispatch(loginUser(mailer, pass));
    }
  return (
    <VStack
        spacing = "5px"
        color = "black"
    >
        {/* name */}
        <FormControl id = "first-name" isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
                placeholder = "Enter Your Name"
                onChange = {(e) => setEmail(e.target.value)}
            />
        </FormControl>
        {/* password */}
        <FormControl id = "password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size = "md">
                <Input 

                    type = {show ? "text" : "password"}
                    placeholder = "Enter Your Password"
                    onChange = {(e) => setPassword(e.target.value)}
                />
                 <InputRightElement
                    width = "4.5rem"
                >
                    <Button h = "1.75rem" size = "sm" onClick = {handleClick}>
                        {show ? "Hide"  : "show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button
            colorScheme="blue"
            width = "100%"
            style = {{ marginTop: 15 }}
            onClick = {submitHandler}
        >
            Login
        </Button>
        <Button
            variant = "solid"
            colorScheme="red"
            width = "100%"
            style = {{ marginTop: 15 }}
            onClick = {guestLogin}
        >
            Just Click to Login As Guest User
        </Button>
        <Button
            variant = "solid"
            colorScheme="red"
            width = "100%"
            style = {{ marginTop: 15 }}
            onClick = {guestLogin2}
        >
            Just Click to Login As Guest User2
        </Button>
    </VStack>
  )
}

export default Login