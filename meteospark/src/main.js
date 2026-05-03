import './style.css'

//import all pages with corresponding method to be executed
import { startAuth } from './components/auth.js'
import { startTheme } from './components/theme.js'
import { startPredict } from './components/predict.js'
import { startLearn } from './components/learn.js'
import { initGame } from './components/game.js'
import { initProfile } from './components/profile.js'

//executing each individial method main for each page
startAuth()
startTheme()
startLearn()
startPredict()
initGame()
initProfile()

//const variables for buttons and containers
const dashboardContainer = document.getElementById('dashboard-container')
const btnLearn = document.getElementById('btn-learn')
const btnGame = document.getElementById('btn-game')
const btnPredict = document.getElementById('btn-predict')
const learnContainer = document.getElementById('learn-container')
const gameContainer = document.getElementById('game-container')

// CONST VARIABLES FOR PREDICT PAGE
const predictContainer = document.getElementById('predict-container')

btnLearn.addEventListener('click', () => {
  dashboardContainer.classList.add('hidden')
  learnContainer.classList.remove('hidden')
})

btnGame.addEventListener('click', () => {
  dashboardContainer.classList.add('hidden')
  gameContainer.classList.remove('hidden')
})

//predict page componentds

btnPredict.addEventListener('click', () => {
  document.getElementById('dashboard-container').classList.add('hidden')
  predictContainer.classList.remove('hidden')
})

