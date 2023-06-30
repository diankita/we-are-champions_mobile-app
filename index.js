import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-champions-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsements")

const inputFieldEl = document.querySelector("#input-field");
const publishButtonEl = document.querySelector("#publish-button");
const endorsementsListEl = document.querySelector("#endorsements-list");
// const pEl = document.createElement("p")

publishButtonEl.addEventListener("click", function() {
  let inputValue = inputFieldEl.value
  push(endorsementsInDB, inputValue)

  clearInputFieldEl();
})

onValue(endorsementsInDB, function(snapshot) {
  let endorsementsArray = Object.values(snapshot.val());

  clearEndorsementsListEl()

  for (let i = 0; i < endorsementsArray.length; i++) {
    const endorsement = endorsementsArray[i];
    displayEndorsement(endorsement)
  }
})

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function clearEndorsementsListEl() {
  endorsementsListEl.innerHTML = "";
}

function displayEndorsement(value) {
  endorsementsListEl.innerHTML += `<p>${value}</p>`
  // pEl.textContent = value;
  // endorsementsListEl.appendChild(liEl);
}
