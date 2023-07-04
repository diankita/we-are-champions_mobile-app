import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-champions-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsements");

const inputFieldEl = document.querySelector("#input-field");
const publishButtonEl = document.querySelector("#publish-button");
const endorsementsListEl = document.querySelector("#endorsements-list");

publishButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  push(endorsementsInDB, inputValue);

  clearInputFieldEl();
});

onValue(endorsementsInDB, function (snapshot) {
if (snapshot.exists()) {
  let endorsementsArray = Object.entries(snapshot.val());

  clearEndorsementsListEl();

  for (let i = 0; i < endorsementsArray.length; i++) {
    let currentEndorsement = endorsementsArray[i];
    let currentEndorsementID = currentEndorsement[0];
    let currentEndorsementValue = currentEndorsement[1];

    displayEndorsement(currentEndorsement);
  }
} else {
    endorsementsListEl.innerHTML = "No endorsements yet 🙁";
}
} 
);

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function clearEndorsementsListEl() {
  endorsementsListEl.innerHTML = "";
}

function displayEndorsement(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("p");
  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`);

    remove(exactLocationOfItemInDB);
  });
  endorsementsListEl.append(newEl);
}
