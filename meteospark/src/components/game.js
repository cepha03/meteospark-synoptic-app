import { supabase } from '../supabase.js' //import supabase from the js file to interact with user score submission

export function startGame(){

    //all DOM elements implemented for later use 
    const gameContainer = document.getElementById('game-container')
    const dashboardContainer = document.getElementById('dashboard-container')
    const btnGameBack = document.getElementById('btn-gameBack')
    const startScreen = document.getElementById('quiz=start')
    const activeScreen = document.getElementById('quiz=active')
    const endScreen = document.getElementById('quiz-end')

    const textQuestion = document.getElementById('quiz-question-text')
    const gridOption = document.getElementById('quiz-options-grid')
    const quizProgress = document.getElementById('quiz-progress')
    const liveScore = document.getElementById('quiz-score-live')
    const finalScore = document.getElementById('final-score')
    const saveStatus = document.getElementById('save-status')

    //buttons for game events 
    const btnStart = document.getElementById('btn-startQuiz')
    const btnPlayAgain = document.getElementById('btn-playAgain')

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
        correctIndex: 3
    }
  ]

  //current game state variables set to 0, required to track progress 
  let currentIndex = 0
  let currentScore = 0

  //function to start game, from start screen 
  function startGame()
  {
    startScreen.classList.add('hidden')
    activeScreen.classList.remove('hidden')
    loadQuiz()
  }

  //function to reset game back to start screen. game state variables set to 0. 
  function resetGame()
  {
    currentIndex = 0
    currentScore = 0
    startScreen.classList.remove('hidden') //toggle to only show start screen. 
    activeScreen.classList.remove('hidden')
    endScreen.classList.remove('hidden')
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
  if(btnStart)
  {
    btnStart.addEventListener('click', startGame)
  }
  if(btnPlayAgain)
  {
    btnPlayAgain.addEventListener('click', resetGame)
  }

  //function to load questions and generates the buttons to interact with the game
  function loadQuestion()
  {
    //update UI text for next questions and score. 
    const currentQuestion = questionBank[currentIndex]
    textQuestion.textContent = currentQuestion.question
    quizProgress.textContent = `Question ${currentIndex + 1}/${questionBank.length}`
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
    if(currentQuestion < questionBank.length)
    {
        loadQuestion() 
    }
    else
    {
        endScreen() //if no question left, end game
    }
  }











}