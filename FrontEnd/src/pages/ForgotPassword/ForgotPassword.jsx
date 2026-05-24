import React, { useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axiosClient from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function ForgotPassword() {

    const navigate = useNavigate()

    const [userDetails, setUserDetails] = useState({
        email: "",
        otp: "",
        newPassword: ""
    })
    const [otpSentStatus, setOtpSentStatus] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)

    function updateFieldData(fieldName, newValue) {
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [fieldName]: newValue
        }))
    }

    async function sendOtp() {
        try{
            let response = await axiosClient.post("/forgotPassword", {email : userDetails.email})
            if(response.status==200){
                console.log("otp sent successfuly")
                setOtpSentStatus(true)
            }
        }catch(err){
            if(err.response.status==404){
                alert("Mail doen't exits")
            }
        }
        
    }

    async function verifyOtp() {
        try {
           let response = await axiosClient.post("/verifyOtp",({email : userDetails.email, otp : userDetails.otp}))  
           if(response.status == 200){
            console.log("OTP verified")
            setOtpVerified(true)
           }
        } catch (error) {
            if(error.response.status == 401){
                alert("Invalid OTP, Please enter otp again")
            }else if(error.response.status == 400){
                alert("Verify mail again")
            }
        }
    }

    async function newPassword() {

        try {
           let response = await axiosClient.post("/newPassword",({email : userDetails.email, newPassword : userDetails.newPassword}))  
           if(response.status == 200){
            console.log("New password set successfuly")
            alert("New Password Updated")
            setOtpVerified(true)
            navigate("/login")
           }
        } catch (error) {
            
        }

    }




    return (
        <div className='d-flex justify-content-center align-items-center ' style={{ height: "100vh", width: "100%", backgroundColor: "lightgoldenrodyellow" }}>

            <div className='d-flex' style={{ height: "600px", width: "1000px", padding: "20px", backgroundColor: "rgba(225,225,225,0.5)", boxShadow: "0px 0px 50px 5px black", borderRadius: "20px" }}>
                <div className='signup-left-half w-50' style={{ overflow: "hidden" }}>
                    <img src="/image.png" alt=".." style={{ height: "100%" }} />
                </div>
                <div className='signup-right-half w-50' style={{ border: "1px solid black", padding: "30px", borderRadius: "30px", backgroundColor: "rgba(225,225,225,0.3)" }}>
                    <h1 style={{ color: "blueviolet", textAlign: "center", fontWeight: "bold", margin: "40px 0px" }}>Forgot Password</h1>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" disabled={otpSentStatus} required value={userDetails.email} onChange={(e) => { updateFieldData("email", e.target.value) }} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        {
                            otpSentStatus == false ?
                                <Button className='w-100 btn btn-primary' onClick={sendOtp}>
                                    Send OTP
                                </Button> :


                                <>
                                    <Form.Group className="mb-3" controlId="formBasicOTP">
                                        <Form.Label>Enter OTP</Form.Label>
                                        <Form.Control type="number" placeholder="Enter OTP" required value={userDetails.otp} onChange={(e) => { updateFieldData("otp", e.target.value) }} />
                                    </Form.Group>

                                    {
                                        otpVerified == false ?
                                            <Button className='w-100 btn btn-primary' onClick={verifyOtp}>
                                                Verify OTP
                                            </Button> :

                                            <>
                                                <Form.Group className="mb-3" controlId="formBasicNewPassword">
                                                    <Form.Label>New Password</Form.Label>
                                                    <Form.Control type="password" placeholder="Enter New Password" required value={userDetails.newPassword} onChange={(e) => { updateFieldData("newPassword", e.target.value) }} />
                                                </Form.Group>

                                                <Button className='w-100 btn btn-primary' onClick={newPassword}>
                                                    Set new password
                                                </Button>


                                            </>
                                    }

                                </>


                        }
                    </Form>
                    <p>if you were not registered? <Link to="/">sign-up</Link></p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
