// Library Imports
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

// User Imports
const {NotFoundError, UserError, ServerError} = require("../utils/errors")
const SuccessResponse = require("../utils/successResponses")
const successHandler = require("./successController")
const { User } = require("../models/userModel");
const CA = require("../models/caModel");

// Nodemailer settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  secure: true,
  secureConnection: false, // TLS requires secureConnection to be false
  tls: {
    ciphers: "SSLv3",
  },
  requireTLS: true,
  port: 465,
  debug: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendSignupMail = asyncHandler(async (name, email) => {
  const userDoc = await User.findOne({ email })

  if (userDoc)
  {
    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Aurora 2024: Registration Done Successfully",
        html: `<html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Aurora 2k24: Registration Succcessfully Done</title>
        </head>
        <body>
        <div dir="ltr">
        <div class="gmail_quote">
            <div dir="ltr">
                <div class="gmail_quote">
                    <div dir="ltr">
                        <div
                            style="width:100%;font-family:helvetica,'helvetica neue',arial,verdana,sans-serif;padding:0;Margin:0">
                            <div style="background-color: rgb(246, 246, 246); --darkreader-inline-bgcolor: #1d2021;"
                                data-darkreader-inline-bgcolor="">
                                <table width="100%" cellspacing="0" cellpadding="0"
                                    style="border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top">
                                    <tbody>
                                        <tr style="border-collapse:collapse">
                                            <td valign="top" style="padding:0;Margin:0">
                                                <table cellpadding="0" cellspacing="0" align="center"
                                                    style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%">
                                                    <tbody>
                                                        <tr style="border-collapse:collapse">
                                                            <td align="center" style="padding:0;Margin:0">
                                                                <table bgcolor="#ffffff" align="center" cellpadding="0"
                                                                    cellspacing="0" width="600"
                                                                    style="border-collapse: collapse; border-spacing: 0px; background-color: rgb(255, 255, 255); --darkreader-inline-bgcolor: #181a1b;"
                                                                    data-darkreader-inline-bgcolor="">
                                                                    <tbody>
                                                                        <tr style="border-collapse:collapse">
                                                                            <td align="left"
                                                                                style="padding: 0px; margin: 0px; background-position: center top; background-color: rgb(32, 36, 71); --darkreader-inline-bgcolor: #1a1d39;"
                                                                                bgcolor="#202447"
                                                                                data-darkreader-inline-bgcolor="">
                                                                                <table cellpadding="0" cellspacing="0"
                                                                                    width="100%"
                                                                                    style="border-collapse:collapse;border-spacing:0px">
                                                                                    <tbody>
                                                                                        <tr
                                                                                            style="border-collapse:collapse">
                                                                                            <td width="600" align="center"
                                                                                                valign="top"
                                                                                                style="padding:0;Margin:0">
                                                                                                <table cellpadding="0"
                                                                                                    cellspacing="0"
                                                                                                    width="100%"
                                                                                                    style="border-collapse:collapse;border-spacing:0px;background-image:url(https://ci4.googleusercontent.com/proxy/NhXozmVRWrzK1LfyjlXSUBWVOcBl2Qb8jq2M8_Rm34fVVcNkHvdaSiUG-WPirIOPf7pKkArLuFMkaehdr4HWXGumLepj9xFWjyXvMhnRkfL0NKY1WklAMpuh5d5fkeiRdG6LjxIMq7UTX0dDq-vFy_eaR_NvBEZdJVpuykPTbOVeXbVycg=s0-d-e1-ft#https://fchlur.stripocdn.email/content/guids/CABINET_ee947024cca57ce15bda9eebe61a6111/images/11001568584963549.png);background-position:left top;background-repeat:no-repeat"
                                                                                                    background="https://ci4.googleusercontent.com/proxy/NhXozmVRWrzK1LfyjlXSUBWVOcBl2Qb8jq2M8_Rm34fVVcNkHvdaSiUG-WPirIOPf7pKkArLuFMkaehdr4HWXGumLepj9xFWjyXvMhnRkfL0NKY1WklAMpuh5d5fkeiRdG6LjxIMq7UTX0dDq-vFy_eaR_NvBEZdJVpuykPTbOVeXbVycg=s0-d-e1-ft#https://fchlur.stripocdn.email/content/guids/CABINET_ee947024cca57ce15bda9eebe61a6111/images/11001568584963549.png">
                                                                                                    <tbody>
                                                                                                        <tr
                                                                                                            style="border-collapse:collapse">
                                                                                                            <td align="center"
                                                                                                                height="100"
                                                                                                                style="padding:0;Margin:0">
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                        <tr
                                                                                                            style="border-collapse:collapse">
                                                                                                            <td align="center"
                                                                                                                style="padding:0;Margin:0;padding-left:40px;padding-right:40px">
                                                                                                                <h1 style="margin: 0px; line-height: 36px; font-family: helvetica, &quot;helvetica neue&quot;, arial, verdana, sans-serif; font-size: 80px; font-style: normal; font-weight: bold; color: rgb(255, 255, 255); --darkreader-inline-color: #e8e6e3;"
                                                                                                                    data-darkreader-inline-color="">
                                                                                                                  Aurora'24
                                                                                                                </h1>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                        <tr
                                                                                                            style="border-collapse:collapse">
                                                                                                            <td align="center"
                                                                                                                height="100"
                                                                                                                style="padding:0;Margin:0">
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse">
                                                                            <td align="left"
                                                                                style="Margin:0;padding-bottom:10px;padding-top:20px;padding-left:20px;padding-right:20px;background-position:center top;font-size: 16;">
                                                                                <table cellpadding="0" cellspacing="0"
                                                                                    width="100%"
                                                                                    style="border-collapse:collapse;border-spacing:0px;">
                                                                                    <tbody>
                                                                                        <tr
                                                                                            style="border-collapse:collapse">
                                                                                            <td width="560" 
                                                                                                valign="top"
                                                                                                style="padding:0;Margin:0">
                                                                                                <table cellpadding="0"
                                                                                                    cellspacing="0"
                                                                                                    width="100%"
                                                                                                    style="border-collapse:collapse;border-spacing:0px;background-position:left top">
                                                                                                    <tbody>
                                                                                                        <p>Hi <strong>${name}</strong>!</p>
                                                                                                        <p>Greetings! Get ready to witness the spectacular dawn of excitement as IIITM Gwalior proudly presents <strong>"Aurora"</strong> — a mesmerizing journey into the heart of creativity, culture, and celebration, here's a sneak peek to ignite your anticipation!</p>
                                                                                                        <p><strong>We are happy to have you as a registered participant, and we can't wait to make this event one you will never forget.</strong></p>
                                                                                                  
                                                                                                        <p>Keep an eye on your inbox for any updates or changes. More information will be emailed out soon along with a comprehensive itinerary of the events and sessions.</p>
                                                                                                        <p>If you have any questions or concerns leading up to the fest, feel free to reach out to our dedicated support team at support@aurorafest.in</p>
                                                                                                        
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table cellpadding="0" cellspacing="0" align="center"
                                                    style="border-collapse: collapse; border-spacing: 0px; width: 100%; background-color: transparent; background-repeat: repeat; background-position: center top; table-layout: fixed !important; --darkreader-inline-bgcolor: transparent;"
                                                    data-darkreader-inline-bgcolor="">
                                                    <tbody>
                                                        <tr style="border-collapse:collapse">
                                                            <td align="center" style="padding:0;Margin:0">
                                                                <table bgcolor="#ffffff" align="center" cellpadding="0"
                                                                    cellspacing="0" width="600"
                                                                    style="border-collapse: collapse; border-spacing: 0px; background-color: rgb(255, 255, 255); --darkreader-inline-bgcolor: #181a1b;"
                                                                    data-darkreader-inline-bgcolor="">
                                                                    <tbody>
                                                                        <tr style="border-collapse:collapse">
                                                                            <td align="left"
                                                                                style="margin: 0px; padding: 20px; background-image: url(&quot;https://ci6.googleusercontent.com/proxy/-_Omt66JN29yiEMFHl3kOdNiHkR02_Fmi_ke47NVtj9CxylUcKqxvQAPp3ocARaYLkYEj5lXRiJvKqoCKvc52smoVuc3VoRXybtv9WCvB7Egf4tqOrtg-qUHT7KaCHGOLppg8nTYTxK1uvPYi9RuvNXW16rtfLZARkF9OKYJBkNsYPdo3Q=s0-d-e1-ft#https://fchlur.stripocdn.email/content/guids/CABINET_ee947024cca57ce15bda9eebe61a6111/images/63821564496145694.jpg&quot;); background-position: left top; background-repeat: no-repeat; background-color: rgb(51, 51, 51); --darkreader-inline-bgcolor: #262a2b;"
                                                                                background="https://ci6.googleusercontent.com/proxy/-_Omt66JN29yiEMFHl3kOdNiHkR02_Fmi_ke47NVtj9CxylUcKqxvQAPp3ocARaYLkYEj5lXRiJvKqoCKvc52smoVuc3VoRXybtv9WCvB7Egf4tqOrtg-qUHT7KaCHGOLppg8nTYTxK1uvPYi9RuvNXW16rtfLZARkF9OKYJBkNsYPdo3Q=s0-d-e1-ft#https://fchlur.stripocdn.email/content/guids/CABINET_ee947024cca57ce15bda9eebe61a6111/images/63821564496145694.jpg"
                                                                                bgcolor="#333333"
                                                                                data-darkreader-inline-bgcolor="">
    
                                                                                <table cellpadding="0" cellspacing="0"
                                                                                    align="left"
                                                                                    style="border-collapse:collapse;border-spacing:0px;float:left">
                                                                                    <tbody>
                                                                                        <tr
                                                                                            style="border-collapse:collapse">
                                                                                            <td width="368" align="left"
                                                                                                style="padding:0;Margin:0">
                                                                                                <table cellpadding="0"
                                                                                                    cellspacing="0"
                                                                                                    width="100%"
                                                                                                    style="border-collapse:collapse;border-spacing:0px">
                                                                                                    <tbody>
                                                                                                        <tr
                                                                                                            style="border-collapse:collapse">
                                                                                                            <td align="left"
                                                                                                                style="padding:0;Margin:0">
                                                                                                                <p style="margin: 0px; font-size: 14px; font-family: helvetica, &quot;helvetica neue&quot;, arial, verdana, sans-serif; line-height: 21px; color: rgb(255, 255, 255); --darkreader-inline-color: #e8e6e3;"
                                                                                                                    data-darkreader-inline-color="">
                                                                                                                    <strong>Looking
                                                                                                                        forward,</strong>
                                                                                                                </p>
                                                                                                                <p style="margin: 0px; font-size: 14px; font-family: helvetica, &quot;helvetica neue&quot;, arial, verdana, sans-serif; line-height: 21px; color: rgb(255, 255, 255); --darkreader-inline-color: #e8e6e3;"
                                                                                                                    data-darkreader-inline-color="">
                                                                                                                    <strong
                                                                                                                        style="text-align:center">Team
                                                                                                                        Aurora</strong>
                                                                                                                </p>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
    
                                                                                <table cellpadding="0" cellspacing="0"
                                                                                    align="right"
                                                                                    style="border-collapse:collapse;border-spacing:0px;float:right;background-position:left top">
                                                                                    <tbody>
                                                                                        <tr
                                                                                            style="border-collapse:collapse">
                                                                                            <td width="172" align="left"
                                                                                                style="padding:0;Margin:0">
                                                                                                <table cellpadding="0"
                                                                                                    cellspacing="0"
                                                                                                    width="100%"
                                                                                                    style="border-collapse:collapse;border-spacing:0px">
                                                                                                    <tbody>
                                                                                                        <tr
                                                                                                            style="border-collapse:collapse">
                                                                                                            <td align="right"
                                                                                                                style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px">
                                                                                                                <table
                                                                                                                    cellpadding="0"
                                                                                                                    cellspacing="0"
                                                                                                                    style="border-collapse:collapse;border-spacing:0px">
                                                                                                                    <tbody>
                                                                                                                        <tr
                                                                                                                            style="border-collapse:collapse">
                                                                                                                            <td align="center"
                                                                                                                                valign="top"
                                                                                                                                style="padding:0;Margin:0;padding-right:10px">
                                                                                                                                <a href="https://www.facebook.com/auroraiiitm/"
                                                                                                                                    style="font-family: helvetica, &quot;helvetica neue&quot;, arial, verdana, sans-serif; font-size: 14px; text-decoration: underline; color: rgb(255, 255, 255); --darkreader-inline-color: #e8e6e3;"
                                                                                                                                    target="_blank"
                                                                                                                                    data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/auroraiiitm/&amp;source=gmail&amp;ust=1699289497685000&amp;usg=AOvVaw0TcNv1bljaOV5AZODEzkvM"
                                                                                                                                    data-darkreader-inline-color=""><img
                                                                                                                                        title="Facebook"
                                                                                                                                        src="https://ci3.googleusercontent.com/proxy/U4yMBLrWs4tJdM6NjoZq18fLZ00uLCPAgoIsEnHTdNpBbbUFbzxgGjezsUtgZgQb7Z4nq7qiw02NpzZH31ca2TR0ajFYwM30rT2mPk8x5WjRjEN_DuQdb-ZRztEUN0GQDFuwJ7pO9WGaLmqBhltFnZPEoZHmvEtBhYPXNw=s0-d-e1-ft#https://fchlur.stripocdn.email/content/assets/img/social-icons/circle-colored/facebook-circle-colored.png"
                                                                                                                                        alt="Fb"
                                                                                                                                        width="24"
                                                                                                                                        height="24"
                                                                                                                                        style="display: block; border: 0px; outline: none; text-decoration: none; --darkreader-inline-border-top: initial; --darkreader-inline-border-right: initial; --darkreader-inline-border-bottom: initial; --darkreader-inline-border-left: initial; --darkreader-inline-outline: initial;"
                                                                                                                                        class="CToWUd"
                                                                                                                                        data-bit="iit"
                                                                                                                                        data-darkreader-inline-border-top=""
                                                                                                                                        data-darkreader-inline-border-right=""
                                                                                                                                        data-darkreader-inline-border-bottom=""
                                                                                                                                        data-darkreader-inline-border-left=""
                                                                                                                                        data-darkreader-inline-outline=""></a>
                                                                                                                            </td>
                                                                                                                            <td align="center"
                                                                                                                                valign="top"
                                                                                                                                style="padding:0;Margin:0;padding-right:10px">
                                                                                                                                <a href="https://www.instagram.com/aurora_iiitm"
                                                                                                                                    style="font-family: helvetica, &quot;helvetica neue&quot;, arial, verdana, sans-serif; font-size: 14px; text-decoration: underline; color: rgb(255, 255, 255); --darkreader-inline-color: #e8e6e3;"
                                                                                                                                    target="_blank"
                                                                                                                                    data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/aurora_iiitm&amp;source=gmail&amp;ust=1699289497685000&amp;usg=AOvVaw2zbJsElvR8EOwmiRIWxPJj"
                                                                                                                                    data-darkreader-inline-color=""><img
                                                                                                                                        title="Instagram"
                                                                                                                                        src="https://ci4.googleusercontent.com/proxy/puh1O4WTkUPWtUSp6GjorWVfH1BErayDBNvVkL5gQQYhSmHnpjQTpeoA8svFXRcfoRWAgJL7d2i-dCCgKnpaVNDEUUsZhZpJ8K-JFP4Xeb9OMQF-NTXYPWPVtbzjxYCbT668xt6sYaxXzg7aLXSRzyZ4V_EsHzJSsteUaNE=s0-d-e1-ft#https://fchlur.stripocdn.email/content/assets/img/social-icons/circle-colored/instagram-circle-colored.png"
                                                                                                                                        alt="Ig"
                                                                                                                                        width="24"
                                                                                                                                        height="24"
                                                                                                                                        style="display: block; border: 0px; outline: none; text-decoration: none; --darkreader-inline-border-top: initial; --darkreader-inline-border-right: initial; --darkreader-inline-border-bottom: initial; --darkreader-inline-border-left: initial; --darkreader-inline-outline: initial;"
                                                                                                                                        class="CToWUd"
                                                                                                                                        data-bit="iit"
                                                                                                                                        data-darkreader-inline-border-top=""
                                                                                                                                        data-darkreader-inline-border-right=""
                                                                                                                                        data-darkreader-inline-border-bottom=""
                                                                                                                                        data-darkreader-inline-border-left=""
                                                                                                                                        data-darkreader-inline-outline=""></a>
                                                                                                                            </td>
                                                                                                                        
                                                                                                                            <td align="center"
                                                                                                                                valign="top"
                                                                                                                                style="padding:0;Margin:0">
                                                                                                                                <a href="mailto:support@aurorafest.in"
                                                                                                                                    style="font-family: helvetica, &quot;helvetica neue&quot;, arial, verdana, sans-serif; font-size: 14px; text-decoration: underline; color: rgb(255, 255, 255); --darkreader-inline-color: #e8e6e3;"
                                                                                                                                    target="_blank"
                                                                                                                                    data-darkreader-inline-color=""><img
                                                                                                                                        title="Email"
                                                                                                                                        src="https://ci3.googleusercontent.com/proxy/FdZZaLDHLUoewcslZVznwFLJfKD-Lby78kd4nYavA0yYyCRrVMRMDtfKqbf3EiA3P19SeXdsqDZ8NdkLdCU4lvX3qQSNn2oGRV-XxLd0X8UqeD_-YxzV5HHVkWxngJhsf3RiVDTaXFnNgB4tkbrXrLbcqcYIqZY=s0-d-e1-ft#https://fchlur.stripocdn.email/content/assets/img/other-icons/circle-colored/mail-circle-colored.png"
                                                                                                                                        alt="Email"
                                                                                                                                        width="24"
                                                                                                                                        height="24"
                                                                                                                                        style="display: block; border: 0px; outline: none; text-decoration: none; --darkreader-inline-border-top: initial; --darkreader-inline-border-right: initial; --darkreader-inline-border-bottom: initial; --darkreader-inline-border-left: initial; --darkreader-inline-outline: initial;"
                                                                                                                                        class="CToWUd"
                                                                                                                                        data-bit="iit"
                                                                                                                                        data-darkreader-inline-border-top=""
                                                                                                                                        data-darkreader-inline-border-right=""
                                                                                                                                        data-darkreader-inline-border-bottom=""
                                                                                                                                        data-darkreader-inline-border-left=""
                                                                                                                                        data-darkreader-inline-outline=""></a>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                    </tbody>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="yj6qo"></div>
                                <div class="adL">
                                </div>
                            </div>
                            <div class="adL">
                            </div>
                        </div>
                        <div class="adL">
                        </div>
                    </div>
                    <div class="adL">
                    </div>
                </div>
            </div>
            <div class="adL">
            </div>
        </div>
    </div>
        </body>
        </html>`
    };
    
    try {
      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            reject(error);
          } else {
            console.log("Email sent: " + info.response);
            resolve(info);
          }
        });
      });
    } catch (error) {
      throw new Error(error)
    }
  }
  else { throw new Error("User not found!") }
})

const sendSignupMailCa = asyncHandler(async (name, email, referralCode) => {
  const caDoc = await CA.findOne({ email })

  if (caDoc)
  {
    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Aurora 2024: Registration Done Successfully",
        html: `<!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
          <title>
          </title>
          <!--[if !mso]><!-->
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <!--<![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
            #outlook a {
              padding: 0;
            }
        
            body {
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
        
            table,
            td {
              border-collapse: collapse;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }
        
            img {
              border: 0;
              height: auto;
              line-height: 100%;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
            }
        
            p {
              display: block;
              margin: 13px 0;
            }
          </style>
          <!--[if mso]>
                <noscript>
                <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                </noscript>
                <![endif]-->
          <!--[if lte mso 11]>
                <style type="text/css">
                  .mj-outlook-group-fix { width:100% !important; }
                </style>
                <![endif]-->
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700" rel="stylesheet" type="text/css">
          <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700);
          </style>
          <!--<![endif]-->
          <style type="text/css">
            @media only screen and (min-width:480px) {
              .mj-column-per-100 {
                width: 100% !important;
                max-width: 100%;
              }
            }
          </style>
          <style media="screen and (min-width:480px)">
            .moz-text-html .mj-column-per-100 {
              width: 100% !important;
              max-width: 100%;
            }
          </style>
          <style type="text/css">
            @media only screen and (max-width:480px) {
              table.mj-full-width-mobile {
                width: 100% !important;
              }
        
              td.mj-full-width-mobile {
                width: auto !important;
              }
            }
          </style>
        </head>
        
        <body style="word-spacing:normal;background-color:#121212;">
          <div style="background-color:#121212;">
            <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
            <div style="margin:0px auto;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                <tbody>
                  <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
                      <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                      <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                          <tbody>
                            <tr>
                              <td align="center" style="font-size:0px;padding:25px;word-break:break-word;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                  <tbody>
                                    <tr>
                                      <td style="width:550px;">
                                        <img height="auto" src="https://i.ibb.co/N1sMssQ/Aurora-Email-Logo.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="550" />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <!--[if mso | IE]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#121212" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
            <div style="background:#121212;background-color:#121212;margin:0px auto;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#121212;background-color:#121212;width:100%;">
                <tbody>
                  <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
                      <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                      <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                          <tbody>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                                <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;"><span>Hello, ${ name }</span></div>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                                <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;">Get ready to witness the spectacular dawn of excitement as IIITM Gwalior proudly presents "Aurora" — a mesmerizing journey into the heart of creativity, culture, and celebration, here's a sneak peek to ignite your anticipation! We are happy to have you as a registered campus ambassador. Your referral code is:</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;letter-spacing:7px;line-height:1;text-align:center;color:#864ecf;">${ referralCode }</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;padding-right:16px;padding-left:25px;word-break:break-word;">
                                <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;">We're thrilled to see you bring your friends and family to the fest! As a valued Campus Ambassador, you're entitled to exclusive perks that will enhance your fest experience tenfold!</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style="font-size:0px;padding:10px 25px;padding-right:16px;padding-left:25px;word-break:break-word;">
                                <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;">If you have any concerns or questions leading up to the fest, feel free to reach out to the dedicated support team at support@aurorafest.in</div>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                                <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:white;">Team Aurora</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <!--[if mso | IE]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]></td></tr></table><![endif]-->
          </div>
        </body>
        
        </html>`
    };
    
    try {
      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            reject(error);
          } else {
            console.log("Email sent: " + info.response);
            resolve(info);
          }
        });
      });
    } catch (error) {
      throw new Error(error)
    }
  }
  else { throw new Error("User not found!") }
})

const sendForgotPassMail = async (email, name, code) => {
    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Aurora 2024: Password Reset",
      html: `<!doctype html>
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      
      <head>
        <title>
        </title>
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          #outlook a {
            padding: 0;
          }
      
          body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
      
          table,
          td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
      
          img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
          }
      
          p {
            display: block;
            margin: 13px 0;
          }
        </style>
        <!--[if mso]>
              <noscript>
              <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
              </xml>
              </noscript>
              <![endif]-->
        <!--[if lte mso 11]>
              <style type="text/css">
                .mj-outlook-group-fix { width:100% !important; }
              </style>
              <![endif]-->
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700);
        </style>
        <!--<![endif]-->
        <style type="text/css">
          @media only screen and (min-width:480px) {
            .mj-column-per-100 {
              width: 100% !important;
              max-width: 100%;
            }
          }
        </style>
        <style media="screen and (min-width:480px)">
          .moz-text-html .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
          }
        </style>
        <style type="text/css">
          @media only screen and (max-width:480px) {
            table.mj-full-width-mobile {
              width: 100% !important;
            }
      
            td.mj-full-width-mobile {
              width: auto !important;
            }
          }
        </style>
      </head>
      
      <body style="word-spacing:normal;background-color:#121212;">
        <div style="background-color:#121212;">
          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
          <div style="margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
              <tbody>
                <tr>
                  <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
                    <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                        <tbody>
                          <tr>
                            <td align="center" style="font-size:0px;padding:25px;word-break:break-word;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                <tbody>
                                  <tr>
                                    <td style="width:550px;">
                                      <img height="auto" src="https://i.ibb.co/x1fhhx1/Aurora-Email-Logo.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="550" />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#121212" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
          <div style="background:#121212;background-color:#121212;margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#121212;background-color:#121212;width:100%;">
              <tbody>
                <tr>
                  <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
                    <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                        <tbody>
                          <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                              <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:white;"><span>Hello, ${ name }</span></div>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                              <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:white;">Your password has been reset, please use the new password to login:</div>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                              <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;letter-spacing:7px;line-height:1;text-align:center;color:#864ecf;">${ code }</div>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;padding-right:16px;padding-left:25px;word-break:break-word;">
                              <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:white;">If you didn't request this, you can ignore this email or let us know.</div>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                              <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:white;">Aurora Team</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!--[if mso | IE]></td></tr></table><![endif]-->
        </div>
      </body>
      
      </html>`
    };
    
    try {
      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            reject(error);
          } else {
            console.log("Email sent: " + info.response);
            resolve(info);
          }
        });
      });
    } catch (error) {
      throw error
    }
}

const sendQRMail = async (name, email, image, code, receiptId) => {
  const subject = receiptId ? `Welcome to Aurora '24 | Payment Intent Received!`: "Aurora Ticket";
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: `<!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
      <title>
      </title>
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        #outlook a {
          padding: 0;
        }
    
        body {
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
    
        table,
        td {
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
    
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
        }
    
        p {
          display: block;
          margin: 13px 0;
        }
      </style>
      <!--[if mso]>
            <noscript>
            <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
            </noscript>
            <![endif]-->
      <!--[if lte mso 11]>
            <style type="text/css">
              .mj-outlook-group-fix { width:100% !important; }
            </style>
            <![endif]-->
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700" rel="stylesheet" type="text/css">
      <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700);
      </style>
      <!--<![endif]-->
      <style type="text/css">
        @media only screen and (min-width:480px) {
          .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
          }
        }
      </style>
      <style media="screen and (min-width:480px)">
        .moz-text-html .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }
      </style>
      <style type="text/css">
        @media only screen and (max-width:480px) {
          table.mj-full-width-mobile {
            width: 100% !important;
          }
    
          td.mj-full-width-mobile {
            width: auto !important;
          }
        }
      </style>
    </head>
    
    <body style="word-spacing:normal;background-color:#121212;">
      <div style="background-color:#121212;">
        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" style="font-size:0px;padding:25px;word-break:break-word;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                              <tbody>
                                <tr>
                                  <td style="width:550px;">
                                    <img height="auto" src="https://i.ibb.co/x1fhhx1/Aurora-Email-Logo.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="550" />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#121212" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background:#121212;background-color:#121212;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#121212;background-color:#121212;width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:white;"><span>Hello, ${ name }</span></div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:white;">Your ticket has been generated and is attached to this email. Please remember the following ticket code in case you lose the ticket:</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;letter-spacing:7px;line-height:1;text-align:center;color:#864ecf;">${ code }</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;padding-right:16px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:white;">You can always regenerate the ticket by logging in to the official site. Please ensure that you have the ticket code or the ticket on your person as it will be checked before entry to the event.</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:white;">Aurora Team</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><![endif]-->
      </div>
    </body>
    
    </html>`,
    attachments: [{
      filename: 'ticket.png',
      content: image,
      contentType: 'image/png'
    }]
  };
  
  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve(info);
        }
      });
    });
  } catch (error) {
    throw error
  }
}

const sendConfirmation = async (name, email, image, ticketCode, receiptId) => {
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Payment approved | Welcome to Aurora '24`,
    html: `<!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
      <title>
      </title>
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        #outlook a {
          padding: 0;
        }
    
        body {
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
    
        table,
        td {
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
    
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
        }
    
        p {
          display: block;
          margin: 13px 0;
        }
      </style>
      <!--[if mso]>
            <noscript>
            <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
            </noscript>
            <![endif]-->
      <!--[if lte mso 11]>
            <style type="text/css">
              .mj-outlook-group-fix { width:100% !important; }
            </style>
            <![endif]-->
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700" rel="stylesheet" type="text/css">
      <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700);
      </style>
      <!--<![endif]-->
      <style type="text/css">
        @media only screen and (min-width:480px) {
          .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
          }
        }
      </style>
      <style media="screen and (min-width:480px)">
        .moz-text-html .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }
      </style>
      <style type="text/css">
        @media only screen and (max-width:480px) {
          table.mj-full-width-mobile {
            width: 100% !important;
          }
    
          td.mj-full-width-mobile {
            width: auto !important;
          }
        }
      </style>
    </head>
    
    <body style="word-spacing:normal;background-color:#121212;">
      <div style="background-color:#121212;">
        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" style="font-size:0px;padding:25px;word-break:break-word;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                              <tbody>
                                <tr>
                                  <td style="width:550px;">
                                    <img height="auto" src="https://i.ibb.co/N1sMssQ/Aurora-Email-Logo.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="550" />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#121212" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background:#121212;background-color:#121212;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#121212;background-color:#121212;width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                      <tbody>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;"><span>Hello, ${ name }</span></div>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;">Your payment has been reviewed and approved. Your ticket code for the event is:</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;letter-spacing:7px;line-height:1;text-align:center;color:#864ecf;">${ ticketCode }</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;">Your receipt ID is given below. Please keep this as a reference in case your payment status has to be checked.</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;line-height:1;text-align:center;color:#864ecf;">${ receiptId }</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;padding-right:16px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;">We're thrilled for you to be a confirmed attendee and hope that you will enjoy the fest!</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;padding-right:16px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;">If you have any concerns or questions leading up to the fest, feel free to reach out to the dedicated support team at support@aurorafest.in</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:white;">Team Aurora</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><![endif]-->
      </div>
    </body>
    
    </html>`,
    attachments: [{
      filename: 'ticket.png',
      content: image,
      contentType: 'image/png'
    }]
  };
  
  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve(info);
        }
      });
    });
  } catch (error) {
    throw error
  }
}


const sendEventConfirmation = async (name, email, image, ticketCode, eventName, receiptId) => {
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `You have successfully registered for ${eventName} | Aurora '24`,
    html: `<!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
      <title>
      </title>
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        #outlook a {
          padding: 0;
        }
    
        body {
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
    
        table,
        td {
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
    
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
        }
    
        p {
          display: block;
          margin: 13px 0;
        }
      </style>
      <!--[if mso]>
            <noscript>
            <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
            </noscript>
            <![endif]-->
      <!--[if lte mso 11]>
            <style type="text/css">
              .mj-outlook-group-fix { width:100% !important; }
            </style>
            <![endif]-->
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700" rel="stylesheet" type="text/css">
      <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700);
      </style>
      <!--<![endif]-->
      <style type="text/css">
        @media only screen and (min-width:480px) {
          .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
          }
        }
      </style>
      <style media="screen and (min-width:480px)">
        .moz-text-html .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }
      </style>
      <style type="text/css">
        @media only screen and (max-width:480px) {
          table.mj-full-width-mobile {
            width: 100% !important;
          }
    
          td.mj-full-width-mobile {
            width: auto !important;
          }
        }
      </style>
    </head>
    
    <body style="word-spacing:normal;background-color:#121212;">
      <div style="background-color:#121212;">
        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" style="font-size:0px;padding:25px;word-break:break-word;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                              <tbody>
                                <tr>
                                  <td style="width:550px;">
                                    <img height="auto" src="https://i.ibb.co/N1sMssQ/Aurora-Email-Logo.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="550" />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#121212" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background:#121212;background-color:#121212;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#121212;background-color:#121212;width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                      <tbody>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;"><span>Hello, ${ name }</span></div>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;">Your payment has been reviewed and approved. Your participation is now confirmed for ${eventName }. Your ticket code for the event is:</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;letter-spacing:7px;line-height:1;text-align:center;color:#864ecf;">${ ticketCode }</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;">Your receipt ID is given below. Please keep this as a reference in case your payment status has to be checked.</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;line-height:1;text-align:center;color:#864ecf;">${ receiptId }</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;padding-right:16px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;">We're thrilled for you to be a confirmed participant and hope that you will enjoy the fest!</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;padding-right:16px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;">If you have any concerns or questions leading up to the fest, feel free to reach out to the dedicated support team at support@aurorafest.in</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:white;">Team Aurora</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><![endif]-->
      </div>
    </body>
    
    </html>`,
    attachments: [{
      filename: 'ticket.png',
      content: image,
      contentType: 'image/png'
    }]
  };
  
  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve(info);
        }
      });
    });
  } catch (error) {
    throw error
  }
}

const sendDenial = async (name, email, receiptId) => {
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Payment denied | Aurora '24`,
    html: `<!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
      <title>
      </title>
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        #outlook a {
          padding: 0;
        }
    
        body {
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
    
        table,
        td {
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
    
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
        }
    
        p {
          display: block;
          margin: 13px 0;
        }
      </style>
      <!--[if mso]>
            <noscript>
            <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
            </noscript>
            <![endif]-->
      <!--[if lte mso 11]>
            <style type="text/css">
              .mj-outlook-group-fix { width:100% !important; }
            </style>
            <![endif]-->
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700" rel="stylesheet" type="text/css">
      <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700);
      </style>
      <!--<![endif]-->
      <style type="text/css">
        @media only screen and (min-width:480px) {
          .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
          }
        }
      </style>
      <style media="screen and (min-width:480px)">
        .moz-text-html .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }
      </style>
      <style type="text/css">
        @media only screen and (max-width:480px) {
          table.mj-full-width-mobile {
            width: 100% !important;
          }
    
          td.mj-full-width-mobile {
            width: auto !important;
          }
        }
      </style>
    </head>
    
    <body style="word-spacing:normal;background-color:#121212;">
      <div style="background-color:#121212;">
        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" style="font-size:0px;padding:25px;word-break:break-word;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                              <tbody>
                                <tr>
                                  <td style="width:550px;">
                                    <img height="auto" src="https://i.ibb.co/N1sMssQ/Aurora-Email-Logo.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="550" />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#121212" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background:#121212;background-color:#121212;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#121212;background-color:#121212;width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                      <tbody>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;"><span>Hello, ${ name }</span></div>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;">We regret to inform you that your payment has been denied. You can contest this denial by contacting us if you have a valid claim. Please keep in mind that no refund requests will be entertained. Please use the following receipt ID when contacting us:</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;line-height:1;text-align:center;color:#864ecf;">${ receiptId }</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size:0px;padding:10px 25px;padding-right:16px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:left;color:white;">Feel free to contact our dedicated support team at support@aurorafest.in</div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
                            <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:white;">Team Aurora</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><![endif]-->
      </div>
    </body>
    
    </html>`,
  };
  
  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve(info);
        }
      });
    });
  } catch (error) {
    throw error
  }
}

module.exports = { 
  sendSignupMail, 
  sendSignupMailCa, 
  sendForgotPassMail, 
  sendQRMail, 
  sendConfirmation,
  sendEventConfirmation,
  sendDenial
};
