const globalDOM = {
    mainContainer: document.querySelector("main"),
    headerContainer: document.querySelector("header"),
    submitBtn: document.createElement("button"),
    balanceOutput: document.createElement("h3")
}
const allHorses = [
    'The Shawshank Redemption',
    'The Godfather',
    'The Dark Knight',
    "Schindler's List",
    'The Return of the King',
    'Pulp Fiction',
    'The Good, the Bad and the Ugly',
    'Forrest Gump',
    'Fight Club',
    'Inception',
    'Matrix',
    'The Real Goodfella',
    'Seven Samurai',
    'Silence of the Lambs',
    'Interstellar',
    'Life Is Beautiful',
    'The Green Mile',
    'Terminator',
    'Back to the Future',
    'Spirited Away',
    'The Pianist',
    'Psycho',
    'Parasite',
    'Leon',
    'The Lion King',
    'Gladiator',
    'Prestige',
    'Whiplash',
    'Casablanca',
    'Grave of the Fireflies',
    'Harakiri',
    'Untouchable',
    'Modern Times',
    'Once Upon a Time in the West',
    'Rear Window',
    'Alien',
    'City Lights',
    'Apocalypse Now',
    'Memento',
    'Django Unchained',
    'Sunset Blvd',
    'Paths of Glory',
    'The Shining',
    'The Great Dictator',
    'American Beauty',
    'Dr. Strangelove',
    'Oldboy',
    'Amadeus',
    'Coco',
    'Joker',
    'Braveheart',
    'Das Boot'
]

let currentBalance = 100;
let currentRace = [];
let raceResults = [];
let currentHorseSelection;
let currentBet;

function populateContestants(array) {
    let form = document.createElement("form")
    form.id = "preRaceList"
    let table = document.createElement("table")
    let tr = document.createElement("tr")
    let heading1 = document.createElement("th")
    heading1.textContent = ""
    let heading2 = document.createElement("th")
    heading2.textContent = "Horses"
    let heading3 = document.createElement("th")
    heading3.textContent = "Odds"
    globalDOM.mainContainer.appendChild(form)
    form.appendChild(table)
    table.appendChild(tr)
    tr.appendChild(heading1)
    tr.appendChild(heading2)
    tr.appendChild(heading3)
    for (index of array) {
        let tr = document.createElement("tr")
        table.appendChild(tr)
        let col1 = document.createElement("td")
        let col2 = document.createElement("td")
        let col3 = document.createElement("td")
        tr.appendChild(col1)
        tr.appendChild(col2)
        tr.appendChild(col3)
        let label = document.createElement("label")
        let input = document.createElement("input")
        let span = document.createElement("span")
        label.textContent = index.name
        label.for = "currentBet"
        input.type = "radio"
        input.name = "currentBet"
        input.value = index.name
        input.addEventListener("click", handleSelection)
        span.textContent = `$${index.odds}`
        col1.appendChild(input)
        col2.appendChild(label)
        col3.appendChild(span)
    }
}

function buildBetSelector() {
    let div = document.createElement("div")
    div.className = "div-container"
    globalDOM.mainContainer.appendChild(div)
    let label = document.createElement("label")
    label.textContent = "How much do you wanna bet?"
    let errorMSG = document.createElement("p")
    errorMSG.id = "errorMSG"
    let input = document.createElement("input")
    input.type = "number"
    input.id = "betInput"
    input.min = 1
    input.max = currentBalance
    input.value = 1
    globalDOM.submitBtn.textContent = "Start Race"
    globalDOM.submitBtn.id = "startRaceBtn"
    globalDOM.submitBtn.disabled = true
    globalDOM.submitBtn.addEventListener("click", startRace)
    div.appendChild(label)
    div.appendChild(input)
    div.appendChild(globalDOM.submitBtn)
    div.appendChild(errorMSG)
}

function populateResults(array) {
    globalDOM.mainContainer.style.backgroundColor = "white"
    let orderedList = document.createElement("ol")
    globalDOM.mainContainer.appendChild(orderedList)
    for (index of array) {
        let li = document.createElement("li")
        li.textContent = index
        li.id = index
        orderedList.appendChild(li)
    }
    let div = document.createElement("div")
    div.className = "div-container"
    globalDOM.mainContainer.appendChild(div)
    let p = document.createElement("p")
    if (raceResults[0] === currentHorseSelection) {
        let winnings = Math.round(currentBet * currentRace.filter(horse => horse.name === currentHorseSelection)[0].odds * 100) / 100
        currentBalance = currentBalance + winnings;
        updateBalance()
        p.textContent = `You won! ${currentHorseSelection} came first and you won $${winnings}! Congradulations!`
        div.appendChild(p)
        orderedList.firstChild.style.fontWeight = "bold"
    } else {
        document.querySelector(`#${currentHorseSelection}`).style.fontWeight = "bold"
        p.textContent = `I'm sorry, you lost. ${currentHorseSelection} came in at position number ${raceResults.indexOf(currentHorseSelection) + 1}`
        div.appendChild(p)
    }
    let playAgainBtn = document.createElement("button")
    playAgainBtn.id = "playAgainBtn"
    playAgainBtn.textContent = "Another Race?"
    playAgainBtn.addEventListener("click", buildPage)
    div.appendChild(playAgainBtn)
}

function depopulateParent(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function updateBalance() {
    currentBalance = Math.round(currentBalance * 100) / 100
    if (currentBalance < 10) {
        globalDOM.balanceOutput.style.color = "red"
    } else {
        globalDOM.balanceOutput.style.color = "inherit"
    }
    globalDOM.balanceOutput.textContent = `Account Balance: $${currentBalance}`
}

function getRandomHorses() {
    let result = []
    for (i = 0; i < 8; i++) {
        let randomIndex = Math.floor(Math.random() * allHorses.length)
        let odds = Math.random() * ((i+2) - 1) + 1
        let obj = { name: allHorses[randomIndex], odds: Math.round((odds + Number.EPSILON) * 100) / 100}
        result.push(obj)
    }
    return result
}

function handleSelection(event) {
    globalDOM.submitBtn.disabled = false
    currentHorseSelection = event.target.value
}

function startRace(event) {
    currentBet = Number(betInput.value)
    if (currentBet < 1 || currentBet > currentBalance) {
        document.querySelector("#errorMSG").textContent = `Invalid input! Please enter a number between 0 and ${currentBalance}.`
        return
    }
    currentBalance = currentBalance - currentBet
    updateBalance()
    depopulateParent(globalDOM.mainContainer)
    releaseHorses()
    buildRaceAnimation()
    setTimeout(() => {
        let field = document.querySelector(".field")
        field.style.visibility = "hidden"
        populateResults(raceResults)
    }, 4500)
}

function releaseHorses() {
    let promises = []
    for (i = 0; i < currentRace.length; i++) {
        promises[i] = fetch(`https://omdbapi.com/?apikey=2f6435d9&t=${currentRace[i].name}`)
        .then(res => res.json())
        .then(res => {
            return res.Title
        }) 
    }
    Promise.all(promises)
        .then(res => {
            raceResults = res
        })
}

function buildRaceAnimation() {
    let div = document.createElement("div")
    div.className = "field"
    globalDOM.mainContainer.appendChild(div)
    let horseDivs = []
    for (i = 1; i < 9; i++) {
        let horse = document.createElement("div")
        div.id = `horse${i}`
        let img = document.createElement("img")
        img.src = "https://media.tenor.com/mc5h0vgHJvEAAAAi/horse-cowboy.gif"
        horse.appendChild(img)
        horseDivs.push(horse)
    }
    horseDivs.forEach(horse => div.appendChild(horse))
    globalDOM.mainContainer.style.backgroundColor = "inherit"
}

function buildPage() {
    depopulateParent(globalDOM.mainContainer)
    currentRace = getRandomHorses(allHorses)
    populateContestants(currentRace)
    buildBetSelector()
    updateBalance()
    globalDOM.headerContainer.appendChild(globalDOM.balanceOutput)
}

buildPage()


