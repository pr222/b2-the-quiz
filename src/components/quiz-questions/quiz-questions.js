/**
 * The quiz-questions web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const apiUrl = 'http://courselab.lnu.se/question/1'

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

      // Get the header element for displaying the question.
      this._question = this.shadowRoot.querySelector('#question')

      // Get the text input field of the form.
      this._answerInput = this.shadowRoot.querySelector('#answerInput')

      // Get the form element for listening to the submit event.
      this._submitAnswer = this.shadowRoot.querySelector('#answerForm')

      // Binding for _onSubmit to reach this.
      this._onSubmit = this._onSubmit.bind(this)
      this._startQuestion = this._startQuestion.bind(this)
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
      this._submitAnswer.removeEventListener('submit', this._onSubmit)
    }

    /**
     * Take care of begin question event.
     *
     * @param {Event} event -
     */
    async _startQuestion (event) {
      const question1 = await this._getQuestion(apiUrl)

      const question2 = question1.question
      const url = question1.nextURL
      console.log(url)
      this._displayQuestion(question2)

      // // // // // // // // // // // // // // // // // // // //
      const answer = { answer: this._answerInput.value }
      // console.log(answer)
      const jsonAnswer =JSON.stringify(answer)
      console.log(jsonAnswer)
      // const answer = this._answerInput.value
      
      // POST ANSWER
      const postAnswer = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonAnswer
      })

      const body = await postAnswer.json()
      console.log(body)
      // // // // // // // // // // // // // // // // // // // //
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
     * Take care of submit answer-event.
     *
     * @param {Event} event - submit the answer.
     */
    async _onSubmit (event) {
      // Prevent default posting of form submission.
      event.preventDefault()

      const answer = { answer: this._answerInput.value }
      // console.log(answer)
      const jsonAnswer =JSON.stringify(answer)
      console.log(jsonAnswer)
      // const answer = this._answerInput.value

      // // // // // // // // // // // // // // // // // // // //
      // POST ANSWER
      const postAnswer = await fetch('http://courselab.lnu.se/answer/1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonAnswer
      })

      const body = await postAnswer.json()
      console.log(body)

      // if (!postAnswer.ok) {
      //   const message = `Oops, an error: ${postAnswer.status}`
      //   throw new Error(message)
      // }
      // // // // // // // // // // // // // // // // // // // //


    }
    //

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
  }
)
