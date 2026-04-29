import './style.css'

import { startAuth } from './components/auth.js'
import { startTheme } from './components/theme.js'
import { startPredict } from './components/predict.js'
import { startLearn } from './components/learn.js'
import { initGame } from './components/game.js'

startAuth()
startTheme()
startLearn()
startPredict()
initGame()

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

