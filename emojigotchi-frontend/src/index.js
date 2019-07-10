const petContainer = document.querySelector(".pet-container")
const welcomeMsg = document.querySelector("h2")
const petNameHeader = document.querySelector("h3")
const innerContainer = document.querySelector("#inner-container")
const loveBar = document.querySelector("#pet-stat-1-love")
const rightContainer = document.querySelector("#right-container")
const userInfoContainer = document.querySelector(".user-info-container")
const petFood = document.querySelector("#pet-stat-2-food")
const wholeAppHeader = document.querySelector("#overall-app-header")

let gameStarted = false

let currentUserId

function loadLoginForm() {
    innerContainer.innerHTML =
        `
        <div class="nes-field is-inline">
        <form style="margin:auto;margin-top:25%;" id='login-form'>
            <label for='username'>Username:</label><br>
            <input name="username" id="username" value="a" class="nes-input is-success">
            <br>
            <button class="nes-btn is-success" type="submit" form="login-form" value="Submit">Submit</button>
            </form>

        </div>


      `
}

function nameYourGotchi(userInfo) {
  fetch("http://localhost:3000/pets")
  .then(resp => resp.json())
  .then(petsJson => {
    innerContainer.innerHTML =
      `
      <div><h2>Username: ${userInfo.username}</h2></div>

      <div class="nes-field is-inline">
        <form id='emoji-name-form' style="margin:auto;margin-top:10%;">
            <label  for='name'>New Pet's Name:</label><br>
            <input name="name" id="name" value="bepis" class="nes-input is-success">
            <br>
            <button class="nes-btn is-success" form="emoji-name-form" id="emoji-name-form-btn">Submit</button>
        </form>
    </div>
    <br>
    <br>
    <div><h3>Pets:</h3></div>
    `
    petsJson.forEach(function(element) {
      if (element.user_id === userInfo.id) {
        if (element.dead === false){
          innerContainer.innerHTML += `<p>${element.name}</p>`;
        } else {
          innerContainer.innerHTML += `<p class="grayOut">☠️ ${element.name}</p>`;
        }
      }
    });

    })
}

// Creates the game
function gotchiGame(userId, currentPet) {
  if (currentPet.dead === false) {
    innerContainer.innerHTML = `
      <div id="the-pet" data-id=${currentPet.id} ondrop="drop(event)" ondragover="allowDrop(event)">😀</div>

    `
    rightContainer.innerHTML = `
    <ul class="pet-stats-container">
      <li id="pet-stat-1-love" data-id=${currentPet.id} class="pet-stats-item">❤️</li>



          <li id="pet-stat-2-food" class="pet-stats-item">

          <img src="https://images.emojiterra.com/google/android-pie/512px/1f32e.png" style="background-color:transparent;" width="60px" draggable="true" ondragstart="drag(event)" id="drag1">
          </li>



      <li id="level" class="pet-stats-item">${currentPet.level}</li>
      <li id="pet-stat-4-bepis" class="pet-stats-item">🍆</li>
      <li><p hidden>${currentPet.dead}</p></li>
    </ul>
    `
    rightContainer.addEventListener('click', likeMyPet) // love click event listener
    //gameStarted = true
  } else {
    clearInterval(decreaseLevel);
    thePet.innerHTML = `<h3>🚑😵👻🔥</h3>
    <h5>GAME OVER</h5>`
    //NEED TO REMOVE EVENT LISTENER
    rightContainer.className = "grayOut"
  }
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
        <img src="https://images.emojiterra.com/google/android-pie/512px/1f32e.png" width="60px" style="background-color:transparent;" draggable="true" ondragstart="drag(event)" id="drag1">
        </li>

        <li id="level" class="pet-stats-item">${petJson.level}</li>
        <li id="pet-stat-4-bepis" class="pet-stats-item">🍆</li>
        <li><p hidden>${currentPet.dead}</p></li>
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
        wholeAppHeader.innerHTML = `<b>Username:</b> ${userJson.username} ▪️`

        nameYourGotchi(userJson)

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

              wholeAppHeader.innerHTML += `
              <b>Pet name:</b> ${petsJson.name} ▪️
              <b>Pet id:</b> ${currentPetId}
              <p hidden>${petsJson.dead}</p>
              `
              //Calls on gotchi game function with user & pet ids
              gotchiGame(currentUserId, petsJson)

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

let decreaseLevel = setInterval(function() {
  const thePet = document.querySelector("#the-pet")
  const theLevel = document.querySelector("#level")
  const rightContainer = document.querySelector("#right-container")
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
          clearInterval(decreaseLevel);
          thePet.innerHTML = `<h3>🚑😵👻🔥</h3>
          <h5>GAME OVER</h5>`
          //NEED TO REMOVE EVENT LISTENER
          rightContainer.className = "grayOut"

        })

        ///

    }})
  }
}, 3000)
