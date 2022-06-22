import React, {useState, useEffect} from 'react'
import {
    VStack,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    FormControl, 
    FormLabel,
    useToast,
} from '@chakra-ui/react'
import {useDispatch, useSelector} from 'react-redux'
import {registerUser} from '../../Actions/userAction'
import {useNavigate} from 'react-router-dom'

const SignUp = () => {
    const navigate = useNavigate();
    const {isAuthenticated} = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pic, setPic] = useState("");
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const handleClick = () => setShow(!show);
    const handleChange = (e) => {
        const file = e.target.files[0];
        const Reader = new FileReader();

        Reader.onload = () => {
            if(Reader.readyState === 2){
                setPic(Reader.result);
            }
        };
        Reader.readAsDataURL(file);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if(name === "" || email === "" || password === "" || confirmPassword === "" ){
            alert("the fields must be filled");
        }else{
            dispatch(registerUser(name, email, password, confirmPassword, pic));
        }

    }

    useEffect(() => {
        if(isAuthenticated){
            navigate('/chat');
        }
    }, [isAuthenticated]);
  return (
    <VStack
        spacing = "5px"
        color = "black"
    >
        {/* name */}
        <FormControl id = "first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input 
                placeholder = "Enter Your Name"
                onChange = {(e) => setName(e.target.value)}
            />
        </FormControl>
        {/* email */}
        <FormControl id = "first-name" isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
                placeholder = "Enter Your Email"
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
        {/* confirm Password */}
        <FormControl id = "password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size = "md">
                <Input 

                    type = {show ? "text" : "password"}
                    placeholder = "Enter Your Password"
                    onChange = {(e) => setConfirmPassword(e.target.value)}
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
        {/* picture */}
        <FormControl id = "pic" isRequired>
            <FormLabel>Upload Your Picture</FormLabel>
            <Input 
                type = "file"
                p = {1.5}
                accept = "image/*"
                onChange = {handleChange}
            />
        </FormControl>
        <Button
            colorScheme="blue"
            width = "100%"
            style = {{ marginTop: 15 }}
            onClick = {submitHandler}
        >
            Sign Up
        </Button>
    </VStack>
  )
}

export default SignUp