const { initializeApp } = require("firebase/app");
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

const firebaseConfig = {
  apiKey: "AIzaSyBUOXW9tM6TNFuCxmNGygIDsR6sEskbz98",
  authDomain: "opencommunity-479a9.firebaseapp.com",
  projectId: "opencommunity-479a9",
  storageBucket: "opencommunity-479a9.appspot.com",
  messagingSenderId: "22530876067",
  appId: "1:22530876067:web:497183ec9f0e33b9129516",
  measurementId: "G-5JHBHHMWDZ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
