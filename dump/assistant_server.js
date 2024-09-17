const OpenAI = require("openai");
const axios = require("axios");
const qs = require("qs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { resolveContent } = require("nodemailer/lib/shared");
const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const openai = new OpenAI({
  apiKey:
    "sk-MOIB1y6ncCA3Rtgq5E72eRWLMrDNiPwnNJuMhD2tb5T3BlbkFJ3DLk-OipaqJRNDln96Z_3kXrnV1Hbwr-vx3_AUcYAA",
  dangerouslyAllowBrowser: true,
});

async function main(community) {
  const myAssistant = await openai.beta.assistants.create({
    instructions: `You are an assistant designed to help 
    recommend new events for the ${community}. Your primary task is to 
    recommend one event (ONLY JSON, NO EXPLANATION OR TEXT) .Provide the following details
     to ensure the event's success: Predicted Attendance, Optimal Timing,
     location suitability, start_date (TIMESTAMP SECONDS PLZ) and end_date (TIMESTAMP SECONDS PLZ). If you're recommending an event 
      please respond in a json format ONLY (no other text, only JSON)
       with fields name, description, predicted_attendance, optimal_timing, 
       start_date,end_date  and location. No matter What, Respond with one event at a time. If you not recommending
        an event or just answering a question you can respond normally (NO JSON, JUST TEXT)`,
    name: "Event Recommender",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4o",
  });

  //console.log(myAssistant);
  return myAssistant;
}

async function thread() {
  const emptyThread = await openai.beta.threads.create();

  //console.log(emptyThread);
  return emptyThread;
}

async function run(assistant_object, thread_object, res) {
  console.log("about to run run()");
  // console.log(assistant_object.id, thread_object.id);

  const run = await openai.beta.threads.runs.create(thread_object.id, {
    assistant_id: assistant_object.id,
  });

  res.send({ NewAssistant: run });
  //console.log(run);
}

const processMessage = async (threadID, runID, res) => {
  console.log("responding");
  let runStatus = await openai.beta.threads.runs.retrieve(threadID, runID);
  while (runStatus.status !== "completed") {
    console.log("The status is :", runStatus.status);
    await delay(3000); // Wait for 1.5 seconds before checking again
    runStatus = await openai.beta.threads.runs.retrieve(threadID, runID);
  }
  console.log("run status is complete");
  let messages;

  messages = await openai.beta.threads.messages.list(threadID);
  let msgList = messages.data;
  // console.log(msgList);
  const updatedMsgList = msgList.map((msg) => {
    return {
      ...msg, // Copy existing fields
      sender: msg.role === "user" ? "You" : "AI", // Add "sender" field
    };
  });
  updatedMsgList.sort((a, b) => a.created_at - b.created_at);

  if (updatedMsgList.length > 0) {
    const lastMessage = updatedMsgList[msgList.length - 1];
    console.log("messages are there and looking at the last message.");
    if (lastMessage.role === "assistant") {
      console.log("Last Message Belongs to Assistant ");

      if (!lastMessage.content[0]) {
        console.log("Assistant has not responded.");
        processMessage(threadID, runID, res);
      } else {
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
        console.log(`Response Message Sent at - ${formattedDate}`);
        res.send({ messages: updatedMsgList });
      }

      return; // Exit the function as the assistant has responded
    } else {
      console.log("last message belongs to the user");
      console.log(`user - ${lastMessage.content[0].text.value}`);
      processMessage(threadID, runID, res);
    }
  }
};

const fetchMessages = async (threadID, runID, res) => {
  let runStatus = await openai.beta.threads.runs.retrieve(threadID, runID);
  while (runStatus.status !== "completed") {
    console.log("The status is :", runStatus.status);
    await delay(3000); // Wait for 1.5 seconds before checking again
    runStatus = await openai.beta.threads.runs.retrieve(threadID, runID);
  }
  let messages;

  messages = await openai.beta.threads.messages.list(threadID);
  let msgList = messages.data;
  // console.log(msgList);
  const updatedMsgList = msgList.map((msg) => {
    return {
      ...msg, // Copy existing fields
      sender: msg.role === "user" ? "You" : "AI", // Add "sender" field
    };
  });
  updatedMsgList.sort((a, b) => a.created_at - b.created_at);

  if (updatedMsgList.length > 0) {
    const lastMessage = updatedMsgList[msgList.length - 1];

    if (lastMessage.role === "assistant") {
      //console.log("Last Message Belongs to Assistant : ", lastMessage);

      if (!lastMessage.content[0]) {
        console.log("Assistant has not responded.");
        fetchMessages(threadID, runID, res);
      } else {
        res.send({ messages: updatedMsgList });
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

        console.log(`Fetch Messages Response Sent at - ${formattedDate}`);
      }
      //   msgList.forEach((msg) => {
      //     const role = msg.role;
      //     const content =
      //       msg.content[0] && msg.content[0].text
      //         ? msg.content[0].text.value
      //         : "Content missing";
      //     //   console.log(
      //     //     `${role.charAt(0).toUpperCase() + role.slice(1)}: ${content}`
      //     //   );

      //     if (!msg.content[0]) {
      //       console.log(
      //         "******************************************************************"
      //       );
      //       console.log("A message is missing");
      //       console.log(
      //         "******************************************************************"
      //       );
      //       processMessage(threadID, runID, res);
      //     }
      //     //   console.log(content.slice(7, -3));
      //     //   console.log("\n");
      //   });

      //   console.log("Sent message processed...");

      //   //setMsgsLoading(false);
      //   res.send({ messages: updatedMsgList });
      return; // Exit the function as the assistant has responded
    }
  }
};

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

    processMessage(threadID, runID, res);
    // let runStatus = await openai.beta.threads.runs.retrieve(threadID, runID);
    // while (runStatus.status !== "completed") {
    //   console.log("The status is :", runStatus.status);
    //   await delay(3000); // Wait for 1.5 seconds before checking again
    //   runStatus = await openai.beta.threads.runs.retrieve(threadID, runID);
    // }
    // let messages;

    // messages = await openai.beta.threads.messages.list(threadID);
    // let msgList = messages.data;
    // console.log(msgList);
    // const updatedMsgList = msgList.map((msg) => {
    //   return {
    //     ...msg, // Copy existing fields
    //     sender: msg.role === "user" ? "You" : "AI", // Add "sender" field
    //   };
    // });
    // updatedMsgList.sort((a, b) => a.created_at - b.created_at);

    // if (updatedMsgList.length > 0) {
    //   const lastMessage = updatedMsgList[msgList.length - 1];

    //   if (lastMessage.role === "assistant") {
    //     console.log("Last Message Belongs to Assistant : ", lastMessage);

    //     msgList.forEach((msg) => {
    //       const role = msg.role;
    //       const content =
    //         msg.content[0] && msg.content[0].text
    //           ? msg.content[0].text.value
    //           : "Content missing";
    //       //   console.log(
    //       //     `${role.charAt(0).toUpperCase() + role.slice(1)}: ${content}`
    //       //   );

    //       if (!msg.content[0]) {
    //         console.log(
    //           "******************************************************************"
    //         );
    //         console.log("A message is missing");
    //         console.log(
    //           "******************************************************************"
    //         );
    //         // checkStatusAndPrintMessages(
    //         //   currentGoal.threadID,
    //         //   currentGoal.runID
    //         // );
    //       }
    //       //   console.log(content.slice(7, -3));
    //       //   console.log("\n");
    //     });

    //     console.log("Sent message processed...");

    //     //setMsgsLoading(false);
    //     res.send({ messages: updatedMsgList });
    //     return; // Exit the function as the assistant has responded
    //   }
    // }
  } catch (error) {
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

app.post("/generateCommunityDescription", async (req, res) => {
  console.log("community name ");
  const { name } = req.body;
  console.log(name);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Here is an community name - ${name}. The commnity is for a software company's staff. Please generate a description for this community. Concise Pargraph, with 250 characters?`,
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
