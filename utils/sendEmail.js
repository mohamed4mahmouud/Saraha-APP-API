import nodeoutlook from "nodejs-nodemailer-outlook";

const sendEmail = (dest, message) => {
  nodeoutlook.sendEmail({
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    from: process.env.EMAIL_USERNAME,
    to: dest,
    subject: "Hey you, awesome!",
    html: message,
    onError: (e) => console.log(e),
    onSuccess: (i) => console.log(i),
  });
};

export default sendEmail;
