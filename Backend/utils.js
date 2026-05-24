import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});


export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
export const currentOtps = {}

export const sendMail = async (email, otp) => {
    
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Email to be sent", email)
            const otpStatus = await transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: "OTP for setting new password",
                html: `<h1>Hi, this is our otp : ${otp} to reset your password. please don't share with anyone</h1>`

            })
            resolve('otp sent successful')
        } catch {
            reject ('could not send otp')
        }
    })

}