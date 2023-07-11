// Add firebase database to the project
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

// Connect html elements with JS
const endorsementInputEl = document.querySelector("#endorsement-input");
const toInputEl = document.querySelector("#to-input");
const fromInputEl = document.querySelector("#from-input");

const publishButtonEl = document.querySelector("#publish-button");
const endorsementsListEl = document.querySelector("#endorsements-list");

// Push data to the database on click
publishButtonEl.addEventListener("click", function () {
  let inputValue = {
    endorsementInputValue: endorsementInputEl.value,
    toInputValue: toInputEl.value ? toInputEl.value : "Anonymous",
    fromInputValue: fromInputEl.value ? fromInputEl.value : "Anonymous",
  };

  if (!inputValue.endorsementInputValue) {
    endorsementInputEl.setAttribute(
      "placeholder",
      "Endorsement may not be empty"
    );
    endorsementInputEl.classList.add("error-message");

    return;
  }

  push(endorsementsInDB, inputValue);

  clearInputFieldEls();
});

// Evaluate if there are emtries in the database
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
});

// Clear elements
function clearInputFieldEls() {
  endorsementInputEl.value = "";
  endorsementInputEl.setAttribute("placeholder", "Write your endorsement here");
  endorsementInputEl.classList.remove("error-message");
  toInputEl.value = "";
  fromInputEl.value = "";
}

function clearEndorsementsListEl() {
  endorsementsListEl.innerHTML = "";
}

// Render and remove the entered data
function displayEndorsement(item) {
  let itemID = item[0];
  let itemValue = item[1].endorsementInputValue;
  let toValue = item[1].toInputValue;
  let fromValue = item[1].fromInputValue;

  var newEl = document.createElement("div");

  newEl.classList.add("endorsement-item");
  newEl.innerHTML = `
    <p><strong>To: ${toValue}</strong></p>
    <p>${itemValue}</p>
    <p><strong>From: ${fromValue}</strong></p>
    `;

  endorsementsListEl.append(newEl);

  removeEndorsement(itemID, newEl);
}

function removeEndorsement(location, el) {
  el.addEventListener("dblclick", function () {
    let confirmation = confirm("Do you with to delete this endorsement?");
    if (confirmation) {
      let exactLocationOfItemInDB = ref(database, `endorsements/${location}`);

      remove(exactLocationOfItemInDB);
    } else {
      return;
    }
  });
}
