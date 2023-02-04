const nodemailer = require("nodemailer");

const sendEmail = async (data, req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "olto2012@gmail.com",
      pass: "wznlqhmstllpibnb",
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <email@gmail.com>', // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.html, // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
