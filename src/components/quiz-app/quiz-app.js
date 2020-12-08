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
    <input type="button" id="restartButton" class="hidden" value="Restart">
    <h2 id="announcement"></h2>
  </div>
  <user-nickname></user-nickname>
  <countdown-timer class="hidden"></countdown-timer>
  <quiz-questions class="hidden"></quiz-questions>
  <high-score class="hidden"></high-score>
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

      // Default state of the page as 'firstPage'.
      // Other states: ¿'quiz'?, 'gameover', 'win' & 'restarting'
      this._gameState = 'firstPage'

      // Wether the player won.
      this._playerWon = false

      // Selecting custom elements from the template in shadow root.
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
      this._questionReceived = this._questionReceived.bind(this)
      this._gameover = this._gameover.bind(this)
      this._resetGame = this._resetGame.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._userForm.addEventListener('newUser', this._newUser)
      this._quiz.addEventListener('questionOK', this._questionReceived)
      this._quiz.addEventListener('answerOK', this._answerOK)
      this._quiz.addEventListener('gameover', this._gameover)
      this._quiz.addEventListener('win', this._gameover)
      this._restartButton.addEventListener('click', this._resetGame)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._username.removeEventListener('newUser', this._newUser)
      this._quiz.removeEventListener('gameover', this._gameover)
      this._quiz.removeEventListener('win', this._gameover)
      this._restartButton.addEventListener('click', this._resetGame)
    }

    /**
     * Takes care of event when user submits its name.
     *
     * @param {Event} event - When user has submitted its nickname.
     */
    _newUser (event) {
      console.log('New user here!')
      // Get the information obtained by the form from user-nickname.
      const newUser = event.detail.username

      const currentUser = this._createUser(newUser)

      this._startGame(currentUser)
    }

    /**
     * Register a new user.
     *
     * @param {string} newUser - The nickname of the new user.
     * @returns {object} - The new user in JSON.
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

      // Save user in web storage.
      sessionStorage.setItem(`user_${id}`, asJSON)
      // console.log(sessionStorage.getItem(`user_${id}`))

      return asJSON
    }

    /**
     * Start the game.
     *
     * @param {object} user - The current user in JSON.
     */
    _startGame (user) {
      this._renderGame()
      this._gameState = 'quiz'

      console.log('EVENT sent from app: startQuestion')
      this.dispatchEvent(new CustomEvent('startQuestion', { bubbles: true, composed: true }))
    }

    /**
     * Handle event when all went well with getting question.
     *
     * @param {Event} event - Event with information of time limit.
     */
    _questionReceived (event) {
      console.log(event.detail)

      let limitNumber = event.detail
      limitNumber = Object.values(limitNumber)
      this._timer.setAttribute('limit', `${limitNumber}`)

      console.log('EVENT from app: start timer')
      this.dispatchEvent(new CustomEvent('startTimer', { bubbles: true, composed: true }))
    }

    /**
     * Prepare next question.
     *
     * From event: The answer is processed, ready for next question
     *
     * @param {Event} event - If event present, prevoius answer is handled and ready for next question.
     */
    _answerOK (event) {
      console.log('EVENT from app: stop timer')
      this.dispatchEvent(new CustomEvent('stopTimer', { bubbles: true, composed: true }))

      // Handle score saving.

      console.log('EVENT from app: startQuestion')
      this.dispatchEvent(new CustomEvent('startQuestion', { bubbles: true, composed: true }))
    }

    /**
     * Update conditions for when the game is over.
     *
     * @param {Event} event - Gameover, losing or winning.
     */
    _gameover (event) {
      if (event.type === 'gameover') {
        console.log('GAME OVER!!!')
        this._gameState = 'gameover'
      } else if (event.type === 'win') {
        console.log('WIN!')
        this._gameState = 'win'
        this._playerWon = true
      }

      // Update highscore!

      this._renderGame()
    }

    /**
     * Reset the game.
     *
     * @param {Event} event - Click event to reset game.
     */
    _resetGame (event) {
      console.log('reset game')
      this._gameState = 'restarting'
      this._playerWon = false

      this.dispatchEvent(new CustomEvent('resetQuestion', { bubbles: true, composed: true }))
      // Placeholder stop-event before switching to gameover:
      this.dispatchEvent(new CustomEvent('stopTimer', { bubbles: true, composed: true }))

      // Render and then reset the state to default.
      this._renderGame()
      this._gameState = 'firstPage'
    }

    /**
     * Render the game, with changes that depends
     * on the current state of the game.
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
  }
)
