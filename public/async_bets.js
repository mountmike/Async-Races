const instructions = ["Hi and welcome to the omdb async races!", "Here are the horses today, choose a winner!"]

const defaultBalance = 100;
localStorage.setItem("currentBalance", defaultBalance);

let instructionIndex = 0;

// DOM variables
const instructionOutput = document.querySelector(".instructions")
const mainWrapper = document.querySelector(".main-wrapper")
const bankBalanceOutput = document.querySelector(".bank-balance")

const nextBtn = document.querySelector("#nextBtn")
nextBtn.addEventListener("click", buttonHandler)
const horseSelector = document.querySelector("#horseSelector")
horseSelector.addEventListener("change", horseSelectionHandler)



function buttonHandler(event) {
    if (event.target.textContent === "Next") {
        instructionIndex++
        instructionHandler()
    } else if (event.target.textContent === "Previous") {
        instructionIndex--
        instructionHandler()
    }
}

function horseSelectionHandler(event) {
    userSelection = event.target.value
}

function instructionHandler() {
    if (instructionIndex >= instructions.length -1) {
        nextBtn.style.visibility = "hidden";
    } else {
        nextBtn.style.visibility = "visible";
    }

    if (instructionIndex === 1) {
        mainWrapper.style.visibility = "visible"
    } else {
        mainWrapper.style.visibility = "hidden"
    }


    instructionOutput.textContent = instructions[instructionIndex]
}

function updateBankBalance() {
    bankBalanceOutput.textContent = `$${localStorage.getItem("currentBalance")}`
}

function startRace() {
    let result = []
    for (horse of clientSideHorses) {
        omdb.findOneByTitle(horse.name, (err, res) => {
            result.push(res.Title)
        })
    }
    setTimeout(() => {
        announceWinner(result)
    }, 2000) 

}

function announceWinner(arr) {
    if (arr[0] === movies[userBet]) {
        console.log("YOU WON!");
    } else {
        console.log("Sorry, your horse came in at position " + arr.indexOf(movies[userBet])) + 1;
    }
}


function init() {
    instructionHandler()
    updateBankBalance()
}

init()