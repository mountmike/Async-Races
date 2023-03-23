const mainContainer = document.querySelector("main");
const balanceOutput = document.querySelector("#balanceOutput")
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
const defaultBalance = 100;
let currentBalance = defaultBalance
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
    mainContainer.appendChild(form)
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
        span.textContent = index.odds
        col1.appendChild(input)
        col2.appendChild(label)
        col3.appendChild(span)
    }
}

function buildBetSelector() {
    let div = document.createElement("div")
    div.className = "div-container"
    mainContainer.appendChild(div)
    let label = document.createElement("label")
    label.textContent = "How much do you wanna bet?"
    let input = document.createElement("input")
    input.type = "number"
    input.id = "betInput"
    input.min = 1
    input.max = currentBalance
    input.value = 1
    let submitBtn = document.createElement("button")
    submitBtn.textContent = "Start Race"
    submitBtn.id = "startRaceBtn"
    submitBtn.disabled = true
    div.appendChild(label)
    div.appendChild(input)
    div.appendChild(submitBtn)
}

function populateResults(array) {
    let orderedList = document.createElement("ol")
    mainContainer.appendChild(orderedList)
    for (index of array) {
        let li = document.createElement("li")
        li.textContent = index
        orderedList.appendChild(li)
    }
}

function depopulateParent(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function updateBalance() {
    balanceOutput.textContent = `$${currentBalance}`
}

function getRandomHorses() {
    let result = []
    for (i = 0; i < 8; i++) {
        let randomIndex = Math.floor(Math.random() * allHorses.length)
        let odds = Math.random() * ((i+1.4) - 1) + 1
        let obj = { name: allHorses[randomIndex], odds: Math.round((odds + Number.EPSILON) * 100) / 100}
        result.push(obj)
    }
    return result
}

function buildPage() {
    depopulateParent(mainContainer)
    currentRace = getRandomHorses(allHorses)
    populateContestants(currentRace)
    buildBetSelector()
    updateBalance()
}

buildPage()

const selectHorseInputs = document.querySelectorAll("input")
selectHorseInputs.forEach(input => input.addEventListener("click", handleSelection))
const startRaceBtn = document.querySelector("#startRaceBtn")
startRaceBtn.addEventListener("click", startRace)
const betInput = document.querySelector("#betInput")

function handleSelection(event) {
    currentHorseSelection = event.target.value
    startRaceBtn.disabled = false
}

function startRace(event) {
    currentBet = betInput.value
    currentBalance = currentBalance - currentBet
    updateBalance()
    depopulateParent(mainContainer)
    releaseHorses()
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
            populateResults(raceResults)
        })
}