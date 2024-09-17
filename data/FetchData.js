const db = require("./DB");
const {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  runTransaction,
} = require("firebase/firestore");

const getEventData = async (eventID) => {
  try {
    const eventsCollection = collection(db, "events");
    const eventRef = doc(eventsCollection, eventID);
    const docSnap = await getDoc(eventRef);
    if (docSnap.exists()) {
      //console.log(docSnap.id, "=>", docSnap.data());
      //return { id: docSnap.id, ...docSnap.data() };
      return docSnap.data();
    } else {
      console.log("Document does not exist for EventID:", eventID);
      return null; // or handle as needed
    }
  } catch (error) {
    console.error("Error fetching document:", eventID, error);
    throw error; // or handle as needed
  }
};

const getCommunityData = async (communityID) => {
  try {
    const communitiesCollection = collection(db, "communities");
    const communityRef = doc(communitiesCollection, communityID);
    const docSnap = await getDoc(communityRef);
    if (docSnap.exists()) {
      //console.log(docSnap.id, "=>", docSnap.data());
      //return { id: docSnap.id, ...docSnap.data() };
      return docSnap.data();
    } else {
      console.log("Document does not exist for CommunityID:", communityID);
      return null; // or handle as needed
    }
  } catch (error) {
    console.error("Error fetching document:", communityID, error);
    throw error; // or handle as needed
  }
};

const getPollData = async (pollID) => {
  try {
    const pollsCollection = collection(db, "polls");
    const pollRef = doc(pollsCollection, pollID);
    const docSnap = await getDoc(pollRef);
    if (docSnap.exists()) {
      console.log(docSnap.id, "=>", docSnap.data());
      //return { id: docSnap.id, ...docSnap.data() };
      return docSnap.data();
    } else {
      console.log("Document does not exist for PollID:", pollID);
      return null; // or handle as needed
    }
  } catch (error) {
    console.error("Error fetching document:", pollID, error);
    throw error; // or handle as needed
  }
};

const getUsersNotRSVPd = (communityUsers, rsvpdUsers) => {
  // Convert list2 to a Set for faster lookup
  const set2 = new Set(rsvpdUsers);

  // Filter list1 to include only elements not in list2
  return communityUsers.filter((element) => !set2.has(element));
};

module.exports = {
  getEventData,
  getCommunityData,
  getUsersNotRSVPd,
  getPollData,
};
