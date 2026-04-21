import {supabase} from '../supabaseInfo.js'

export function startAuth() {
    const authContainer = document.getElementById('auth-block')
    const dashboardContainer = document.getElementById('dashboard-container')
    const userEmailDisplay = document.getElementById('user-email-display')
    const btnLogin = document.getElementById('btn-login')
    const btnReg = document.getElementById('btn-register')
    const btnLogout = document.getElementById('btn-logout')
    const authMsg = document.getElementById('auth-message')
    const emailInput = document.getElementById('email')
    const passwordInput = document.getElementById('password')

    if(!authContainer)
    {
        return
    }

    //error message for unsuccessful auth
    const showMsg = (message, isError = false) => {
        authMsg.textContent = message
        authMsg.className = `text-sm text-center block ${isError ? 'text-red-500' : 'text-green-600'}`
    }

    //event listener for register button. added valiidation for missing fields 
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

    //event listener for login button. added valiidation for missing fields 
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

    //once auth is successful, user is sent to the dashboard
    supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            authContainer.classList.add('hidden')
            dashboardContainer.classList.remove('hidden')

            if(userEmailDisplay)
            {
                userEmailDisplay.textContent = `Logged in as: ${session.user.email}`
            }
            
        } 
        else {
            authContainer.classList.remove('hidden')
            dashboardContainer.classList.add('hidden')

            //find and hide the subpages to avoid referenceerrors
            const learnEl = document.getElementById('learn-container')
            const predictEl = document.getElementById('predict-container')
            const gameEl = document.getElementById('game-container')
      
            if (learnEl) 
                learnEl.classList.add('hidden')
            if (predictEl) 
                predictEl.classList.add('hidden')
            if (gameEl) 
                gameEl.classList.add('hidden')
           
        }
    })




}