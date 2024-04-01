import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

import nodemailer from "nodemailer";
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const readMyFileAndReturnPromise = (dirpath: any) => {
  return new Promise((resolve, reject) => {
    fs.readFile(dirpath, { encoding: "utf-8" }, (err, fileRead) => {
      if (err) {
        reject(err);
      }
      resolve(fileRead);
    });
  });
};

// const readFileAndSendEmail = async (
// 	userEmail: string,
// 	emailHeader: string,
// 	dataReplacement: any,
// 	filename: string
// ) => {
// 	console.log("here")
// 	console.log(userEmail, emailHeader, dataReplacement,filename)
// // 	let dirpath = path.join(__dirname, `../views/${filename}.html`)
// // 	let readTheFile = await readMyFileAndReturnPromise(dirpath)
// // 	const template = Handlebars.compile(readTheFile)
// // 	const result = template(dataReplacement)
// // 	const msg = {
// // 		to: userEmail,
// // 		from: process.env.SENDGRID_SENDER_EMAIL, // Use the email address or domain you verified above
// // 		subject: emailHeader,
// // 		html: result,
// // 	};
// // 	sgMail
// // 		.send(msg)
// // 		.then(() => {
// // 			return 'sucesss';
// // 		})
// // 		.catch((err: any) => {
// // 			console.log('error: ', JSON.stringify(err.response.body));
// // 			return 'failed';
// // 		});
// // };
// }

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.G_MAIL,
    pass: process.env.G_MAIL_PASS,
  },
});

const readFileAndSendEmail = async (
  userEmail: string,
  emailHeader: string,
  dataReplacement: any,
  filename: string
) => {
  let dirpath = path.join(__dirname, `../views/${filename}.html`);

  let readTheFile = await readMyFileAndReturnPromise(dirpath);
  const template = Handlebars.compile(readTheFile);
  const result = template(dataReplacement);

  const mailOptions = {
    from: process.env.G_MAIL,
    to: userEmail,
    subject: emailHeader,
    html: result,
  };
  transporter.sendMail(mailOptions, (error: any, info: { response: any }) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

const sendHtmlEmail = (
  receiverEmail: string,
  subject: string,
  message: string,
  link?: string
) => {
  const htmlContent = `<html><body><p>${message}</p></body></html>`;

  const mailOptions = {
    from: process.env.G_MAIL,
    to: receiverEmail,
    subject,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error: any, info: { response: any }) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

// const sendEmail = (subject: string, data: string, toEmail: string): Promise<boolean> => {
// 	return new Promise((resolve, reject) => {
// 		const transporter = nodemailer.createTransport({
// 			service: "Gmail",
// 			host: "smtp.gmail.com",
// 			port: 465,
// 			secure: true,
// 			auth: {
// 			  user: "donleeu04@gmail.com",
// 			  pass: "xbph ohoz egpx jtrq",
// 			},
// 		});
// 	  const mailOptions = {
// 		from: "donleeu04@gmail.com",
// 		to: toEmail,
// 		subject: subject,
// 		html: data,
// 	  };
// 	  transporter.sendMail(mailOptions, (error) => {
// 		if (error) {
// 		  console.error("Error sending mail:", error);
// 		  reject(error);
// 		} else {
// 		  resolve(true);
// 		}
// 	  });
// 	});
//   };

// export { readFileAndSendEmail }

//   let readTheFile = await readMyFileAndReturnPromise(dirpath);

//   const template = Handlebars.compile(readTheFile);

//   const result = template(dataReplacement);

//   const msg = {
//     to: userEmail,
//     from: process.env.SENDGRID_SENDER_EMAIL, // Use the email address or domain you verified above
//     subject: emailHeader,
//     html: result,
//   };
//   await sgMail
//     .send(msg)
//     .then(() => {
//       console.log("success");
//       return "sucesss";
//     })
//     .catch((err: any) => {
//       console.log("error: ", JSON.stringify(err.response.body));
//       return "failed";
//     });
// };
export { readFileAndSendEmail, sendHtmlEmail };
