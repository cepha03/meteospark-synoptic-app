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
btnPredict.addEventListener('click', () => alert('in progress'))

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