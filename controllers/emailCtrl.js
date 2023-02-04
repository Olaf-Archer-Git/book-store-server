const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "winfield.ferry@ethereal.email",
    pass: "mbhFPtqdG4p7pDxKqK",
  },
});

const meiler = (message) => {
  transporter.sendMail(message, (error, info) => {
    if (error) return console.log(error);
    console.log("email send", info);
  });
};

module.exports = meiler;

// const sendEmail = async (data, req, res) => {
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     auth: {
//       user: "winfield.ferry@ethereal.email",
//       pass: "mbhFPtqdG4p7pDxKqK",
//     },
//   });

//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: data.to, // list of receivers
//     subject: data.subject, // Subject line
//     text: data.text, // plain text body
//     html: data.html, // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// };

// module.exports = sendEmail;
