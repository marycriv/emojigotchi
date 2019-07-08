const petContainer = document.querySelector("#pet-container")
const welcomeMsg = document.querySelector("h2")
const petNameHeader = document.querySelector("h3")
const innerContainer = document.querySelector("#inner-container")
const loveBar = document.querySelector("#love-for-owner")
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
      <label for='name'>Name:</label><br>
      <input name="name" id="name">
  </form>

  <button form="emoji-name-form" id="emoji-name-form-btn">Submit</button>
`
}

// Creates the game
function gotchiGame(userId, currentPet) {
  innerContainer.innerHTML = `
    <div id="the-pet" data-id=${currentPet.id}>😀</div>
    <div id="level">${currentPet.level}</div>
    <div id="love-from-owner" data-id=${currentPet.id}>❤️</div>
  `
  innerContainer.addEventListener('click', likeMyPet) // love click event listener
}

function likeMyPet(e) {
  e.preventDefault()
  if (e.target.id === "the-pet" || e.target.id === "love-from-owner") {
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
        <div id="level">${petJson.level}</div>
        <div id="love-from-owner" data-id=${petJson.id}>❤️</div>
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
        welcomeMsg.innerText = `Hello, ${userJson.username}`
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
              petNameHeader.innerText = `Your pet's name is: ${petsJson.name} & its id is ${currentPetId}`

              //Calls on gotchi game function with user & pet ids
              gotchiGame(currentUserId, petsJson)
            }) // end petsJson
          }
        })// end name submit event listener
    })
})
