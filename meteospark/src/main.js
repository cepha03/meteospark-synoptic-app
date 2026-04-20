import './style.css'
import { supabase } from './supabaseInfo.js'

const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const btnLogin = document.getElementById('btn-login')
const btnReg = document.getElementById('btn-register')
const btnLogout = document.getElementById('btn-logout')
const authMsg = document.getElementById('auth-message')

const authContainer = document.getElementById('auth-block')
const dashboardContainer = document.getElementById('dashboard-container')
const userEmailDisplay = document.getElementById('user-email-display')

const btnLearn = document.getElementById('btn-learn')
const btnGame = document.getElementById('btn-game')
const btnPredict = document.getElementById('btn-predict')
const learnContainer = document.getElementById('learn-container')
const btnBack = document.getElementById('btn-back')

const toggleDark = document.getElementById('btn-toggle-dark')
const htmlElement = document.documentElement

// CONST VARIABLES FOR PREDICT PAGE
const predictContainer = document.getElementById('predict-container')
const backPredict = document.getElementById('back-to-dash-predict')

const predictForm = document.getElementById('predict-form')
const predResult = document.getElementById('pred-result')
const tempDisplay = document.getElementById('temp-display')
const predError = document.getElementById('pred-error')
const btnSubmitPredict = document.getElementById('btn-submit-predict')

const showMsg = (message, isError = false) => {
  authMsg.textContent = message
  authMsg.className = `text-sm text-center block ${isError ? 'text-red-500' : 'text-green-600'}`
}

btnReg.addEventListener('click', async () => {
  const email = emailInput.value
  const password = passwordInput.value
  if (!email && !password)
    return showMsg('No credentials were entered,', true)
  else if (email && !password)
    return showMsg('No password was entered,', true)
  else if (!email && password)
    return showMsg('No email was entered,', true)

  const { error } = await supabase.auth.signUp({ email, password })
  if (error) 
    showMsg(error.message, true)
  else 
    showMsg('Success! Account created.')
})

btnLogin.addEventListener('click', async () => {
  const email = emailInput.value
  const password = passwordInput.value
  if (!email && !password)
    return showMsg('No credentials were entered,', true)
  else if (email && !password)
    return showMsg('No password was entered,', true)
  else if (!email && password)
    return showMsg('No email was entered,', true)

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) 
    showMsg(error.message, true)
})

btnLogout.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut()
  if (error) 
    console.error('Error logging out. Try again..:', error.message)
})

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    authContainer.classList.add('hidden')
    learnContainer.classList.add('hidden')
    dashboardContainer.classList.remove('hidden')
    userEmailDisplay.textContent = `Logged in as: ${session.user.email}`
  } else {
    authContainer.classList.remove('hidden')
    dashboardContainer.classList.add('hidden')
    emailInput.value = ''
    passwordInput.value = ''
    authMessage.classList.add('hidden')
  }
})


btnLearn.addEventListener('click', () => {
  dashboardContainer.classList.add('hidden')
  learnContainer.classList.remove('hidden')
})

btnBack.addEventListener('click', () => {
  learnContainer.classList.add('hidden')
  dashboardContainer.classList.remove('hidden')
})

btnGame.addEventListener('click', () => alert('in progress'))

const meteoLearn = [
  {
    id: "module-1",
    title: "The Atmosphere",
    content: "All weather happens in the troposphere! Let's learn about it.."
  },
  {
    id: "module-2",
    title: "Cloud Types",
    content: "Clouds are categorized by their altitude and shape. Let's learn about it.."
  }
]

if (
  localStorage.getItem('theme') === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  htmlElement.classList.add('dark')
} else {
  htmlElement.classList.remove('dark')
}

toggleDark.addEventListener('click', () => {
  htmlElement.classList.toggle('dark')
  

  if (htmlElement.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark')
  } else {
    localStorage.setItem('theme', 'light')
  }
})

//predict page componentds

btnPredict.addEventListener('click', () => {
  document.getElementById('dashboard-container').classList.add('hidden')
  predictContainer.classList.remove('hidden')
})

backPredict.addEventListener('click', () => {
  predictContainer.classList.add('hidden')
  document.getElementById('dashboard-container').classList.remove('hidden')
  
  //reset the form when leaving
  predResult.classList.add('hidden')
  predError.classList.add('hidden')
  predictForm.reset()
})

//machine Learning API Call
predictForm.addEventListener('submit', async (e) => {
  e.preventDefault() //prevent the page from reloading
  
  //hide previous results/errors and then show loading state
  predResult.classList.add('hidden')
  predError.classList.add('hidden')
  btnSubmitPredict.textContent = 'Analysing...'
  btnSubmitPredict.disabled = true

  //gather data from inputs
  const requestInfo = {
    month: document.getElementById('input-month').value,
    nao: document.getElementById('input-nao').value,
    ao: document.getElementById('input-ao').value
  }

  try {
    //send POST request to flask backend
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestInfo)
    })

    const data = await response.json()

    if (data.success) {
      //show the predicted temperature
      tempDisplay.textContent = `${data.predicted_temperature} °C`
      predResult.classList.remove('hidden')
    } else {
      //show error from backend
      predError.textContent = `Error: ${data.error}`
      predError.classList.remove('hidden')
    }

  } catch (error) {
    //show network error
    predError.textContent = 'Failed to connect to the AI server. Try again.'
    predError.classList.remove('hidden')
  } finally {
    //reset button state
    btnSubmitPredict.textContent = 'Generate Forecast'
    btnSubmitPredict.disabled = false
  }
})

