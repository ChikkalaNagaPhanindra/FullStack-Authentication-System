import React, { useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axiosClient from '../../utils/axios';
import { Link } from 'react-router-dom';


function Login() {
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: ""
    })

    function updateFieldData(fieldName, newValue) {
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [fieldName]: newValue
        }))
    }

    async function submitUserDetails() {

        try {

            let response = await axiosClient.post("/login-user", userDetails)
            console.log(response)
            if (response.status == 200) {
                alert("User logged in successfully");
            }
        } catch (error) {
            if (error.response.status == 404) {
                alert("user not found")
            } else if (error.response.status == 401) {
                alert("Password Incorrect");
            } else {
                alert("Network error please try again")
            }
        }
    }





    return (
        <div className='d-flex justify-content-center align-items-center ' style={{ height: "100vh", width: "100vw", backgroundColor: "lightgoldenrodyellow" }}>

            <div className='d-flex' style={{ height: "600px", width: "1000px", padding: "20px", backgroundColor: "rgba(225,225,225,0.5)", boxShadow: "0px 0px 50px 5px black", borderRadius: "20px" }}>
                <div className='signup-left-half w-50' style={{ overflow: "hidden" }}>
                    <img src="/image.png" alt=".." style={{ height: "100%" }} />
                </div>
                <div className='signup-right-half w-50' style={{ border: "1px solid black", padding: "30px", borderRadius: "30px", backgroundColor: "rgba(225,225,225,0.3)" }}>
                    <h1 style={{ color: "blueviolet", textAlign: "center", fontWeight: "bold", margin: "40px 0px" }}>Log In</h1>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" required value={userDetails.email} onChange={(e) => { updateFieldData("email", e.target.value) }} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" required value={userDetails.password} onChange={(e) => { updateFieldData("password", e.target.value) }} />
                        </Form.Group>

                        <Button className='w-100' variant="primary" type="button" onClick={() => { submitUserDetails() }}>
                            Log In
                        </Button>
                    </Form>
                    <Link to ="/forgotPassword">Forgot Password</Link>
                    <p>if you were not registered? <Link to="/">sign-up</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login
