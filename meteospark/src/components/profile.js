import { supabase } from '../supabaseInfo.js'

export function initProfile() {

  //const variables for containers and buttons  
  const profileContainer = document.getElementById('profile-container')
  const dashboardContainer = document.getElementById('dashboard-container')
  const btnProfileBack = document.getElementById('btn-profile-back')
  const btnProfileOpen = document.getElementById('btn-profile')

  //const variables to store score information
  const statTotalGames = document.getElementById('stat-total-games')
  const statAvgScore = document.getElementById('stat-avg-score')
  const scoreHistoryList = document.getElementById('score-history-list')

  if (!profileContainer) return

  //navigation logic for back button on profile page
  if (btnProfileBack) {
    btnProfileBack.addEventListener('click', () => {
      profileContainer.classList.add('hidden')
      dashboardContainer.classList.remove('hidden')
    })
  }

  //button to open up user quiz stats, load database info
  if (btnProfileOpen) {
    btnProfileOpen.addEventListener('click', async () => {
      dashboardContainer.classList.add('hidden')
      profileContainer.classList.remove('hidden')
      await fetchAndDisplayScores() //await connects to database to retrieve info
    })
  }

  //fetch database information from supabase
  async function fetchAndDisplayScores() {
    scoreHistoryList.innerHTML = '<li class="p-6 text-center text-slate-500">Loading your scores...</li>'

    try {
      //retrieve current user information
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user logged in")

      //fetch scores from supabase 
      const { data: scores, error } = await supabase
        .from('quiz_scores')
        .select('*')
        .eq('user_id', user.id) //retrieve user id info from supaabase
        .order('created_at', { ascending: false }) //set to submission order

      if (error) throw error

      renderStats(scores)

    } catch (err) {
      console.error('Error fetching scores:', err)
      scoreHistoryList.innerHTML = '<li class="p-6 text-center text-red-500">Failed to load history.</li>'
    }
  }

  //render stat data to html core
  function renderStats(scores) {
    //validation for if user hasnt played any games
    if (!scores || scores.length === 0) {
      statTotalGames.textContent = '0'
      statAvgScore.textContent = '0%'
      scoreHistoryList.innerHTML = '<li class="p-6 text-center text-slate-500">No quizzes taken yet. Go play a game!</li>'
      return
    }

    //calculate the no of total games played to be displayed
    statTotalGames.textContent = scores.length

    //calculate average user percentage for all games played (track progression)
    let totalCorrect = 0 //variable set to 0 initial state
    let totalQuestionsAsked = 0//variable set to 0 initial state
    scores.forEach(row => { 
      totalCorrect += row.score
      totalQuestionsAsked += row.total_questions
    })
    //calculate avg percentage by calculating the no of correct questions answered and asked.
    const avgPercentage = Math.round((totalCorrect / totalQuestionsAsked) * 100)
    statAvgScore.textContent = `${avgPercentage}%`

    //generate the list of data entries for each score saved
    scoreHistoryList.innerHTML = '' //clear loading text

    scores.forEach(row => {
      const li = document.createElement('li')
      li.className = 'p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
      
      //format the postgres timestamp into a readable date 
      const dateStr = new Date(row.created_at).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
      })

      //determine colour object based on score
      const scorePercent = (row.score / row.total_questions) * 100 //scorePercent used to change colour of score object
      let badgeColor = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      if (scorePercent >= 80) badgeColor = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      else if (scorePercent >= 50) badgeColor = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'

      //setting the correct name to the game mode played when quiz completed
      let displayMode = 'Meteorology Quiz'
        if(row.game_mode === 'rapid')
        {
            displayMode = 'Beat the Clock!'
        }
        else if (row.game_mode === 'forecaster')
        {
            displayMode = 'Be the Forecaster!'
        }
        else if (row.game_mode === 'truefalse')
        {
            displayMode = 'True or False!'
        }

      
        //html within js to interact with dark mode functionality 
      li.innerHTML = `
        <div>
          <p class="font-bold text-slate-800 dark:text-white">${displayMode}</p>
          <p class="text-sm text-slate-500">${dateStr}</p>
        </div>
        <div class="px-3 py-1 rounded-full text-sm font-bold ${badgeColor}">
          ${row.score} / ${row.total_questions}
        </div>
      `
      scoreHistoryList.appendChild(li) //change the colour of each entry dependant on theme
    })
  }
}