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

const endorsementInputEl = document.querySelector("#endorsement-input");
const toInputEl = document.querySelector("#to-input");
const fromInputEl = document.querySelector("#from-input");

const publishButtonEl = document.querySelector("#publish-button");
const endorsementsListEl = document.querySelector("#endorsements-list");

publishButtonEl.addEventListener("click", function () {
  let inputValue = {
    endorsementInputValue: endorsementInputEl.value,
    toInputValue: toInputEl.value,
    fromInputValue: fromInputEl.value,
  };
  // let inputValue = endorsementInputEl.value;
  // let toValue = toInputEl.value;

  push(endorsementsInDB, inputValue);

  clearInputFieldEls();
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
});

function clearInputFieldEls() {
  endorsementInputEl.value = "";
  toInputEl.value = "";
  fromInputEl.value = "";
}

function clearEndorsementsListEl() {
  endorsementsListEl.innerHTML = "";
}

function displayEndorsement(item) {
  let itemID = item[0];
  let itemValue = item[1].endorsementInputValue;
  let toValue = item[1].toInputValue;
  let fromValue = item[1].fromInputValue;

  let newEl = document.createElement("p");
  // newEl.textContent = itemValue;

  newEl.innerHTML = `
  <strong>To ${toValue}</strong>
  <br /> 
  <br /> 
  ${itemValue}
  <br /> 
  <br /> 
  <strong>From ${fromValue}</strong>
  `;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`);

    remove(exactLocationOfItemInDB);
  });

  endorsementsListEl.append(newEl);
}