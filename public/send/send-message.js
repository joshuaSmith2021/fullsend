// Need to: get creator's username from database

const inputBox = document.getElementById("typebox");

inputBox.addEventListener("focus", function () {
  // Fires constantly when the box is in focus
  inputBox.style.textAlign = "left";
  inputBox.placeholder = "";
});

inputBox.addEventListener("blur", function () {
  let value = inputBox.value;
  if (value.replace(/\s/g, "") == "") {
    inputBox.style.textAlign = "center";
    inputBox.placeholder = "Send it!";
    inputBox.value = "";
  }
});

document.getElementById("sendTrigger").addEventListener("click", function () {
  if (inputBox.value.replace(/\s/g, "") !== "") {
    // Send message to firebase
  }
});
