import './assets/main.css'
// SomeComponent.vue
import { createApp } from 'vue'
import App from './App.vue'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getFirestore, 
          collection,
          getDocs
        } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0MXUm__Mhmfo2HcdE5oANLVPkBWhpBkY",
  authDomain: "retry-cbb36.firebaseapp.com",
  projectId: "retry-cbb36",
  storageBucket: "retry-cbb36.appspot.com",
  messagingSenderId: "798219402651",
  appId: "1:798219402651:web:dd626ee46fadfa648bb53e",
  measurementId: "G-WSTQMG8530"
};


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// collection ref
const phelRef = collection(db, 'pheeleex')

// Create a Vue app instance
const app = createApp(App);

// Get collection data and organize it by blood group
getDocs(phelRef)
  .then((snapshot) => {
    const bloodGroups = {
      A: { group: 'A', people: [] },
      B: { group: 'B', people: [] },
      AB: { group: 'AB', people: [] },
      O: { group: 'O', people: [] },
    };

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const bloodGroup = data["Blood Group"];
      bloodGroups[bloodGroup].people.push({ name: data.Name, age: data.Age });
    });

    // Convert the object into an array for iteration in the template
    const bloodGroupsArray = Object.values(bloodGroups);

    // Set the organized data in the Vue app instance
    app.provide('bloodGroups', bloodGroupsArray);

    // Save initial data
    app.config.globalProperties.saveDataToLocalStorage = function() {
      localStorage.setItem('bloodGroupsData', JSON.stringify(bloodGroupsArray));
    };
    // Mount the app to the DOM
    app.mount('#app');
    app.config.globalProperties.saveDataToLocalStorage();
  })
  .catch(err => {
    console.log(err.message);
  });