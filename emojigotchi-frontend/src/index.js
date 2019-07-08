const petContainer = document.querySelector(".pet-container")
const welcomeMsg = document.querySelector("h2")
const petNameHeader = document.querySelector("h3")
const innerContainer = document.querySelector("#inner-container")
const loveBar = document.querySelector("#pet-stat-1-love")
const rightContainer = document.querySelector("#right-container")
const userInfoContainer = document.querySelector(".user-info-container")
let currentUserId


function loadLoginForm() {
    innerContainer.innerHTML =
        `<form id='login-form'>
            <label for='username'>Username:</label><br>
            <input name="username" id="username">
        </form>

        <button type="submit" form="login-form" value="Submit">Submit</button>
      `
}

function nameYourGotchi() {
  innerContainer.innerHTML =
  `<form id='emoji-name-form'>
      <label for='name'>New Pet's Name:</label><br>
      <input name="name" id="name">
  </form>

  <button form="emoji-name-form" id="emoji-name-form-btn">Submit</button>
`
}

// Creates the game
function gotchiGame(userId, currentPet) {
  innerContainer.innerHTML = `
    <div id="the-pet" data-id=${currentPet.id}>😀</div>
  `
  rightContainer.innerHTML = `
  <ul class="pet-stats-container">
    <li id="pet-stat-1-love" data-id=${currentPet.id} class="pet-stats-item">❤️</li>
    <li id="pet-stat-2-food" class="pet-stats-item">🍏</li>
    <li id="level" class="pet-stats-item">${currentPet.level}</li>
    <li id="pet-stat-4-bepis" class="pet-stats-item">🍆</li>
  </ul>
  `
  petContainer.addEventListener('click', likeMyPet) // love click event listener
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
        <div id="the-pet" data-id=${petJson.id}>😀</div>
      `
      rightContainer.innerHTML = `
      <ul class="pet-stats-container">
        <li id="pet-stat-1-love" data-id=${petJson.id} class="pet-stats-item">❤️</li>
        <li id="pet-stat-2-food" class="pet-stats-item">🍏</li>
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
            }) // end petsJson
          }
        })// end name submit event listener
    })
})
