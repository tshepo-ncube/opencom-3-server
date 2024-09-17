const axios = require("axios");
const qs = require("qs");

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

const createTeamsChannel = async (token, teamId, channelDetails) => {
  const url = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const channelData = {
    displayName: channelDetails.name,
    description: channelDetails.description,
    membershipType: channelDetails.membershipType || "standard", // 'standard' or 'private'
  };
  console.log("ChannelDetails : ", channelDetails);
  try {
    const response = await axios.post(url, channelDetails, {
      headers: headers,
    });
    console.log("Channel created:", response.data);
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

const createChannel = ({ name, description, category, status }, res) => {
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
          console.log("Channel created successfully:", channel);
          res.send("Channel Created Successfully...");
          //add status and category to the channel.
          // Make a deep copy of the object
          const copiedObject = JSON.parse(JSON.stringify(channel));

          // Add the status field to the copied object
          copiedObject.status = status;
          copiedObject.category = category;
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
};

async function getChannelMessages() {
  const teamId = "5e98ea06-b4c1-4f72-a52f-f84260611fef";
  const channelId = "19:3a36c4cfd8404127ba0467075766e789@thread.tacv2";

  const accessToken = await getAccessToken();
  const url = `https://graph.microsoft.com/beta/teams/${teamId}/channels/${channelId}/messages`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const messages = response.data.value;

    // Iterate over messages and print the content
    messages.forEach((message) => {
      // Checking if the body property exists and has a 'content' field
      if (message.body && message.body.content) {
        console.log(`Message ID: ${message.id}`);
        console.log(`Message Content: ${message.body.content}`);
        console.log("------------------------------------");
      }
    });
  } catch (error) {
    console.error(
      "Error retrieving messages:",
      error.response ? error.response.data : error.message
    );
  }
}

module.exports = {
  getAccessToken,
  createTeamsChannel,
  createChannel,
  getChannelMessages,
};
