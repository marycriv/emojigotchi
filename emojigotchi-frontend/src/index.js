const petContainer = document.querySelector("#pet-container")
const welcomeMsg = document.querySelector("h2")
const innerContainer = document.querySelector("#inner-container")
let currentUser


function loadLoginForm() {
    innerContainer.innerHTML =
        `<form id='login-form'>
            <label for='username'>Username:</label><br>
            <input name="username" id="username">
            <br>
            <label for='password'>Password:</label><br>
            <input name="password" id="password">
        </form>

        <button type="submit" form="login-form" value="Submit">Submit</button>
      `
}

loadLoginForm()
petContainer.addEventListener('submit', e => {
    e.preventDefault()
    const data = {
        "username": e.target.username.value,
        "password": e.target.password.value
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
        welcomeMsg.innerText = `Hello, ${json.username}`
        innerContainer.innerHTML = `
            GAME GOES HERE
        `
    })
})
