import { supabase } from '../supabaseInfo.js' //import supabase from the js file to interact with user score submission

export function initGame(){

    //all DOM elements implemented for later use 
    const gameContainer = document.getElementById('game-container')
    const dashboardContainer = document.getElementById('dashboard-container')
    const btnGameBack = document.getElementById('btn-gameBack')
    const startScreen = document.getElementById('quiz-start')
    const activeScreen = document.getElementById('quiz-active')
    const endScreen = document.getElementById('quiz-end')

    const textQuestion = document.getElementById('quiz-question-txt')
    const gridOption = document.getElementById('quiz-options-grid')
    const quizProgress = document.getElementById('quiz-progress')
    const liveScore = document.getElementById('quiz-score-live')
    const finalScore = document.getElementById('final-score')
    const saveStatus = document.getElementById('save-status')

    //buttons for game events 
    const btnRapid = document.getElementById('btn-rapid')
    const btnForecaster = document.getElementById('btn-forecaster')
    const btnPlayAgain = document.getElementById('btn-playAgain')

    const timerShow = document.getElementById('quiz-timer')

    //error handling if a page doesnt have a game controller, halt execution
    if(!gameContainer)
    {
        return
    }

    //bank of questions to be used for gamified elements set as multiple choice format, this can be changed later
    //for additional questions. 

    const questionBank = [
    {
        question: "Which ocean current makes UK winters milder and summers cooler?",
        options: ["El Niño", "The Gulf Stream", "The Jet Stream", "Madden-Julian"],
        correctIndex: 1 //options are indexed in array, correct answer would be option 2. 
    },
    {
        question: "A -ve NAO usually brings what to the UK?",
        options: ["Mild, wet winters", "Cold, snowy winters", "Extreme heatwaves", "Hurricanes"],
        correctIndex: 1
    },
    {
        question: "High atmospheric pressure usually results in what kind of weather?",
        options: ["Heavy rain", "Thunderstorms", "Snow and ice", "Sunny and clear"],
        correctIndex: 3
    },
    {
        question: "Where was the highest temperature in the UK (40.3°C) recorded?",
        options: ["Coningsby", "Manchester", "London", "Essex"],
        correctIndex: 0
    },
    {
        question: "Which phenomenon is an eastward-moving 'pulse' near the equator?",
        options: ["ENSO", "The Jet Stream", "Madden-Julian Oscillation", "Gulf stream"],
        correctIndex: 2
    }
  ]

  const forecasterBank = [
    {   
        question: "It is January. The NAO index has dropped to a severely negative -1.8. What should the UK prepare for?", 
        options: ["A winter heatwave", "Heavy monsoons", "Bitter cold and snow", "Mild, cloudy weather"], 
        correctIndex: 2 
    },
    {   
        question: "It's December, and both the AO and NAO are strongly positive. What gear should locals prepare?", 
        options: ["Umbrellas and light jackets", "Heavy snow boots", "Sunscreen and shorts", "T-shirts only"], 
        correctIndex: 0 
    },
    { 
        question: "An ML model predicts a temperature of 5.5°C. Which month is this most likely to be?", 
        options: ["January", "July", "November", "March"], 
        correctIndex: 1 
    },
    { 
        question: "Historical data shows a UK average monthly temperature of just 2.2°C. What phase was the NAO most likely in?", 
        options: ["Strongly Positive", "Neutral", "Strongly Negative", "No change"], 
        correctIndex: 2 
    },
    { 
        question: "The Jet Stream has moved far to the south of the UK. What weather system is likely being pulled down over the country?", 
        options: ["Tropical Saharan air", "Arctic polar air", "Equatorial monsoons", "The Gulf Stream"], 
        correctIndex: 1 
    }
  ]

  //current game state variables set to 0, required to track progress 
  let currentIndex = 0
  let currentScore = 0
  let activeQ = []
  let timeLeft = 60
  let timeInt = null
  let currentMode = '' //track current mode of game

  //shuffle algorithm to change the order of which the questions are stacked
  function shuffleArr(arr)
  {
    const shuffle = [...arr]

    for (let i=shuffle.length -1; i>0;i--)
    {
        const j = Math.floor(Math.random() * (i+1));
        [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]]
    }
    return shuffle
  }

  //event handler to hide game and show dashboard. resets game state
  if(btnGameBack)
  {
    btnGameBack.addEventListener('click', () => {
        gameContainer.classList.add('hidden')
        dashboardContainer.classList.remove('hidden')
        resetGame()
    })
  }

  //click events to start game and reset  
  if(btnRapid)
  {
    btnRapid.addEventListener('click', () => startGame('rapid'))
  }
  if(btnForecaster)
  {
    btnForecaster.addEventListener('click', () => startGame('forecaster'))
  }
  if(btnPlayAgain)
  {
    btnPlayAgain.addEventListener('click', resetGame)
  }

   //function to start game, from start screen 
  function startGame(mode)
  {

    currentMode = mode

    if(mode === 'rapid')
    {
        activeQ = shuffleArr(questionBank) //shuffle function called to initiate
        timeLeft = 60

        if(timerShow)
        {
            timerShow.textContent = `${timeLeft}s`
        }

        clearInterval(timeInt) //time interval cleared and reset
        timeInt = setInterval(() => {
            timeLeft--

            if(timerShow)
            {
                timerShow.textContent = `${timeLeft}s`
            }

            if(timeLeft <=0)
            {
                clearInterval(timeInt)
                endGame()
            }
        }, 1000)

    }
    else if(mode === 'forecaster')
    {
        activeQ = shuffleArr(forecasterBank)
        timerShow.parentElement.classList.add('hidden')
        clearInterval(timeInt)
    }

    startScreen.classList.add('hidden')
    activeScreen.classList.remove('hidden')
    loadQuiz()
  }

  //function to reset game back to start screen. game state variables set to 0. 
  function resetGame()
  {
    clearInterval(timeInt)
    currentIndex = 0
    currentScore = 0
    startScreen.classList.remove('hidden') //toggle to only show start screen. 
    activeScreen.classList.add('hidden')
    endScreen.classList.add('hidden')
  }

  //function to load questions and generates the buttons to interact with the game
  function loadQuiz()
  {
    //update UI text for next questions and score. 
    const currentQuestion = activeQ[currentIndex]
    textQuestion.textContent = currentQuestion.question
    quizProgress.textContent = `Question ${currentIndex + 1}/${activeQ.length}`
    liveScore.textContent = `Score: ${currentScore}`

    gridOption.innerHTML='' //clears the buttons from previous questions

    //array of colour classes used for the game design (buttons)
    const quizColour = [
      'bg-red-500', 
      'bg-blue-500', 
      'bg-yellow-500', 
      'bg-green-500'
    ]

    //loop through the four opetions and create a button for each 
    currentQuestion.options.forEach((option, index) =>{

        const btn = document.createElement('button')
        btn.className = `${quizColour[index]} text-white font-bold py-6 px-4 rounded-xl shadow-sm transition-transform transform-gpu hover:-translate-y-1 text-lg`
        btn.textContent = option

        //when button is clicked, check to see if index matches 
        btn.addEventListener('click', () => manageAnswer(index, currentQuestion.correctIndex))
        gridOption.appendChild(btn) //add new button to the grid

    })
  }

  //check answer to move onto the next or end game 
  function manageAnswer(selectIndex, correctIndex)
  {
    //increment score by 1 if correct option is selected
    if(selectIndex===correctIndex)
    {
        currentScore++
    }

    currentIndex++ //move to next question

    //check if questions are left
    if(currentIndex < questionBank.length)
    {
        loadQuiz() 
    }
    else
    {
        endGame() //if no question left, end game
    }
  }

  //aysn function to contact the db to save the scorewhen the user finishes the game
  async function endGame(){

    clearInterval(timeInt)

    //show end screen to display the final score when game is completed
    activeScreen.classList.add('hidden')
    endScreen.classList.remove('hidden')
    finalScore.textContent = `${currentScore}/${activeQ.length}`

    //validation for if game doesn't save score, halt execution
    if(!saveStatus)
    {
        return
    }

    //display msg when game is completed
    saveStatus.textContent = 'Saving score to your account..'
    saveStatus.className = 'text-sm text-black-500 font-medium mb-6'

    //exception handling for supabase auth
    try
    {
        //get user data (uid) from supabase auth
        const{data: {user}, error: authError} = await supabase.auth.getUser()

        //if auth error occurs or user not present, display error msg 
        if(authError || !user)
        {
            throw new Error('Could not access user. Try to log out again')
        }

        //insert new row in users quiz_scores table
        const { error: insertError } = await supabase
        .from('quiz_scores')
        .insert([{ 
          user_id: user.id, //tie the score to this specific user's ID
          score: currentScore, 
          total_questions: questionBank.length 
        }])

        //if db rejects entry, throw error
        if(insertError)
        {
            throw insertError
        }

        //db success msg, tailwind css rules to display text
        saveStatus.textContent = 'Score saved to your user'
        saveStatus.className = 'text-sm text-green-500 font-medium mb-6'

    }
    catch(err) //catch error and show unsuccess saved msg
    {
        console.error('Error saving score. Try again', err)
        saveStatus.textContent = 'Could not save score. Try again'
        saveStatus.className = 'text-sm text-green-500 font-medium mb-6'

    }
  }











}