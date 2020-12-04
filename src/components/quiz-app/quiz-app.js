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

    div {
      text-align: center;
    }

    .hidden {
      display: none;
    }

  </style>

  <div>
    <h1>Quiz Time!</h1>
    <input type="button" id="restartButton"  value="Restart">
    <h2 id="announcement"></h2>
  </div>
  <user-nickname></user-nickname>
  <countdown-timer class="hidden" limit="70"></countdown-timer>
  <quiz-questions class="hidden"></quiz-questions>
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

      // 'firstPage' as default state of the page.
      // Other states: ¿'quiz'?, 'gameover', 'win', 'restarting'
      this._gameState = 'firstPage'

      // Wether the player won
      this._playerWon = false

      // Selecting custom elements from the template.
      this._restartButton = this.shadowRoot.querySelector('#restartButton')
      this._announcement = this.shadowRoot.querySelector('#announcement')
      this._userForm = this.shadowRoot.querySelector('user-nickname')
      this._timer = this.shadowRoot.querySelector('countdown-timer')
      this._quiz = this.shadowRoot.querySelector('quiz-questions')
      this._highscores = this.shadowRoot.querySelector('high-score')

      // Bindings for reaching this shadow.
      // this._startQuestion = this._startQuestion.bind(this)
      // this._startGame = this._startGame.bind(this)
      this._newUser = this._newUser.bind(this)
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
      // this._userForm.addEventListener('startQuestion', this._startQuestion)

      // this._restartButton.addEventListener('click', this._resetGame)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._username.removeEventListener('newUser', this._newUser)
    }

    /**
     * Takes care of event when user submits its name.
     *
     * @param {Event} event - When user has confimed its nickname.
     */
    _newUser (event) {
      console.log('New user here!')
      // Get the information obtained by the form from user-nickname.
      const newUser = event.detail.username
      // console.log(newUser)
      this._createUser(newUser)
    }

    /**
     * Register a new user.
     *
     * @param {string} newUser - The nickname of the new user.
     */
    _createUser (newUser) {
      // Create a new user object.
      const user = {
        player: newUser,
        score: 0
      }

      // Convert user-object to a JSON.
      const asJSON = JSON.stringify(user)
      console.log(asJSON)

      // Set unique id-number depending on when user is added.
      // Although not the perfect serialization since other
      // things also gets saved in the web storage.
      const id = sessionStorage.length + 1
      sessionStorage.setItem(`user_${id}`, asJSON)
      // console.log(sessionStorage.getItem(`user_${id}`))

      // this._userForm.dispatchEvent(new CustomEvent('startQuestion', { bubbles: true, composed: true }))

      this._startGame()

      //
    }

    /**
     * Switch to show questions.
     *
     */
    _startGame () {
      this._renderGame()

      this.dispatchEvent(new CustomEvent('startQuestion', { bubbles: true, composed: true }))
      this.dispatchEvent(new CustomEvent('startTimer', { bubbles: true, composed: true }))

      this._gameState = 'quiz'
    }

    /**
     * Call to render the game, changes depends on
     * the current state of the game.
     */
    _renderGame () {
      if (this._gameState === 'firstPage') {
        // Hide the username form.
        this._userForm.classList.add('hidden')

        // Display the timer and quiz-questions.
        this._timer.classList.remove('hidden')
        this._quiz.classList.remove('hidden')
      } else if (this._gameState === 'gameover' || this._gameState === 'win') {
        // Choose what to display in the announcement.
        if (this._playerWon) {
          this._announcement.textContent = 'You made it to the end!'
        } else {
          this._announcement.textContent = 'Game over!'
        }

        // Hide the timer and quiz-questions.
        this._timer.classList.add('hidden')
        this._quiz.classList.add('hidden')

        // Display announcement, highscore and restart-button.
        this._announcement.classList.remove('hidden')
        this._highscores.classList.remove('hidden')
        this._restartButton.classList.remove('hidden')
      } else if (this._gameState === 'restarting') {
        // Hide announcement, highscore and restart-button.
        this._announcement.classList.add('hidden')
        this._highscores.classList.add('hidden')
        this._restartButton.classList.add('hidden')

        // Display the username form.
        this._userForm.classList.remove('hidden')
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
