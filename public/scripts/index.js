const { firebaseConfig } = await import("/config/auth.js");

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function sameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

function fileExists(url) {
  if (url) {
      var req = new XMLHttpRequest();
      req.open('GET', url, false);
      req.send();
      return req.status==200;
  } else {
      return false;
  }
}

function resetCanvas() {
  document.getElementById("canvas").remove();

  let temp = document.getElementsByTagName("template")[0];
  let clon = temp.content.cloneNode(true);
  clon.id = "canvas";
  document.getElementById("canvasdiv").appendChild(clon);

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  populatePearls();
  
}

async function populatePearls() {
  
  

  db.collection("Pearls").get()
  .then(allPearls => {

    var inputTownx = document.getElementById("townx").value;
    var inputTowny = document.getElementById("towny").value;
    if (document.getElementById(inputTownx + "," + inputTowny) != null) {
      var image = document.getElementById(inputTownx + "," + inputTowny);
      ctx.drawImage(image, 0, 0);
    }

    allPearls.forEach(doc => {
      var date = new Date(doc.data().date.seconds * 1000);
      var townx = doc.data().townLocation[0];
      var towny = doc.data().townLocation[1];
      
      if (sameDay(date, new Date()) && townx == inputTownx && towny == inputTowny) {
        
        var x = doc.data().location[0];
        var y = doc.data().location[1];

        ctx.beginPath();
        ctx.arc(x + 160, y + 160, 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "red"; //doc.data().pearlType;
        ctx.fill();
      }

    });

  }); 
}

async function workPlease() {
  resetCanvas();  
}

document.getElementById("searchmap").addEventListener("click", workPlease);

function addPearl() {
  var inputTownx = document.getElementById("townx").value;
  var inputTowny = document.getElementById("towny").value;

  var inputx = document.getElementById("x").value;
  var inputy = document.getElementById("y").value;

  var type = document.getElementById("type").value;

  var ref = db.collection("Pearls");
  ref.add({
      location: [parseInt(inputx), parseInt(inputy)],
      pearlType: type,
      townLocation: [parseInt(inputTownx), parseInt(inputTowny)],
      date: new Date()
  }).then(populatePearls());
}

document.getElementById("addpearl").addEventListener("click", addPearl);