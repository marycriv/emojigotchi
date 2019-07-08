const petContainer = document.querySelector("#pet-container")
const welcomeMsg = document.querySelector("h2")
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

loadLoginForm()
petContainer.addEventListener('submit', e => {
    e.preventDefault()
    const data = {
        "username": e.target.username.value
    }
    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(json => {
        currentUserId = json.id
        welcomeMsg.innerText = `Hello, ${json.username}`
        innerContainer.innerHTML = `
            GAME GOES HERE
        `
    })
})
