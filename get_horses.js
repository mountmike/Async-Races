const fs = require("fs")
const _ = require("underscore")

function getHorses() {
    let result = []
    let data = fs.readFileSync("movies.txt").toString().split("\n")
    for (i = 0; i < 8; i++) {
        let num = Math.random() * ((i+1.4) - 1) + 1
        let obj = { name: _.sample(data), odds: Math.round((num + Number.EPSILON) * 100) / 100}
        result.push(obj)
    }
    return result
}

module.exports = getHorses