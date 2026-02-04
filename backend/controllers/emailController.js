const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
  port: 587,          // ← REQUIRED
  secure: false,
 auth: {
   user: "keithmbofana1@gmail.com",
   pass: "qmis uxvn rjpt hwgl", // NOT your Gmail password
 },
   tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 20_000, // 20 seconds
  greetingTimeout: 20_000,
  socketTimeout: 20_000,
});
const sendEmail= async(req, res) => {

  try {
    const {firstName, lastName, email, phone, date, meetingDetails} = req.body;
    const info = await transporter.sendMail({
      from: `My App" <${email}>`,
      to: "anesumbofana@gmail.com",
      subject: "PROJECT MEETING SCHEDULE",
      text: `
      Full Name:${firstName} ${lastName}\n
      Phone: ${phone}\n
      date:${date}\n
      Meeting Details\n
      ${meetingDetails}
      `,
      html: "<b>Send from web app</b>",
    });

    console.log("Email sent:", info.messageId);
    res.status(200).json({message:'message sent'})
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({message:'failed to send message'})
  }

  
};


module.exports ={
    sendEmail
}