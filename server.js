const axios = require("axios");
const qs = require("qs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 8080;
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey:
    "sk-MOIB1y6ncCA3Rtgq5E72eRWLMrDNiPwnNJuMhD2tb5T3BlbkFJ3DLk-OipaqJRNDln96Z_3kXrnV1Hbwr-vx3_AUcYAA",
  dangerouslyAllowBrowser: true,
});
const {
  getAccessToken,
  createTeamsChannel,
  createChannel,
} = require("./utils/MSTeamsUtils");

const {
  fetchMessages,
  processMessage,
  run,
  thread,
  main,
} = require("./utils/AssistantUtils");

const {
  scheduleRsvpReminder,
  scheduleEventStartReminder,
  scheduleEventEndReminder,
  remindUsersOfNewPoll,
  schedulePollEndReminder,
} = require("./utils/handleScheduler");

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post("/createChannel", async (req, res) => {
  console.log(req.body);
  const { name, description, category, status } = req.body;
  console.log("Request Body: ", req.body);
  try {
    getAccessToken()
      .then((token) => {
        const channelDetails = {
          displayName: name,
          description: description,
          membershipType: "standard", // or 'private'
        };
        const TeamID = "5e98ea06-b4c1-4f72-a52f-f84260611fef";

        createTeamsChannel(token, TeamID, channelDetails)
          .then((channel) => {
            //console.log("Channel created successfully:", channel);

            //add status and category to the channel.
            // Make a deep copy of the object
            const copiedObject = JSON.parse(JSON.stringify(channel));

            // Add the status field to the copied object
            copiedObject.status = status;
            copiedObject.category = category;
            res.send(copiedObject);
            // CommunityDB.createCommunity(
            //   copiedObject,
            //   setCommunities,
            //   setLoading
            // );
          })
          .catch((error) => {
            console.log("Data : ", error);
            // console.error(
            //   "Error creating channel:",
            //   error.response.data.error.message
            // );
          });
      })
      .catch((err) => {
        console.log("Error getting token");
        console.log(err.response);
      });
  } catch (error) {
    res.status(500).send(`Error creating channel: ${error}`);
  }
});

app.post("/sendEventInvite", async (req, res) => {
  console.log(req.body);
  const { subject, body, start, end, location, email } = req.body;

  const eventDetails = {
    subject: subject,
    body: body,
    start: start,
    end: end,
    location: location,
    attendees: [email],
  };
  console.log("Request Body: ", req.body);
  const token = await getAccessToken();
  //const url = `https://graph.microsoft.com/v1.0/groups/${groupId}/events`;
  const url__ = "https://graph.microsoft.com/v1.0/me/events";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const eventData = {
    subject: subject,
    body: {
      contentType: "HTML",
      content: body,
    },
    start: {
      dateTime: start,
      timeZone: "UTC",
    },
    end: {
      dateTime: end,
      timeZone: "UTC",
    },
    location: {
      displayName: location,
    },
    attendees: [
      {
        emailAddress: {
          address: email,
          name: email,
        },
        type: "required",
      },
      {
        emailAddress: {
          address: "ncbmkh005@myuct.ac.za",
          name: "Tshepo Ncube",
        },
        type: "required",
      },
    ],
  };

  try {
    const response = await axios.post(url__, eventData, { headers: headers });
    console.log("Event created:", response.data);
    res.send(response.data);
  } catch (error) {
    res
      .status(500)
      .send(`Sending  event invite: ${error.response.data.error.message}`);
  }
});

/* 
THIS IS NOW FOR THE ASSISTANT
*/

app.post("/sendMessage", async (req, res) => {
  const currentDate = new Date(); // Get the current date and time

  // Format the date to "16 September 2024, 17:09"
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDate = currentDate
    .toLocaleDateString("en-GB", options)
    .replace(",", "");

  console.log(`Recieved Message at - ${formattedDate}`);
  const { newMessage, threadID, runID, assistantID, instructions } = req.body;
  //console.log("Req.Body :", req.body);
  //console.log("Request Body: ", req.body);
  try {
    const user_message = await openai.beta.threads.messages.create(threadID, {
      role: "user",
      content: newMessage,
    });

    const run = await openai.beta.threads.runs.create(threadID, {
      // assistant_id: "asst_TuuWO4MxdsPJPgmdgLkXyeUN",asst_L1rmvjtYlVbgGWk89a53CmP3
      assistant_id: assistantID,
      instructions: `You are an assistant designed to help 
        recommend new events for the Soccer Community. Your primary task is to 
        recommend one event (ONLY JSON, NO EXPLANATION OR TEXT) .Provide the following details
         to ensure the event's success: Predicted Attendance, Optimal Timing,
         location suitability, start_date (TIMESTAMP SECONDS PLZ) and end_date (TIMESTAMP SECONDS PLZ). If you're recommending an event 
          please respond in a json format ONLY (no other text, only JSON)
           with fields name, description, predicted_attendance, optimal_timing, 
           start_date,end_date  and location. No matter What, Respond with one event at a time. If you not recommending
            an event or just answering a question you can respond normally (NO JSON, JUST TEXT)`,
    });
    console.log("processing message");
    processMessage(threadID, runID, res);
  } catch (error) {
    console.log("error processing message");
    res.status(500).send(`Error sending message: ${error}`);
  }
});

app.post("/fetchMessages", async (req, res) => {
  const currentDate = new Date(); // Get the current date and time

  // Format the date to "16 September 2024, 17:09"
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDate = currentDate
    .toLocaleDateString("en-GB", options)
    .replace(",", "");

  console.log(`Fetch Message Request at - ${formattedDate}`);
  const { threadID, runID } = req.body;

  try {
    fetchMessages(threadID, runID, res);
  } catch (error) {
    res.status(500).send(`Error sending message: ${error}`);
  }
});

app.post("/createAssistant", async (req, res) => {
  //console.log(req.body);
  const { communityName } = req.body;
  //console.log("Request Body: ", req.body);
  try {
    main(communityName).then((assistant_object) => {
      //console.log("done!");
      //console.log("assistant Object  :", assistant_object);
      thread(() => {
        console.log("Thread done running....");
      }).then((thread_object) => {
        //console.log(thread_object);
        run(assistant_object, thread_object, res);
      });
    });
  } catch (error) {
    res.status(500).send(`Error creating assistant: ${error}`);
  }
});

app.post("/generateEventDescription", async (req, res) => {
  const { name } = req.body;
  console.log(name);
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Here is an event name - ${name}. The event is for a software company's staff. Please generate a description for this event. Concise Pargraph, with 250 characters?`,
      },
    ],
    model: "gpt-4o-mini",
  });

  //console.log(completion.choices[0].message.content);

  try {
    res.send({ eventDescription: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).send(`Error creating channel: ${error}`);
  }
});

/* 
THIS IS NOW FOR THE AI GENERATION
*/

app.post("/generateCommunityDescription", async (req, res) => {
  const { name } = req.body;
  console.log(name);
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",

        content: `Here is an event name - ${name}. The event is  is for a software company's staff. Please generate a description for this community. Concise Pargraph, with 250 characters?`,
      },
    ],
    model: "gpt-4o-mini",
  });

  //console.log(completion.choices[0].message.content);

  try {
    res.send({ eventDescription: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).send(`Error creating channel: ${error}`);
  }
});

app.post("/generateEventDescription", async (req, res) => {
  console.log("event name ");
  const { name } = req.body;
  console.log(name);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Here is an community name - ${name}. The community is for a software company's staff. Please generate a description for this community. Concise Pargraph, with 250 characters?`,
      },
    ],
    model: "gpt-4o-mini",
  });

  console.log(completion.choices[0].message.content);

  try {
    res.send({ communityDescription: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).send(`Error creating channel: ${error}`);
  }
});

/* 
THIS IS NOW FOR THE EMAIL SCHEDULING
*/

app.post("/scheduleRsvpReminder", async (req, res) => {
  const { eventID } = req.body;
  scheduleRsvpReminder(eventID, res);
});

app.post("/scheduleEventStartReminder", async (req, res) => {
  const { eventID } = req.body;
  scheduleEventStartReminder(eventID, res);
});

app.post("/scheduleEventEndReminder", async (req, res) => {
  const { eventID } = req.body;
  scheduleEventEndReminder(eventID, res);
});

app.post("/remindUsersOfNewPoll", async (req, res) => {
  const { eventID } = req.body;
  remindUsersOfNewPoll(eventID, res);
});

app.post("/schedulePollEndReminder", async (req, res) => {
  const { eventID } = req.body;
  schedulePollEndReminder(eventID, res);
});

app.post("pingServer", async (req, res) => {
  console.log("Server Pinged");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
