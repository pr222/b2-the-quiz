/**
 * The quiz-questions web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const firstUrl = 'http://courselab.lnu.se/question/1'

/**
 * Define the template.
 */
const template = document.createElement('template')
template.innerHTML = ` 
<style>
  :host {
    display: block;
    font-family: Georgia, 'Times New Roman', Times, serif;
    background-color: #CCCCCC;
    border-radius: 5px;
  }

  :host div {
    padding-top: 1px;
    padding-bottom: 25px;
    text-align: center;
    margin-top: 10px;
  }
</style>

<div>
  <h1 id="question">Question</h1>

  <form id="answerForm">
    <label for="answerInput">Answer: </label>
    <input type="text" id="answerInput" name="answerInput" autofocus autocomplete="off">
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

      // Placeholder for the next url to GET or POST.
      this._nextURL = ''

      // The current question to use.
      this._currentQuestion = ''

      // Get the elements of this template.
      this._question = this.shadowRoot.querySelector('#question')
      this._answerInput = this.shadowRoot.querySelector('#answerInput')
      this._submitAnswer = this.shadowRoot.querySelector('#answerForm')

      // Binding for _onSubmit to reach this.
      this._onSubmit = this._onSubmit.bind(this)
      this._startQuestion = this._startQuestion.bind(this)
    }

    // get currentQuestion () {
    //   return this._currentQuestion
    // }

    get nextURL () {
      return this._nextURL
    }

    // set currentQuestion (value) {
    //   this._currentQuestion = value
    // }

    set nextURL (value) {
      this._nextURL = value
    }


    /**
     * Looks out for changes in attributes.
     *
     * @returns {string[]} - An array with stings of the attibutes.
     */
    static get observedAttributes () {
      return ['']
    }

    /**
     * Called by the browser when an attribute is changed.
     *
     * @param {string} name - The name of the attribute.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      //
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      window.addEventListener('startQuestion', this._startQuestion)
      this._submitAnswer.addEventListener('submit', this._onSubmit)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      //
      window.removeEventListener('startQuestion', this._startQuestion)
      this._submitAnswer.removeEventListener('submit', this._onSubmit)
    }

    /**
     * Take care of begin question event.
     *
     * @param {Event} event -
     */
    async _startQuestion (event) {
      console.log('_startQuestion began')
      // // Has the last question been executed already?
      // if (this._nextURL === undefined) {
      //   console.log('You win!')
      //   this.dispatchEvent(new CustomEvent('win', { bubbles: true }))
      //   return
      // }

      this._answerInput.focus()

      let request

      if (this._nextURL === '') {
        console.log('if')
        request = await this._getQuestion(firstUrl)
      } else {
        console.log('else')
        request = await this._getQuestion(this._nextURL)
      }

      const question = request.question
      this._displayQuestion(question)
      this._displayAnswerOptions(request)

      this._nextURL = request.nextURL
      console.log(`Next url: ${this._nextURL}`)
    }

    /**
     * Doing the GET request.
     *
     * @param {*} url -
     * @returns {Promise<object>} - a response in JSON.
     */
    async _getQuestion (url) {
      const response = await fetch(`${url}`)
      console.log(response)

      if (!response.ok) {
        const message = `Oops, an error: ${response.status}`
        throw new Error(message)
      }

      const body = await response.json()
      console.log(body)
      return body
    }

    // _getGuestion().catch(error => {
    //   error.message
    // })

    /**
     * Doing the POST request.
     *
     * @param {object} - Submitted answer in JSON.
     */
    async _postAnswer (answer) {
      const postAnswer = await fetch(`${this._nextURL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: answer
      })
      console.log(postAnswer)

      if (postAnswer.ok) {
        console.log('status ok')
        const body = await postAnswer.json()
        console.log(body)

        this._nextURL = body.nextURL
        console.log(`Next url: ${this._nextURL}`)

        // When status is OK but next url is undefined, 
        // there are no more questions to get and the
        // player has therefore won.
        if (this._nextURL === undefined) {
          this.dispatchEvent(new CustomEvent('win', { bubbles: true, composed: true }))
        } else {
          this.dispatchEvent(new CustomEvent('startQuestion', { bubbles: true, composed: true }))
        }
        return body
      } else {
        console.log('status not ok')
        this.dispatchEvent(new CustomEvent('gameover', { bubbles: true, composed: true }))
      }      
    }
    
    /**
     * Take care of submit answer-event.
     *
     * @param {Event} event - submit the answer.
     */
    async _onSubmit (event) {
      // Prevent default posting of form submission.
      event.preventDefault()

      // Extract answer from event and convert to JSON.
      const answer = { answer: this._answerInput.value }
      const jsonAnswer =JSON.stringify(answer)
      console.log(jsonAnswer)

      // Post the answer to the server.
      const post = await this._postAnswer(jsonAnswer)

      // Clean up input field.
      this._answerInput.value = ''
      this._answerInput.focus()
    }

    /**
     * Display current question.
     *
     * @param {*} question - The question to display.
     */
    _displayQuestion (question) {
      if (this._question.textContent > 0) {
        this._question.textContent = ''
      }

      this._question.textContent = question
    }

    _displayAnswerOptions (questionRequest) {
     if (questionRequest.alternatives) {
      console.log('DISPLAY BUTTONS!')
     } else {
       console.log('DISPLAY TEXTFIELD!')
     }
    }
  }
)
