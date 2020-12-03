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
  }
</style>

<div>
  <h2>Question</h2>

  <form id="answerForm">
    <label for="answerInput">Answer: </label>
    <input type="text" id="answerInput" name="answerInput" autofocus autocomplete="off">
    <input type="submit" value="Submit answer">
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
      const question = await this._getQuestion(apiUrl)

      console.log(question.question)
    }

    /**
     * Doing the GET request.
     *
     * @param {*} url -
     * @returns {Promise<object>} - a response in JSON.
     */
    async _getQuestion (url) {
      const response = await fetch(`${url}`)
      // console.log(response)
      const result = await response.json()
      // console.log(result)
      return result
    }

    /**
     * Take care of submit answer-event.
     *
     * @param {Event} event - submit the answer.
     */
    _onSubmit (event) {
      // Prevent default posting of form submission.
      event.preventDefault()

      const answer = this._answerInput.value
      console.log(answer)

      // POST ANSWER
    }
    //
  }
)
