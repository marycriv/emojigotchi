const petContainer = document.querySelector(".pet-container")
const welcomeMsg = document.querySelector("h2")
const petNameHeader = document.querySelector("h3")
const innerContainer = document.querySelector("#inner-container")

const rightContainer = document.querySelector("#right-container")
const userInfoContainer = document.querySelector(".user-info-container")
const petFood = document.querySelector("#pet-stat-2-food")
const wholeAppHeader = document.querySelector("#overall-app-header")
const nameDropdownSelectButton = document.querySelector("#selector-btn")
let usersDeadPets = []

// let gameStarted = false
const playMsg = "Let's Play Roshambo!"
const rpsValues = [{value: 'r', emoji: '👊'},{value: 'p',emoji: '🖐'},{value: 's', emoji: '✌️'}]
const rpsResultEmoji = {2: '🙃', 1: '😭', 0: '😆💪'}
let currentUserId

// Global event listener
petContainer.addEventListener("click", e => {
  if (e.target.id === "pet-play") {
    // gameStarted = true
    playRPS();
  } else if (e.target.id === "pet-stat-1-love" || e.target.id === "the-pet") {
    likeMyPet(e);
  } else if (e.target.id === "emoji-name-form-btn") {
    gotchiNameSubmit(e)
  } else if (e.target.id === "selector-btn") {
    nameSelectedFromDropdown(e)
  } else if (e.target.id === "graveyard") {
    showDeadPets(e)
  }
})


function loadLoginForm() {
    innerContainer.innerHTML =
        `
        <div class="nes-field is-inline">
        <form style="margin:auto;margin-top:25%;" id='login-form'>
            <label for='username'>Username:</label><br>
            <input name="username" id="username" placeholder="What is your name?" class="nes-input is-success">
            <br>
            <button class="nes-btn is-success" type="submit" form="login-form" value="Submit">Submit</button>
            </form>

        </div>


      `
}

loadLoginForm()

petContainer.addEventListener('submit', e => {
  newUserOrLogIn(e)
})

function newUserOrLogIn(e) {
  e.preventDefault()

  const username = {
      "username": e.target.username.value
  }

  if (e.target.username.value.length >= 2 && e.target.username.value.length <= 20 && e.target.username.value != 'bepis') {
    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(username)
    })
    .then(resp => resp.json())
    .then(userJson => {
        currentUserId = userJson.id
        wholeAppHeader.innerHTML = `<p hidden class="hiddenuserid">${userJson.id}</p>
        <b>Username:</b> ${userJson.username} ▪️

        `
      // add error catch
        nameYourGotchiScreen(userJson)
      })
    } else if (e.target.username.value === 'bepis') {
      window.location.href = "https://cwacht.github.io/nyancat/";
    } else {
      alert('Username must be between 2 and 20 characters.')
    }
}

function nameYourGotchiScreen(userInfo) {
    innerContainer.innerHTML =
      `
      <div class="nes-field is-inline">
        <form id='emoji-name-form' style="margin:auto;margin-top:10%;">
            <label  for='name'>New Pet's Name:</label><br>
            <input name="name" id="name" placeholder="Name your pet!" class="nes-input is-success">
            <br>
            <button class="nes-btn is-success" form="emoji-name-form" id="emoji-name-form-btn">Submit</button>
        </form>
    </div>
    <br>
    <br>
    `
    innerContainer.innerHTML += `
      <label for="success_select">Or select a previous pet:</label>
      <div class="nes-select is-success">
        <select required id="success_select">
          <option value="" disabled selected hidden>Select pet...</option>
    `
    innerContainer.innerHTML += `
      <br>
      <button id="selector-btn" type="button" class="nes-btn is-success">Select prev pet</button>
    `
    petCemetery(userInfo)

    let counter = 0
    userInfo.pets.forEach(function(element) {
        if (element.dead === false){
          document.getElementById("success_select").innerHTML += `
          <option id="${element.id}" value="${counter}">${element.name}</option>
          `
          counter += 1

        }
    })
}

function petCemetery(userInfo) {

  let deadPetExist = 0;
  userInfo.pets.forEach(function(element){
    if (element.user_id === userInfo.id) {
      if (element.dead === true){
        usersDeadPets.push(element.name)
        deadPetExist = 1
        return deadPetExist
      }
    }
  })
  if (deadPetExist === 1) {
    innerContainer.innerHTML += `
    <br><br>
    <button id="graveyard" class="nes-btn is-error">Pet cemetery ⚰️</button>
    `
  } else if (deadPetExist === 0) {
    innerContainer.innerHTML += `
    <br><br>
    <button class="nes-btn is-disabled">Pet cemetery ⚰️</button>
    `
  }
}

function showDeadPets(e) {
  innerContainer.innerHTML = ``
  usersDeadPets.forEach(function(element) {
        innerContainer.innerHTML += `
        <p class="grayOut">☠️ ${element}</p>`;
  });
}

function nameSelectedFromDropdown(e) {
  let selection = document.querySelector('#success_select').options[document.querySelector('#success_select').selectedIndex]
  fetch(`http://localhost:3000/pets/${selection.id}`)
    .then(resp => resp.json())
    .then(petsJson => {
      if (petsJson.dead) {
        wholeAppHeader.innerHTML = "Please create a new pet or pick one that's alive."
      }
      else {
        selection.id = petsJson.id
        wholeAppHeader.innerHTML = `
        <b>Username:</b> ${petsJson.user.username} ▪️
        <b>Pet name:</b> ${petsJson.name}
        <p hidden>${petsJson.dead}</p>
        `
        //Calls on gotchi game function with user & pet ids
        gotchiGame(currentUserId, petsJson)
      }
    }) // end petsJson




}

// Creates the game
function gotchiGame(userId, currentPet) {
    innerContainer.innerHTML = `
      <div class="noselect" id="the-pet" data-id=${currentPet.id} ondrop="drop(event)" ondragover="allowDrop(event)">😀</div>

    `
    // background()
    rightContainer.innerHTML = `
    <ul class="pet-stats-container">
      <li><div id="pet-stat-1-love" data-id=${currentPet.id} class="pet-stats-item">❤️</div></li>



          <li id="pet-stat-2-food" class="pet-stats-item">

          <img src="https://images.emojiterra.com/google/android-pie/512px/1f32e.png" style="background-color:transparent;" width="60px" draggable="true" ondragstart="drag(event)" id="drag1">
          </li>



      <li id="level" class="pet-stats-item">${currentPet.level}</li>
      <li id="pet-play" class="pet-stats-item">⚔️</li>
      <li><p hidden>${currentPet.dead}</p></li>
    </ul>
    `
}

function removePulsateHeart() {
  document.querySelector("#love-msg").remove()
  document.querySelector("#the-pet").className = "noselect"
  document.querySelector("#pet-stat-1-love").className = "pet-stats-item"
}
function likeMyPet(e) {
  e.preventDefault()
  // if (e.target.id === "the-pet" || e.target.id === "pet-stat-1-love") {

    let currentLevel = parseInt(document.querySelector("#level").innerText)
    fetch(`http://localhost:3000/pets/${e.target.dataset.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "level": currentLevel + 5
        })
    })
    .then(resp => resp.json())
    .then(petJson => {

      innerContainer.innerHTML = `
        <div id="the-pet" class="noselect animated wobble" data-id=${petJson.id}  ondrop="drop(event)" ondragover="allowDrop(event)">😀</div>
        <h2 id="love-msg"> I Love You Too! +3 </h2>
      `
      rightContainer.innerHTML = `
      <ul class="pet-stats-container">
        <li><div id="pet-stat-1-love" data-id=${petJson.id} class="pet-stats-item animated pulse">❤️</div></li>

        <li id="pet-stat-2-food" class="pet-stats-item">
        <img src="https://images.emojiterra.com/google/android-pie/512px/1f32e.png" width="60px" style="background-color:transparent;" draggable="true" ondragstart="drag(event)" id="drag1">
        </li>

        <li id="level" class="pet-stats-item">${petJson.level}</li>
        <li id="pet-play" class="pet-stats-item noselect">⚔️</li>
        <li><p hidden>${petJson.dead}</p></li>
      </ul>
      `
      setTimeout(removePulsateHeart, 2010)

    })
  // }
}

function allowDrop(e) {
  e.preventDefault()
}

function drag(e) {
  e.dataTransfer.setData("text", e.target.id)
}

function drop(e) {
  e.preventDefault()
  let data = e.dataTransfer.getData("text")
  //e.target.appendChild(document.getElementById(data))

  const level = document.querySelector("#level")

  fetch(`http://localhost:3000/pets/${e.target.dataset.id}`, {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
      body: JSON.stringify({
          "level": parseInt(level.innerText) + 5
      })
  })
  .then(resp => resp.json())
  .then(json => {
    level.innerText = json.level
    //const food = document.querySelector("#drag1")
    //food.innerText = getFood()
    bouncePet()
  })
}

function getFood() {
  const food = ['🍌','🍇','🍏','🥦','🥑','🍔','🌮','🥟','🍣','🍧','🍭','🍺','🍵','🍹']
  return food[getRandomInt(0, food.length)]
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function bouncePet() {
  innerContainer.innerHTML += `<h2>YAY FOOD! +5 </h2>`
  const thePet = document.querySelector("#the-pet")
  thePet.className = "box bounce"
  petContainer.className = "pet-container stage"
  setTimeout(stopBounce, 2010);
}

function stopBounce() {
  const thePet = document.querySelector("#the-pet")
  innerContainer.lastElementChild.remove()
  thePet.className = ""
  petContainer.className = "pet-container"
}

let decreaseLevel = setInterval(function() {

const thePet = document.querySelector("#the-pet")
const theLevel = document.querySelector("#level")

if (theLevel) {
  if(parseInt(theLevel.innerText) > 0 ){
    fetch(`http://localhost:3000/pets/${thePet.dataset.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        level: parseInt(theLevel.innerText) - 1
      })
    })
    .then(resp => resp.json())
    .then(json => {
      thePet.dataset.level = json.level
      theLevel.innerText = json.level
      return json.level
    })
    .then(level => {
      if (level <= 0) {
        ///
        fetch(`http://localhost:3000/pets/${thePet.dataset.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            dead: true
          })
        })
        .then(resp => resp.json())
        .then(petJson => {
          gameOver(thePet);

        })

        ///

    }})
  }
}
}, 3000)

function playRPS() {

  const playMsgElement = document.createElement("h5")
  playMsgElement.innerText = playMsg
  innerContainer.insertBefore(playMsgElement, innerContainer.firstChild)
  const thePet = document.querySelector("#the-pet")
  thePet.innerText = '🤔💭'
  innerContainer.innerHTML += `<div id="play-msg"><p>is thinking...</p>
  <h5>What do you choose?</h5>
  <p>Press R for 👊</p><p>Press P for 🖐</p><p>Press S for ✌️</p></div>`

  document.addEventListener('keydown', playRoshambo);
}

function playRoshambo(e) {
  let userChoice
  let petChoice = rpsValues[getRandomInt(0,3)]
  if(e.keyCode == 114 || e.keyCode == 82){
    alert("👊 You Picked ROCK 👊")
    userChoice = rpsValues[0]
    renderRPSResult( petChoice, userChoice)
    increaseLevelFromRPS(rpsWinner(petChoice, userChoice))
    setTimeout(removeRPSResult, 3000)
    document.removeEventListener("keydown", playRoshambo)
  }
  else if (e.keyCode == 59 || e.keyCode == 80){
    alert("🖐 You Picked PAPER 🖐")
    userChoice = rpsValues[1]
    renderRPSResult( petChoice, userChoice)
    increaseLevelFromRPS(rpsWinner(petChoice, userChoice))
    setTimeout(removeRPSResult, 3000)
    document.removeEventListener("keydown", playRoshambo)
  }
  else if (e.keyCode == 115 || e.keyCode == 83){
    alert("✌️ You picked SCISSORS ✌️")
    userChoice = rpsValues[2]
    renderRPSResult(petChoice, userChoice)
    increaseLevelFromRPS(rpsWinner(petChoice, userChoice))
    setTimeout(removeRPSResult, 3000)
    document.removeEventListener("keydown", playRoshambo)
  }
}

function addLevels(result) {
  if (result === 0){
    return 50
  }
  else if(result === 1){
    return 20
  }
  else {
    return 30
  }
}
function increaseLevelFromRPS(result) {
  const thePet = document.querySelector("#the-pet")
  const level = document.querySelector("#level")
  const addedLevels = addLevels(result)
  fetch(`http://localhost:3000/pets/${thePet.dataset.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      level: parseInt(thePet.dataset.level) + addedLevels
    })
  })
  .then(resp => resp.json())
  .then(petJson => {
    level.innerText = petJson.level
    thePet.dataset.level = petJson.level
  })
}

function removeRPSResult() {
  document.querySelector("#rps-msg").remove()
  document.querySelector("#rps-result").remove()
  document.querySelector("#the-pet").innerText = '😀'
}

function renderRPSResult(petChoice, userChoice) {

  document.querySelector("#play-msg").remove()
  const theWinner = rpsWinner(petChoice, userChoice)
    innerContainer.innerHTML += `<div id="rps-result">
      <h2>You picked ${userChoice.emoji}</h2>
      <h2>Your pet picked ${petChoice.emoji}</h2>
      </div>`
  const thePet = document.querySelector("#the-pet")
  thePet.innerHTML = rpsResultEmoji[theWinner]

  innerContainer.firstChild.innerHTML = `
    <h1 id="rps-msg">${theWinnerMsg(theWinner)}</h1>`

}


function theWinnerMsg(result) {
  if (result === 2) {
    return "It's a Tie. +30"
  }
  else if (result === 0){
    return "Your Pet Wins! +50"
  }
  else if (result === 1) {
    return "You Win! +20"
  }
}

function rpsWinner(petChoice, userChoice) {
  //return 0 if pet wins, 1 if user wins, 2 if tie
  if(petChoice.value === userChoice.value){
    return 2
  }
  else if ((petChoice.value === 'r' && userChoice.value === 's') || (petChoice.value === 's' && userChoice.value === 'p') || (petChoice.value === 'p' && userChoice.value === 'r')){
    return 0
  }
  else {
    return 1
  }
}

function gotchiNameSubmit(e) {
    e.preventDefault()
    const petName = {
      "name": e.target.form.name.value,
      "user_id": currentUserId
    }
    if (e.target.form.name.value.length >= 2 && e.target.form.name.value.length <= 20) {
    fetch("http://localhost:3000/pets", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      body: JSON.stringify(petName)
      })
    .then(resp => resp.json())
    .then(petsJson => {
      if (petsJson.errors){
        wholeAppHeader.innerHTML = petsJson.errors
      }
      else if(petsJson.dead) {
        wholeAppHeader.innerHTML = "Please create a new pet or pick one that's alive."
      }
      else {
        currentPetId = petsJson.id
        console.log(petsJson.user)
        wholeAppHeader.innerHTML = `
        <b>Username:</b> ${petsJson.user.username} ▪️
        <b>Pet name:</b> ${petsJson.name}
        <p hidden>${petsJson.dead}</p>
        `
        //Calls on gotchi game function with user & pet ids
        gotchiGame(currentUserId, petsJson)
      }
    })
     // end petsJson
  } else {
    alert('Name must be between 2 and 20 characters.')
  }
}

function gameOver(pet) {
  clearInterval(decreaseLevel);
  pet.innerHTML = `<h3>🚑😵👻🔥</h3>
  <h5>GAME OVER</h5>`
  //NEED TO REMOVE EVENT LISTENER
  // where i stopped before lecture
  rightContainer.className = "grayOut"
  }

// function background() {
//   innerContainer.innerHTML += `<div class="grass"></div>`
// }
