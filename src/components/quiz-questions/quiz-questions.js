/**
 * The quiz-questions web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Define the template.
 */
const template = document.createElement('template')
template.innerHTML = ` 
<style>
  :host {
    display: block;
    font-family: Georgia, 'Times New Roman', Times, serif;
    background-color: #cef0f0db;
    border-radius: 5px;
  }

  :host div {
    padding-top: 1px;
    padding-bottom: 25px;
    text-align: center;
    margin-top: 10px;
  }

  :host ul {
    text-align: center;
    padding: 0px;
  }

  :host li {
    display: inline-block;
    list-style: none;
    padding: 2px;
    margin-left: 50px;
  }

  :host #radioButtons label {
    display: inline-block;
    border: 2px solid #016a5aa1;
    border-radius: 5px;
    padding: 8px;
    padding-right: 75px;
  }
 
  .hidden {
    display: none;
  }
</style>

<div>
  <h1 id="question">Question</h1>
  <form id="answerForm">
    <div id="radioButtons" class="hidden"></div>
    <div id="textAnswer">
      <label for="answerInput">Answer: </label>
      <input type="text" id="answerInput" name="answerInput" autofocus autocomplete="off">
    </div>
    <input type="submit" value="Send answer">   
  </form>
</div>
`
/**
 * Define the custom element.
 */
customElements.define('quiz-questions',
/**
 * Anonymous class for the element.
 */
  class extends HTMLElement {
    /**
     * Make an instance of this type.
     */
    constructor () {
      super()

      // Attach shadow root and append template.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // The next url to GET or POST.
      this._nextURL = 'http://courselab.lnu.se/question/1'

      // Get the elements of this template.
      this._question = this.shadowRoot.querySelector('#question')
      this._answerInput = this.shadowRoot.querySelector('#answerInput')
      this._radioButtons = this.shadowRoot.querySelector('#radioButtons')
      this._textDiv = this.shadowRoot.querySelector('#textAnswer')
      this._submitAnswer = this.shadowRoot.querySelector('#answerForm')

      // Binding for _onSubmit to reach this.
      this._onSubmit = this._onSubmit.bind(this)
      this._startQuestion = this._startQuestion.bind(this)
      this._resetQuestion = this._resetQuestion.bind(this)
      this._displayAnswerOptions = this._displayAnswerOptions.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      window.addEventListener('startQuestion', this._startQuestion)
      window.addEventListener('resetQuestion', this._resetQuestion)
      this._submitAnswer.addEventListener('submit', this._onSubmit)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      window.removeEventListener('startQuestion', this._startQuestion)
      window.removeEventListener('resetQuestion', this._resetQuestion)
      this._submitAnswer.removeEventListener('submit', this._onSubmit)
    }

    /**
     * Take care of event beginning a new question.
     *
     * @param {Event} event - Activating a new question to be handled.
     */
    async _startQuestion (event) {
      // Fetch question from server using the next URL.
      const request = await this._getQuestion(this._nextURL)

      // Take out the question and display the text on the page.
      const question = request.question
      this._displayQuestion(question)

      // Handle how to display ways of answering the question.
      this._displayAnswerOptions(request)

      // Update the next URL.
      this._nextURL = request.nextURL

      // Telling all is done and send info about qurrent question's time-limit.
      this.dispatchEvent(new CustomEvent('questionOK', { bubbles: true, composed: true, detail: { currentQuestion: request.limit } }))
    }

    /**
     * Take care of event when an answer is submitted.
     *
     * @param {Event} event - submit event.
     */
    async _onSubmit (event) {
      try {
        // Prevent default posting of form submission.
        event.preventDefault()

        let chosenAnswer

        // Check and choose value for written text or radiobutton-options.
        if (this._answerInput.value.length > 0) {
          chosenAnswer = this._answerInput.value.toLowerCase()
        } else {
          chosenAnswer = this._submitAnswer.option.value
        }

        // Extract answer from event and convert to JSON.
        const answer = { answer: chosenAnswer }
        const jsonAnswer = JSON.stringify(answer)

        // Post the answer to the server and check if it was right or wrong.
        const postedAnswer = await this._postAnswer(jsonAnswer)

        // Set new next URL that came back from the answer.
        this._nextURL = postedAnswer.nextURL

        // When status is OK but next url is undefined,
        // there are no more questions to get and the
        // player has therefore won.
        if (this._nextURL === undefined) {
          this.dispatchEvent(new CustomEvent('win', { bubbles: true, composed: true }))
        } else {
          this.dispatchEvent(new CustomEvent('answerOK', { bubbles: true, composed: true }))
        }

        // Clean up input field.
        this._answerInput.value = ''
      } catch (err) {
        console.log('Something went wrong at submit answer, next URL was probably undefined.')
        console.error(err)
      }
    }

    /**
     * Reset the question-flow by going back to the first URL.
     *
     * @param {Event} event - Event to reset the questions.
     */
    _resetQuestion (event) {
      this._nextURL = 'http://courselab.lnu.se/question/1'
      this._answerInput.value = ''
    }

    /**
     * Doing the GET request.
     *
     * @param {string} url - the URL to fetch.
     * @returns {Promise<object>} - the response in JSON.
     */
    async _getQuestion (url) {
      try {
        const response = await fetch(`${url}`)
        const body = await response.json()

        return body
      } catch (err) {
        console.log(`Oops! Something went wrong with GET! Status: ${response.status}`)
        console.error(err)
      }
    }

    /**
     * Handling the POST request.
     *
     * @param {JSON} answer - Submitted answer in JSON-format.
     * @returns {Promise<object>} - The body of the response in JSON.
     */
    async _postAnswer (answer) {
      try {
        const postAnswer = await fetch(`${this._nextURL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: answer
        })

        if (postAnswer.ok) {
          const body = await postAnswer.json()

          return body
        } else {
          // The answer was probably wrong, either way the game is now over.
          this.dispatchEvent(new CustomEvent('gameover', { bubbles: true, composed: true }))
        }
      } catch (err) {
        console.log('Ooops! Something went wrong with POST!')
        console.error(err)
      }
    }

    /**
     * Display current question.
     *
     * @param {string} question - The question to display.
     */
    _displayQuestion (question) {
      // Clean up from previous question.
      if (this._question.textContent > 0) {
        this._question.textContent = ''
      }

      this._question.textContent = question
    }

    /**
     * Display ways of answering a question.
     *
     * @param {object} questionRequest - If present, an object with options to answer.
     */
    _displayAnswerOptions (questionRequest) {
      if (questionRequest.alternatives) {
        // Get how many of the options there are present.
        const options = questionRequest.alternatives
        const howMany = Object.keys(options).length

        // Restrict how many options are allowed.
        if (howMany > 2 && howMany < 10) {
          // First, remove previous radio buttons.
          while (this._radioButtons.firstElementChild) {
            this._radioButtons.removeChild(this._radioButtons.lastChild)
          }
          // Then, hide and show relevant element in form.
          this._radioButtons.classList.remove('hidden')
          this._textDiv.classList.add('hidden')

          // Add a call-to-action-text.
          this._radioButtons.textContent = 'Choose one option: '

          // Create a list to fill with options.
          const ul = document.createElement('ul')

          // Create a radio-button in a list element for each option.
          for (const [key, value] of Object.entries(options)) {
            const radioButton = document.createElement('input')
            radioButton.setAttribute('type', 'radio')
            radioButton.setAttribute('name', 'option')
            radioButton.setAttribute('id', `${key}`)
            radioButton.setAttribute('value', `${key}`)

            const label = document.createElement('label')
            label.setAttribute('for', `${key}`)
            label.textContent = value

            const li = document.createElement('li')
            li.appendChild(radioButton)
            li.appendChild(label)
            ul.appendChild(li)
          }

          // Lastly, add the list into the form.
          this._radioButtons.appendChild(ul)
        }
      } else {
        // Default to textfield for answering the question.

        // Hide and show relevant element in form.
        this._textDiv.classList.remove('hidden')
        this._radioButtons.classList.add('hidden')

        this._answerInput.focus()
      }
    }
  }
)
