const axios = require("axios");
const qs = require("qs");

// Replace with your values

const tenantId = "bd82620c-6975-47c3-9533-ab6b5493ada3";
const clientId = "1bc7d53f-6a03-4ab1-ac52-c5ad91aff9bb";
const clientSecret = "UUs8Q~y7tJC~1wL3rcgc5mnSnY3pmK9BIZTjbdb_";

// Function to get an access token
async function getAccessToken() {
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const tokenData = qs.stringify({
    // grant_type: "client_credentials",
    // client_id: clientId,
    // client_secret: clientSecret,
    // scope: "https://graph.microsoft.com/.default",
    grant_type: "password",
    username: "uctstudents@openboxsoftware.com",
    password: "RDyEQ3z6!a4%aaIPi;U7",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
  });

  try {
    const response = await axios.post(tokenUrl, tokenData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error getting access token:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Function to retrieve messages from the channel

// Run the function to get channel messages
getChannelMessages();
