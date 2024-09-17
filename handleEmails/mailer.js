const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: "opencommunitytest@gmail.com",
    // pass: "opencommunity123",

    user: "color6wrld@gmail.com",
    pass: "gyva yaxg ddia ouns",
  },
});

const sendRsvpEmail = (event, emailList) => {
  // Destructure the event object to get relevant details
  const { eventName, RsvpEndTime } = event;

  // Convert RsvpEndTime from Timestamp to a readable format
  const deadline = new Date(RsvpEndTime.seconds * 1000).toLocaleString();

  emailList.forEach((person) => {
    const { name, email } = person;

    // Customize the email message for each person with HTML content
    const mailOptions = {
      from: "color6wrld@gmail.com",
      to: email,
      subject: `Event RSVP Reminder - ${eventName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #bcd727;">Hey ${name},</h2>
          <p>You have not RSVPd for the event "<strong>${eventName}</strong>".</p>
          <p>The RSVP deadline is on <strong>${deadline}</strong>.</p>
          <p style="margin-top: 20px;">
            <a href="https://localhost:3000/Home/community/sfjNQtaUvxfoDNCFacvn" 
               style="
                 background-color: #bcd727;
                 color: white;
                 padding: 10px 20px;
                 text-decoration: none;
                 border-radius: 5px;
                 display: inline-block;
                 font-weight: bold;
               ">
               RSVP Now
            </a>
          </p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The Admin</p>
        </div>
      `,
    };

    // Assuming 'transporter' is already configured and available in your scope
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(`Error sending email to ${email}:`, error);
      }
      console.log(`Email sent to ${email}: ${info.response}`);
    });
  });
};

const sendEventStartReminder = (event, emailList) => {
  // Destructure the event object to get relevant details
  const { eventName, RsvpEndTime } = event;

  // Convert RsvpEndTime from Timestamp to a readable format
  const deadline = new Date(RsvpEndTime.seconds * 1000).toLocaleString();

  emailList.forEach((person) => {
    const { name, email } = person;

    // Customize the email message for each person with HTML content
    const mailOptions = {
      from: "color6wrld@gmail.com",
      to: email,
      subject: `Event Start Reminder - ${eventName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #bcd727;">Hey ${name},</h2>
          <p>"<strong>${eventName}</strong>" is going to start in 24 hours. The event is at ${event.Location}.</p>
          <p>For more information about the event, please click the button below.</p>
          <p style="margin-top: 20px;">
            <a href="https://localhost:3000/Home/community/sfjNQtaUvxfoDNCFacvn" 
               style="
                 background-color: #bcd727;
                 color: white;
                 padding: 10px 20px;
                 text-decoration: none;
                 border-radius: 5px;
                 display: inline-block;
                 font-weight: bold;
               ">
               View more.
            </a>
          </p>
          <p>If you have any questions, feel free to post on the community chat.</p>
              <p style="margin-top: 20px;">
            <a href="https://localhost:3000/Home/community/sfjNQtaUvxfoDNCFacvn" 
               style="
                 background-color: #0000FF;
                 color: white;
                 padding: 10px 20px;
                 text-decoration: none;
                 border-radius: 5px;
                 display: inline-block;
                 font-weight: bold;
               ">
               Commmunity Chat.
            </a>
          </p>
          <p>Best regards,<br>The Admin</p>
        </div>
      `,
    };

    // Assuming 'transporter' is already configured and available in your scope
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(`Error sending email to ${email}:`, error);
      }
      console.log(`Email sent to ${email}: ${info.response}`);
    });
  });
};
const sendEventCommentReminder = (event, emailList) => {
  // Destructure the event object to get relevant details
  const { eventName, RsvpEndTime } = event;

  // Convert RsvpEndTime from Timestamp to a readable format
  const deadline = new Date(RsvpEndTime.seconds * 1000).toLocaleString();

  emailList.forEach((person) => {
    const { name, email } = person;

    // Customize the email message for each person with HTML content
    const mailOptions = {
      from: "color6wrld@gmail.com",
      to: email,
      subject: `Rate & Comment Reminder - ${eventName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #bcd727;">Hey ${name},</h2>
          <p>Thank you for attending "<strong>${eventName}</strong>".</p>
          <p>Please rate the event, and leave a comment.</p>
          <p style="margin-top: 20px;">
            <a href="https://localhost:3000/Home/community/sfjNQtaUvxfoDNCFacvn" 
               style="
                 background-color: #bcd727;
                 color: white;
                 padding: 10px 20px;
                 text-decoration: none;
                 border-radius: 5px;
                 display: inline-block;
                 font-weight: bold;
               ">
               rate & leave a comment.
            </a>
          </p>
          <p>Best regards,<br>The Admin</p>
        </div>
      `,
    };

    // Assuming 'transporter' is already configured and available in your scope
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(`Error sending email to ${email}:`, error);
      }
      console.log(`Email sent to ${email}: ${info.response}`);
    });
  });
};

//runs when the poll is created
const sendPollStartReminder = (community, emailList) => {
  //const { name } = community;

  emailList.forEach((person) => {
    const { name, email } = person;

    // Customize the email message for each person with HTML content
    const mailOptions = {
      from: "color6wrld@gmail.com",
      to: email,
      subject: `New Poll - ${community.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #bcd727;">Hey ${name},</h2>
          <p>"<strong>${community.name}</strong>" just uploaded a new poll. Please click the button to vote.</p>
          
          <p style="margin-top: 20px;">
            <a href="https://localhost:3000/Home/community/sfjNQtaUvxfoDNCFacvn" 
               style="
                 background-color: #bcd727;
                 color: white;
                 padding: 10px 20px;
                 text-decoration: none;
                 border-radius: 5px;
                 display: inline-block;
                 font-weight: bold;
               ">
               Vote.
            </a>
          </p>
          <p>If you have any questions, feel free to post on the community chat.</p>
              <p style="margin-top: 20px;">
            <a href="${community.WebUrl}" 
               style="
                 background-color: #0000FF;
                 color: white;
                 padding: 10px 20px;
                 text-decoration: none;
                 border-radius: 5px;
                 display: inline-block;
                 font-weight: bold;
               ">
               Commmunity Chat.
            </a>
          </p>
          <p>Best regards,<br>The Admin</p>
        </div>
      `,
    };

    // Assuming 'transporter' is already configured and available in your scope
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(`Error sending email to ${email}:`, error);
      }
      console.log(`Email sent to ${email}: ${info.response}`);
    });
  });
};

const sendPollEndReminder = (community, emailList) => {
  //const { name } = community;

  emailList.forEach((person) => {
    const { name, email } = person;

    // Customize the email message for each person with HTML content
    const mailOptions = {
      from: "color6wrld@gmail.com",
      to: email,
      subject: `Poll Deadline - ${community.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #bcd727;">Hey ${name},</h2>
          <p>"<strong>${community.name}</strong>" has a poll that is about to be closed in 24 hours. Click the button to vote.</p>
          
          <p style="margin-top: 20px;">
            <a href="https://localhost:3000/Home/community/sfjNQtaUvxfoDNCFacvn" 
               style="
                 background-color: #bcd727;
                 color: white;
                 padding: 10px 20px;
                 text-decoration: none;
                 border-radius: 5px;
                 display: inline-block;
                 font-weight: bold;
               ">
               Vote.
            </a>
          </p>
          <p>If you have any questions, feel free to post on the community chat.</p>
              <p style="margin-top: 20px;">
            <a href="${community.WebUrl}" 
               style="
                 background-color: #0000FF;
                 color: white;
                 padding: 10px 20px;
                 text-decoration: none;
                 border-radius: 5px;
                 display: inline-block;
                 font-weight: bold;
               ">
               Commmunity Chat.
            </a>
          </p>
          <p>Best regards,<br>The Admin</p>
        </div>
      `,
    };

    // Assuming 'transporter' is already configured and available in your scope
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(`Error sending email to ${email}:`, error);
      }
      console.log(`Email sent to ${email}: ${info.response}`);
    });
  });
};

module.exports = {
  sendRsvpEmail,
  sendEventStartReminder,
  sendEventCommentReminder,
  sendPollStartReminder,
  sendPollEndReminder,
};
