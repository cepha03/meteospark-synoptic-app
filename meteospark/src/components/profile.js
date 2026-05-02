import { supabase } from '../supabaseInfo.js'

export function initProfile() {
  const profileContainer = document.getElementById('profile-container')
  const dashboardContainer = document.getElementById('dashboard-container')
  const btnProfileBack = document.getElementById('btn-profile-back')
  const btnProfileOpen = document.getElementById('btn-profile')

  const statTotalGames = document.getElementById('stat-total-games')
  const statAvgScore = document.getElementById('stat-avg-score')
  const scoreHistoryList = document.getElementById('score-history-list')

  if (!profileContainer) return

  // 1. Navigation Logic
  if (btnProfileBack) {
    btnProfileBack.addEventListener('click', () => {
      profileContainer.classList.add('hidden')
      dashboardContainer.classList.remove('hidden')
    })
  }

  // When the user clicks "My Stats" from the dashboard, load the data BEFORE showing the screen
  if (btnProfileOpen) {
    btnProfileOpen.addEventListener('click', async () => {
      dashboardContainer.classList.add('hidden')
      profileContainer.classList.remove('hidden')
      await fetchAndDisplayScores()
    })
  }

  // 2. Fetch Data from Supabase
  async function fetchAndDisplayScores() {
    scoreHistoryList.innerHTML = '<li class="p-6 text-center text-slate-500">Loading your scores...</li>'

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user logged in")

      // Fetch scores from Supabase, ordered by most recent first
      const { data: scores, error } = await supabase
        .from('quiz_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      renderStats(scores)

    } catch (err) {
      console.error('Error fetching scores:', err)
      scoreHistoryList.innerHTML = '<li class="p-6 text-center text-red-500">Failed to load history.</li>'
    }
  }

  // 3. Render Data to the HTML
  function renderStats(scores) {
    // If they haven't played any games yet
    if (!scores || scores.length === 0) {
      statTotalGames.textContent = '0'
      statAvgScore.textContent = '0%'
      scoreHistoryList.innerHTML = '<li class="p-6 text-center text-slate-500">No quizzes taken yet. Go play a game!</li>'
      return
    }

    // Calculate total games
    statTotalGames.textContent = scores.length

    // Calculate average score percentage
    let totalCorrect = 0
    let totalQuestionsAsked = 0
    scores.forEach(row => {
      totalCorrect += row.score
      totalQuestionsAsked += row.total_questions
    })
    const avgPercentage = Math.round((totalCorrect / totalQuestionsAsked) * 100)
    statAvgScore.textContent = `${avgPercentage}%`

    // Generate the history list items
    scoreHistoryList.innerHTML = '' // Clear loading text

    scores.forEach(row => {
      const li = document.createElement('li')
      li.className = 'p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
      
      // Format the Postgres timestamp into a readable date (e.g., "Oct 24, 2024")
      const dateStr = new Date(row.created_at).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
      })

      // Determine color based on score
      const scorePercent = (row.score / row.total_questions) * 100
      let badgeColor = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      if (scorePercent >= 80) badgeColor = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      else if (scorePercent >= 50) badgeColor = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'

      let displayMode = 'Meteorology Quiz'
        if(row.game_mode === 'rapid')
        {
            displayMode = 'Beat the Clock!'
        }
        else if (row.game_mode === 'forecaster')
        {
            displayMode = 'Be the Forecaster!'
        }

      

      li.innerHTML = `
        <div>
          <p class="font-bold text-slate-800 dark:text-white">${displayMode}</p>
          <p class="text-sm text-slate-500">${dateStr}</p>
        </div>
        <div class="px-3 py-1 rounded-full text-sm font-bold ${badgeColor}">
          ${row.score} / ${row.total_questions}
        </div>
      `
      scoreHistoryList.appendChild(li)
    })
  }
}