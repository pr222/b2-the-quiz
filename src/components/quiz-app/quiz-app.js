/**
 * The quiz-app web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      font-family: Arial, Helvetica, sans-serif;
    }

    header {
      text-align: center;
    }

    .hidden {
      display: none;
    }

  </style>

  <header>
    <h1>Quiz Time!</h1>
  </header>

  <user-nickname id="user"></user-nickname>
  <countdown-timer id="timer" class="hidden"></countdown-timer>
  <high-score class="hidden"></high-score>

  <!-- <div class="message-board">
  </div>  -->
`

/**
 * Define custom element.
 */
customElements.define('quiz-app',
/**
 * Create an anonymous class extending HTMLElement.
 */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the message board element in the shadow root.
      this._messageBoard = this.shadowRoot.querySelector('.message-board')

      this._userForm = this.shadowRoot.querySelector('#user')
      this._timer = this.shadowRoot.querySelector('#timer')

      this._startQuestion = this._startQuestion.bind(this)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['message']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'message') {
      //   this._messageBoard.textContent = newValue
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      // if (!this.hasAttribute('message')) {
      //   this.setAttribute('message', 'A simple hello from a web component.')
      // }

      // this._upgradeProperty('message')
      this._userForm.addEventListener('newUser', this._newUser)
      this._userForm.addEventListener('startQuestion', this._startQuestion)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._username.removeEventListener('newUser', this._newUser)
    }

    /**
     * Register new user to the game.
     *
     * @param {Event} event - When user has confimed its nickname.
     */
    _newUser (event) {
      console.log('New user here!')
      // Get the information obtained by the form from user-nickname.
      const newUser = event.detail
      // console.log(newUser)

      // Create a new user object.
      const user = {
        player: newUser.username,
        score: null
      }

      // Convert user-object to a JSON.
      const asJSON = JSON.stringify(user)
      // console.log(asJSON)

      // Set unique id-number depending on when user is added.
      // Although not the perfect serialization since other
      // things also gets saved in the web storage.
      const id = sessionStorage.length + 1
      sessionStorage.setItem(`user_${id}`, asJSON)
      // console.log(sessionStorage.getItem(`user_${id}`))

      this.dispatchEvent(new CustomEvent('startQuestion', { bubbles: true, composed: true }))

      //
    }

    /**
     * Switch to show questions.
     *
     */
    _startQuestion () {
      // Hide form before the first question.
      if (!this._userForm.classList.contains('hidden')) {
        this._userForm.classList.add('hidden')
      }

      // Display the timer.
      if (this._timer.classList.contains('hidden')) {
        this._timer.classList.remove('hidden')
      }
    }

    // // // // // // // // // // // // // // // // // // // //

    /**
     * Run the specified instance property
     * through the class setter.
     *
     * @param {string} prop - The property's name.
     */
    _upgradeProperty (prop) {
      if (Object.hasOwnProperty.call(this, prop)) {
        const value = this[prop]
        delete this[prop]
        this[prop] = value
      }
    }

    /**
     * Gets the message.
     *
     * @returns {string} The message value.
     */
    get message () {
      return this.getAttribute('message')
    }

    /**
     * Sets the message.
     *
     * @param {string} value - The message.
     */
    set message (value) {
      if (this.message !== value) {
        this.setAttribute('message', value)
      }
    }

    /**
     * Cleans the message board.
     */
    clean () {
      this._messageBoard.textContent = ''
    }
  }
)
