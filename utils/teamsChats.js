const axios = require("axios");
const qs = require("qs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const getAccessToken = async () => {
  try {
    const tenantId = "bd82620c-6975-47c3-9533-ab6b5493ada3";
    const clientId = "1bc7d53f-6a03-4ab1-ac52-c5ad91aff9bb";
    const clientSecret = "UUs8Q~y7tJC~1wL3rcgc5mnSnY3pmK9BIZTjbdb_";

    const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    const tokenData = {
      grant_type: "password",
      username: "uctstudents@openboxsoftware.com",
      password: "RDyEQ3z6!a4%aaIPi;U7",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
    };

    const response = await axios.post(tokenEndpoint, qs.stringify(tokenData), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error(
      `Error getting Access Token: ${error.response.data.error.message}`
    );
    if (error.response) {
      console.error(
        `Response Data: ${JSON.stringify(error.response.data.error.message)}`
      );
    }
    throw error.response.data.error.message;
  }
};

const getChatMessages = async (token, teamId) => {
  const url = `https://graph.microsoft.com/beta/teams/5e98ea06-b4c1-4f72-a52f-f84260611fef/channels/19:3a36c4cfd8404127ba0467075766e789@thread.tacv2/messages
`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, {
      headers: headers,
    });
    console.log("Messages Fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Error creating channel: ${error.response.data.error.message}`
    );
    if (error.response) {
      console.error(
        `Response data: ${JSON.stringify(error.response.data.error.message)}`
      );
    }
    throw error.response.data.error.message;
  }
};

const handleChatMessages = () => {
  try {
    getAccessToken()
      .then((token) => {
        const TeamID = "5e98ea06-b4c1-4f72-a52f-f84260611fef";
        console.log(token);
        getChatMessages(token, TeamID)
          .then((channel) => {
            console.log(channel);
          })
          .catch((error) => {
            console.log("Data : ", error);
          });
      })
      .catch((err) => {
        console.log("Error getting token");
        console.log(err.response);
      });
  } catch (error) {
    console.log(`Error getting messages for channel: ${error}`);
  }
};

handleChatMessages();
