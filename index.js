const express = require("express")
const app = express();
const port = 9999;
const expressLayouts = require('express-ejs-layouts');
const omdbSearch = require('omdb-api-search');
const omdb = omdbSearch.createClient(process.env.OMDB_API_KEY)
const session = require("express-session")
const MemoryStore = require('memorystore')(session)

const getHorses = require("./get_horses")
let horses;

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'Godogsgo',
    resave: false,
    saveUninitialized: true,
}))


app.get(["/", "", "/home"], (req, res) => {
    horses = getHorses();
    res.render("home", { horses, currentBalance: req.session.currentBalance})
    
});

app.post("/race-day", (req, res) => {
    let bet = req.body.bet
    let result = []
    for (horse of horses) {
        omdb.findOneByTitle(horse.name, (err, res) => {
            result.push(res.Title)
        })
    }
    setTimeout(() => {
        res.render("race_day", { horses, userSelection: req.body.userSelection, result, bet})
    }, 2500) 
    
})

app.listen(port, () => {
    console.log(`now listening on ${port}`);
});