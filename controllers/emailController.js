const express = require("express");
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
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
const sendMail = async (req, res) => {
  const { name, email } = req.body;
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
                                                                                                    
                                                                                                    <p>We're delighted to announce that <strong>Early Registration Discounts</strong> on tickets will be available soon as a special offer for our early registrants <strong>(registrations that are done till 25th December 2023)</strong>. Take advantage of this opportunity to reserve your spot at a reduced price.</p>
                                                                                                    <p>As you are <strong>Eligible</strong>, remember your credentials to avail discounts on Tickets.</p>
                                                                                                    <p>More information will be emailed out soon along with a comprehensive itinerary of the events and sessions. Keep an eye on your inbox for any updates or changes.</p>
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
    </html>`,
  };
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("email sent: " + info.response);
        resolve(info);
      }
    });
  });
  res.status(200).send({ message: "Mail sent!" });
};

module.exports = { sendMail };
