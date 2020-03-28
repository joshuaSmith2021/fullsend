function getParameters(){var t=window.location.href.split("?");if(1===t.length)return null;var r,e=t[1].split("&"),n="{",l="";for(r=0;r<e.length;r++)l=e[r].split("="),r>0&&(n+=","),isNaN(parseInt(l[1],10))?"true"===l[1]||"false"===l[1]?n+='"'+l[0]+'":'+l[1]:n+='"'+l[0]+'":"'+l[1]+'"':n+='"'+l[0]+'":'+l[1];return n+="}"}

const parameters = JSON.parse(getParameters());

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
