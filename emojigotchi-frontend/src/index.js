const petContainer = document.querySelector("#pet-container")
const welcomeMsg = document.querySelector("h2")
const petNameHeader = document.querySelector("h3")
const innerContainer = document.querySelector("#inner-container")
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
                "user_id": userJson.id,
                "level": 0
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
              petNameHeader.innerText = `Your pet's name is: ${petsJson.name}`
            }) // end petsJson
          }
        })// end name submit event listener
    })
})
