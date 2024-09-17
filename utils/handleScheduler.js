const schedule = require("node-schedule");
const db = require("../data/DB");

const { notRsvpList } = require("./utils");
const {
  getEventData,
  getEventPoll,
  getCommunityData,
  getUsersNotRSVPd,
  getPollData,
} = require("../data/FetchData");
const {
  sendRsvpEmail,
  sendEventStartReminder,
  sendEventCommentReminder,
  sendPollStartReminder,
  sendPollEndReminder,
} = require("../handleEmails/mailer");

const scheduleRsvpReminder = async (eventID, res) => {
  var eventData = await getEventData(eventID);
  var communityData = await getCommunityData(eventData.CommunityID);
  console.log(communityData);
  console.log(eventData);

  var usersThatHaveNotRSVPd = notRsvpList(communityData.users, eventData.rsvp);
  console.log(usersThatHaveNotRSVPd);

  const rsvpEndTimeSeconds = eventData.RsvpEndTime.seconds;
  const twentyFourHoursBeforeRsvpEndTime = new Date(
    (rsvpEndTimeSeconds - 86400) * 1000
  );
  console.log(twentyFourHoursBeforeRsvpEndTime);
  console.log(new Date(twentyFourHoursBeforeRsvpEndTime));
  const job = schedule.scheduleJob(
    twentyFourHoursBeforeRsvpEndTime,
    function () {
      sendRsvpEmail(eventData, usersThatHaveNotRSVPd);
    }
  );

  //console.log("Job scheduled:", job);
};

const scheduleEventStartReminder = async (eventID, res) => {
  var eventData = await getEventData(eventID);
  var communityData = await getCommunityData(eventData.CommunityID);

  const rsvpEndTimeSeconds = eventData.RsvpEndTime.seconds;
  const twentyFourHoursBeforeRsvpEndTime = new Date(
    (rsvpEndTimeSeconds - 86400) * 1000
  );

  const job = schedule.scheduleJob(
    twentyFourHoursBeforeRsvpEndTime,
    function () {
      sendEventStartReminder(eventData, communityData.users);
    }
  );

  console.log("Job scheduled:", job);
};

const scheduleEventEndReminder = async (eventID, res) => {
  var eventData = await getEventData(eventID);
  var communityData = await getCommunityData(eventData.CommunityID);

  const rsvpEndTimeSeconds = eventData.RsvpEndTime.seconds;
  const twentyFourHoursAfterEventEndTime = new Date(
    (rsvpEndTimeSeconds + 86400) * 1000
  );

  const job = schedule.scheduleJob(
    twentyFourHoursAfterEventEndTime,
    function () {
      sendEventCommentReminder(eventData, communityData.users);
    }
  );

  console.log("Job scheduled:", job);
};

const remindUsersOfNewPoll = async (pollID, res) => {
  var pollData = await getPollData(pollID);
  var communityData = await getCommunityData(pollData.CommunityID);

  const rsvpEndTimeSeconds = eventData.RsvpEndTime.seconds;
  const twentyFourHoursBeforeRsvpEndTime = new Date(
    (rsvpEndTimeSeconds - 86400) * 1000
  );

  const job = schedule.scheduleJob(
    twentyFourHoursBeforeRsvpEndTime,
    function () {
      sendPollStart(communityData, communityData.users);
    }
  );

  console.log("Job scheduled:", job);
};

const schedulePollEndReminder = async (pollID, res) => {
  var pollData = await getPollData(pollID);
  var communityData = await getCommunityData(pollData.CommunityID);

  console.log(communityData);
  console.log(eventData);

  const rsvpEndTimeSeconds = pollData.PollCloseDate.seconds;
  const twentyFourHoursBeforePollEndTime = new Date(
    (rsvpEndTimeSeconds - 86400) * 1000
  );
  console.log(twentyFourHoursBeforePollEndTime);
  console.log(new Date(twentyFourHoursBeforePollEndTime));
  const job = schedule.scheduleJob(
    twentyFourHoursBeforePollEndTime,
    function () {
      sendPollEndReminder(communityData, communityData.users);
    }
  );

  console.log("Job scheduled:", job);
};

// const eventCancelled = () => {};

// const eventEdited = () => {};

// scheduleEventStartReminder("oj0DkobFPK1iwlNaCTjQ");

module.exports = {
  scheduleRsvpReminder,
  scheduleEventStartReminder,
  scheduleEventEndReminder,
  remindUsersOfNewPoll,
  schedulePollEndReminder,
};
