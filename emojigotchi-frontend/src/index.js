const petContainer = document.querySelector(".pet-container")
const welcomeMsg = document.querySelector("h2")
const petNameHeader = document.querySelector("h3")
const innerContainer = document.querySelector("#inner-container")
const loveBar = document.querySelector("#pet-stat-1-love")
const rightContainer = document.querySelector("#right-container")
const userInfoContainer = document.querySelector(".user-info-container")
const petFood = document.querySelector("#pet-stat-2-food")

let gameStarted = false

let currentUserId



function loadLoginForm() {
    innerContainer.innerHTML =
        `
        <form id='login-form'>
            <label for='username'>Username:</label><br>
            <input name="username" id="username" value="a">
        </form>

        <button class="nes-btn is-success" type="submit" form="login-form" value="Submit">Submit</button>

      `
}

function nameYourGotchi() {
  innerContainer.innerHTML =
  `<form id='emoji-name-form'>
      <label for='name'>New Pet's Name:</label><br>
      <input name="name" id="name" value="bepis">
  </form>

  <button class="nes-btn is-success" form="emoji-name-form" id="emoji-name-form-btn">Submit</button>
`
}

// Creates the game
function gotchiGame(userId, currentPet) {
  innerContainer.innerHTML = `
    <div id="the-pet" data-id=${currentPet.id} ondrop="drop(event)" ondragover="allowDrop(event)">😀</div>
  `
  rightContainer.innerHTML = `
  <ul class="pet-stats-container">
    <li id="pet-stat-1-love" data-id=${currentPet.id} class="pet-stats-item">❤️</li>


    
        <li id="pet-stat-2-food" class="pet-stats-item">

        <span draggable="true" ondragstart="drag(event)" id="drag1">
        ${getFood()}
        </span>
        </li>
        


    <li id="level" class="pet-stats-item">${currentPet.level}</li>
    <li id="pet-stat-4-bepis" class="pet-stats-item">🍆</li>
  </ul>
  `
  petContainer.addEventListener('click', likeMyPet) // love click event listener
  //gameStarted = true
 
}

function likeMyPet(e) {
  e.preventDefault()
  if (e.target.id === "the-pet" || e.target.id === "pet-stat-1-love") {
    let currentLevel = parseInt(document.querySelector("#level").innerText)
    fetch(`http://localhost:3000/pets/${e.target.dataset.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "level": currentLevel + 1
        })
    })
    .then(resp => resp.json())
    .then(petJson => {
      innerContainer.innerHTML = `
        <div id="the-pet" data-id=${petJson.id}  ondrop="drop(event)" ondragover="allowDrop(event)">😀</div>
      `
      rightContainer.innerHTML = `
      <ul class="pet-stats-container">
        <li id="pet-stat-1-love" data-id=${petJson.id} class="pet-stats-item">❤️</li>

        <li id="pet-stat-2-food" class="pet-stats-item">
        <span draggable="true" ondragstart="drag(event)" id="drag1">
        ${getFood()}
        </span>
        </li>

        <li id="level" class="pet-stats-item">${petJson.level}</li>
        <li id="pet-stat-4-bepis" class="pet-stats-item">🍆</li>
      </ul>
      `
    })
  }
}

loadLoginForm()
petContainer.addEventListener('submit', e => {
    e.preventDefault()
    const username = {
        "username": e.target.username.value
    }
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
        userInfoContainer.innerHTML = `<div class="user-info-item">Name: ${userJson.username}</div>`

        nameYourGotchi()

        petContainer.addEventListener('click', e => {
            e.preventDefault()
            if (e.target.id === "emoji-name-form-btn") {
              const petName = {
                "name": e.target.form.name.value,
                "user_id": userJson.id
              }
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
              currentPetId = petsJson.id

              userInfoContainer.innerHTML += `
              <div class="user-info-item">Pet name: ${petsJson.name}</div>
              <div class="user-info-item">Pet id: ${currentPetId}</div>
              `
              //Calls on gotchi game function with user & pet ids
              gotchiGame(currentUserId, petsJson)
              decreaseLevel()
            }) // end petsJson
          }
        })// end name submit event listener
    })
})

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
          "level": parseInt(level.innerText) + 3
      })
  })
  .then(resp => resp.json())
  .then(json => {
    level.innerText = json.level
    const food = document.querySelector("#drag1")
    food.innerText = getFood()
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
  innerContainer.innerHTML += `<h2>YAY FOOD! +3 </h2>`
  const thePet = document.querySelector("#the-pet")
  thePet.className = "box bounce"
  petContainer.className = "pet-container stage"
  setTimeout(stopBounce, 2010);
}

function stopBounce() {
  innerContainer.lastElementChild.remove()
  const thePet = document.querySelector("#the-pet")
  thePet.className = ""
  petContainer.className = "pet-container" 
}

function depreciateScore() {
  const thePet = document.querySelector("#the-pet")
  const theLevel = document.querySelector("#level")
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
  })
}

function decreaseLevel() {
  setInterval(depreciateScore, 2000)
}
