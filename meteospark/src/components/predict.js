export function startPredict(){

    const predictForm = document.getElementById('predict-form')
    const predResult = document.getElementById('pred-result')
    const tempDisplay = document.getElementById('temp-display')
    const predError = document.getElementById('pred-error')
    const btnSubmitPredict = document.getElementById('btn-submit-predict')

    const predictContainer = document.getElementById('predict-container')
    const backPredict = document.getElementById('back-to-dash-predict')
    const dashboardContainer = document.getElementById('dashboard-container')

    if(!predictForm)
    {
        return
    } 

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
            //send POST request to flask backend. utilises render api link to access ml components 
            const response = await fetch('https://meteospark-ml-backend.onrender.com/predict', {
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
            } 
            else 
            { //show error from backend
                predError.textContent = `Error: ${data.error}`
                predError.classList.remove('hidden')
            }
        }
        catch
        {
            predError.textContent = 'Failed to connect to the AI server. Try again.'
            predError.classList.remove('hidden')
        }
        finally
        {
            btnSubmitPredict.textContent = 'Generate Forecast'
            btnSubmitPredict.disabled = false
        }
    })

    if(backPredict) {
        backPredict.addEventListener('click', () => {
        predictContainer.classList.add('hidden')
        dashboardContainer.classList.remove('hidden')
  
        //reset the form when leaving
        predResult.classList.add('hidden')
        predError.classList.add('hidden')
        predictForm.reset()
    })
    }

}


    
