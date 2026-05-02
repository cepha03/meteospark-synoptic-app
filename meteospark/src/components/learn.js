const curriculumData = {
  climate: {
    title: "Climate & Weather Phenomenon",
    icon: "🌦️",
    lessons: [
      {
        title: "Temperature and Dew Point",
        content: "Temperature measures hot and cold, indicating the amount of heat energy stored in the atmosphere. This can be overriden with other factors such as precipitation. Dew Point is the temperature required for the relative humidity to reach 100%. For example, if it's 7C, and the RH was 50% the DP would be 3.5C."
      },
      {
        title: "Clouds",
        content: "Clouds come in many shapes and sizes, and also different types. The main ones are Stratus, Cumulus and Cumulonimbus. Stratus clouds are thin, and are common during overcast days. Cumulus are fluffy and white, the most common. Cumulonimbus are thick, dark and often met with precipitation"
      },
      {
        title: "Thunder & Lightning",
        content: "Thunderstorms are powered by rapid upward movement of warm, moist air. As ice particles collide within the cloud, they build a static electrical charge. Lightning is the sudden discharge of this electricity, and thunder is the sound of the air rapidly expanding from the heat of the lightning."
      },
      {
        title: "The Gulf Stream",
        content: "The Gulf Stream is a warm and swift Atlantic ocean current that originates in the Gulf of Mexico. It drastically influences the UK's climate, making our winters significantly milder than other regions at a similar latitude (like Canada or Russia)."
      },
      {
        title: "Snow and Ice",
        content: "Snow is a type of precipitation that crystalises when the air temperature is at or below 0C. The fluffy nature is microscopic air pockets trapped between crystals. Ice is solid water, with molecules packed tightly and usually found with snow."
      },
      {
        title: "Precipitation",
        content: "Precipitation is any form of water, whether that be rain, sleet or hail that falls from the atmosphere. It is a key component of the water cycle."
      },
      {
        title: "Tornadoes",
        content: "Tornadoes are violent rotating columns of air that extend from a thunderstorm (Cumulonimbus cloud). They are very common, and destructive in the USA found in the colloquially known 'Tornado Alley', but it is said that England has the highest tornado density (2.2 per 10000km^2)."
      },
      {
        title: "Cyclones and Hurricanes",
        content: "Cyclones and Hurricanes are essentially the same weather phenomenon, consisting of giant rotating tropical storm systems which are formed when ocean temperatures reach >26C. This moisture and heat collides with cool air aloft resulting in poweful systems."
      }
    ]
  },
  atmosphere: {
    title: "All About Meteorology",
    icon: "🌍",
    lessons: [
      {
        title: "High & Low Pressure",
        content: "Air pressure dictates weather conditions. High Pressure brings clear settled weather as air sinks, thought it can also bring fog due to light winds and stagnant air. Low Pressure brings clouds, wind, and rain as air rises and cools."
      },
      {
        title: "The Jet Stream",
        content: "The Jet Stream is a core of strong winds around 5 to 7 miles above the Earth's surface, typically blowing from west to east. It acts as a steering mechanism for weather systems, directing storms toward or away from the UK. If the Jet Stream blew east to west, that would indicate a negative mean zonal wind and would result in cooler, drier weather. A negative mean zonal wind results in an SSW (Sudden Stratospheric Warming)."
      },
      {
        title: "Sudden Stratospheric Warming (SSW)",
        content: "The SSW is a rapid temperature increase located at the arctic pole. This increase takes place in the stratosphere (1hPa, 50km), during winter and results in a weak/split polar vortex. This often pushes colder air towards the mid-latitudes, increasing the chance of cold weather. The most famous instance of this happening was the 'Beast from the East' in 2018."
      },
      {
        title: "NAO & AO",
        content: "The North Atlantic Oscillation (NAO) and Arctic Oscillation (AO) are fluctuations in atmospheric pressure. A 'positive' NAO/AO usually brings mild, wet winters to the UK, while a 'negative' phase often results in cold, snowy conditions."
      },
      {
        title: "ENSO (El Niño/La Niña)",
        content: "The El Niño-Southern Oscillation is a periodic fluctuation in sea surface temperature across the equatorial Pacific Ocean. El Niño (warming) and La Niña (cooling) create global ripple effects, altering weather patterns worldwide."
      },
      {
        title: "Madden-Julian Oscillation (MJO)",
        content: "Unlike ENSO which stays in one place, the MJO is an eastward-moving 'pulse' of cloud and rainfall near the equator that circles the globe every 30 to 60 days, heavily influencing tropical monsoons."
      }
    ]
  },
  statistics: {
    title: "Weather Statistics",
    icon: "📊",
    lessons: [
      {
        title: "Hottest UK Max Temperature",
        content: "The highest temperature ever recorded in the UK is 40.3°C (Coningsby, 19th July 2022)."
      },
      {
        title: "Lowest UK Min Temperature",
        content: "The lowest UK temperature ever recorded is -27.2°C in Braemar and Shawbury (27th December 1995 and 10th January 1982)"
      },
      {
        title: "Windiest Day in the UK",
        content: "The windiest day in the UK was in January 1992 with a wind speed of 197mph (317 kmh)."
      },
      {
        title: "Global Extremes",
        content: "The highest reliably recorded temperature on Earth is 56.7°C (Death Valley, USA, 1913). The coldest is -89.2°C (Vostok Station, Antarctica, 1983)."
      },
      {
        title: "Rainfall Records",
        content: "The wettest place on Earth is Mawsynram, India, receiving over 12,000 mm (~480 inches) of rain annually. In contrast, the driest is the Atacama Desert in Chile, where some weather stations have never recorded a drop of rain."
      }
    ]
  }
}

export function startLearn() {
    const btnLearnBack = document.getElementById('btn-learn-back')
    const learnHeaderTitle = document.getElementById('learn-header-title')

    const viewTopics = document.getElementById('learn-topics-view')
    const viewLessons = document.getElementById('learn-lessons-view')
    const viewContent = document.getElementById('learn-content-view')

    let currentLearnState = 'topics' 
    let activeTopicId = null


    function renderTopics() {
        viewTopics.innerHTML = ''
  
        for (const [key, category] of Object.entries(curriculumData)) {
            const button = document.createElement('button')
            button.className = "bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all text-left flex flex-col items-center sm:items-start text-center sm:text-left"
            button.innerHTML = `
                <div class="text-5xl mb-4">${category.icon}</div>
                <h3 class="text-xl font-bold text-slate-800 dark:text-white">${category.title}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">${category.lessons.length} Modules</p>
            `
            button.addEventListener('click', () => {
                activeTopicId = key
                renderLessons(key)
            })
            viewTopics.appendChild(button)
        }
    }

    function renderLessons(topicId) {
        const category = curriculumData[topicId]
        learnHeaderTitle.textContent = category.title
        viewLessons.innerHTML = ''

        category.lessons.forEach((lesson, index) => {
            const button = document.createElement('button')
            button.className = "w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-left flex items-center gap-4"
            button.innerHTML = `
                <div class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold h-10 w-10 flex items-center justify-center rounded-lg flex-shrink-0">${index + 1}</div>
                <h4 class="text-lg font-bold text-slate-800 dark:text-white">${lesson.title}</h4>
            `
            button.addEventListener('click', () => {
                renderContent(lesson.title, lesson.content)
            })
            viewLessons.appendChild(button)
        })

        //switch views
        viewTopics.classList.add('hidden')
        viewContent.classList.add('hidden')
        viewLessons.classList.remove('hidden')
        currentLearnState = 'lessons'
    }

    //render the actual lesson text
    function renderContent(title, text) {
        document.getElementById('lesson-title').textContent = title
        document.getElementById('lesson-text').textContent = text
  
        viewLessons.classList.add('hidden')
        viewContent.classList.remove('hidden')
        currentLearnState = 'content'
    }

    //back Button Logic for the Learn Section
    btnLearnBack.addEventListener('click', () => {
        if (currentLearnState === 'content') {
            //go back to the lesson list
            viewContent.classList.add('hidden')
            viewLessons.classList.remove('hidden')
            currentLearnState = 'lessons'
        } 
        else if (currentLearnState === 'lessons') {
            //go back to the main topics list
            viewLessons.classList.add('hidden')
            viewTopics.classList.remove('hidden')
            learnHeaderTitle.textContent = 'Learn Meteorology'
            currentLearnState = 'topics'
        } 
        else {
            //at the root 'topics' level, so go back to the Dashboard
            document.getElementById('learn-container').classList.add('hidden')
            document.getElementById('dashboard-container').classList.remove('hidden')
        }
    })

    //initialise the data
    renderTopics()
}