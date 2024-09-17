const axios = require("axios");
const test = async () => {
  try {
    const res = await axios.post(
      "https://opencom-3-server.onrender.com/generateEventDescription",
      { name: "Soccer" },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Returned Object: ", res.data.eventDescription);

    console.log("New Messages Refreshed");
  } catch (error) {
    console.log(error);
  }
};

test();
