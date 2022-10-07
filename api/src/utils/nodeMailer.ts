// @ts-nocheck

import nodemailer from 'nodemailer';
import register from './html/register.js';
// import {google} from 'googleapis';
import nodemailerSendgrid from 'nodemailer-sendgrid'



const createTrans = async () => {
    
    // const oAuth2Client = new google.auth.OAuth2(
    //     process.env.CLIENT_ID,
    //     process.env.CLIENT_SECRET,
    //     process.env.CLIENT_URI,
    // )

    // oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

    try {
        // const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port: 465,
            secure: true,
            auth:{
              user: "eventosapp22@gmail.com",
              pass: process.env.GOOGLE_PASS ,
            }
            
          });
          transport.verify().then( ()=>{
        console.log("Listo para enviar emails");
      });
        return transport;
        
    } catch (error) {
        console.log(error);
    }

    // const transport = nodemailer.createTransport(
    //     nodemailerSendgrid({
    //         apiKey: process.env.NODEMAILER_KEY
    //     })
    // )

    // transport.verify().then( ()=>{
    //     console.log("Listo para enviar emails");
    //   });
}





// const sendMail = async (subject:any, message:any, send_to:string, send_from:string, reply_to:any ) =>{
    const sendMail = async (user:any) =>{

    const transporter = await createTrans()

    await transporter.sendMail({
        from: 'events app <eventosapp22@gmail.com>',
        to: user.email,     //['info@info.com'],send_to, // 1 ó []
        subject: `hola ${user.name}, bienvenido a tu comunidad `,
        html:'<b>hola mundo ! </b>',
    })
    console.log('Mensaje enviado');
    return
    // return options
    // const options = {
    //     from: send_from,
    //     to: send_to, // 1 ó []
    //     reply_to: reply_to,
    //     subject: subject,
    //     html: message,
    // } 

}

export default sendMail;