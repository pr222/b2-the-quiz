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

    :host div {
      text-align: center;
    }

    .hidden {
      display: none;
    }

  </style>

  <div>
    <h1>Quiz Time!</h1>
    <h2 id="announcement"></h2>
  </div>
  <user-nickname></user-nickname>
  <countdown-timer class="hidden"></countdown-timer>
  <quiz-questions class="hidden"></quiz-questions>
  <high-score class="hidden"></high-score>
  <div>
    <input type="button" id="restartButton" class="hidden" value="Restart">
  </div>
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
      // Other states: 'quiz', 'gameover', 'win' & 'restarting'
      this._gameState = 'firstPage'

      // Wether the player won.
      this._playerWon = false

      // The player who is currently answering questions.
      this._player = {}

      // Selecting custom elements from the template in shadow root.
      this._restartButton = this.shadowRoot.querySelector('#restartButton')
      this._announcement = this.shadowRoot.querySelector('#announcement')
      this._userForm = this.shadowRoot.querySelector('user-nickname')
      this._timer = this.shadowRoot.querySelector('countdown-timer')
      this._quiz = this.shadowRoot.querySelector('quiz-questions')
      this._highscores = this.shadowRoot.querySelector('high-score')

      // Bindings for reaching this shadow.
      this._newUser = this._newUser.bind(this)
      this._questionReceived = this._questionReceived.bind(this)
      this._answerOK = this._answerOK.bind(this)
      this._gameover = this._gameover.bind(this)
      this._resetGame = this._resetGame.bind(this)
      this._timerInfo = this._timerInfo.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._userForm.addEventListener('newUser', this._newUser)
      this._quiz.addEventListener('questionOK', this._questionReceived)
      this._quiz.addEventListener('answerOK', this._answerOK)
      this._timer.addEventListener('timerStopped', this._timerInfo)
      this.addEventListener('timeEnd', this._gameover)
      this.addEventListener('gameover', this._gameover)
      this.addEventListener('win', this._gameover)
      this._restartButton.addEventListener('click', this._resetGame)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._username.removeEventListener('newUser', this._newUser)
      this._quiz.removeEventListener('questionOK', this._questionReceived)
      this._quiz.removeEventListener('answerOK', this._answerOK)
      this._timer.removeEventListener('timerStopped', this._timerInfo)
      this.removeEventListener('timeEnd', this._gameover)
      this.removeEventListener('gameover', this._gameover)
      this.removeEventListener('win', this._gameover)
      this._restartButton.removeEventListener('click', this._resetGame)
    }

    /**
     * Takes care of event when user has submitted its name.
     *
     * @param {Event} event - When user has submitted its nickname.
     */
    _newUser (event) {
      // Get the information obtained by the form from user-nickname.
      const newUser = event.detail.username

      this._player = {
        name: newUser,
        score: 0
      }

      // Set the stage for the game and begin quiz.
      this._startGame(this._player)
    }

    /**
     * Start the game.
     *
     * @param {object} user - The current player.
     */
    _startGame (user) {
      this._renderGame()
      this._gameState = 'quiz'

      // Activate the first question.
      this._eventBus('startQuestion')
    }

    /**
     * Handle event when all went well with getting question.
     *
     * @param {Event} event - Event with information of time limit.
     */
    _questionReceived (event) {
      let limitNumber = event.detail

      // Make sure the question has the right time limit.
      limitNumber = Object.values(limitNumber)
      this._timer.setAttribute('limit', `${limitNumber}`)

      this._eventBus('startTimer')
    }

    /**
     * When answer was correct and there are more questions to get.
     *
     * @param {Event} event - When the answer was right.
     */
    _answerOK (event) {
      this._eventBus('stopTimer')

      // Next question!
      this._eventBus('startQuestion')
    }

    /**
     * Info about elapsed time to add to a player's score.
     *
     * @param {Event} event - Timer stopped and sent info about the time.
     */
    _timerInfo (event) {
      let score = event.detail
      score = Object.values(score)
      score = parseInt(score)

      // Add time to the player's score.
      this._player.score += score
    }

    /**
     * Update conditions for when the game is over.
     *
     * @param {Event} event - Event telling that the game is over.
     */
    _gameover (event) {
      this._eventBus('stopTimer')

      if (event.type === 'gameover' || event.type === 'timeEnd') {
        this._gameState = 'gameover'
      } else if (event.type === 'win') {
        this._gameState = 'win'
        this._playerWon = true

        // Player's score is taken into account only if it won.
        // Send score for evaluation if making it to the highscore.
        this.dispatchEvent(new CustomEvent('newScore', { bubbles: true, composed: true, detail: { scoreInfo: this._player } }))
      }

      this._renderGame()
    }

    /**
     * Reset the game.
     *
     * @param {Event} event - Click event to reset game.
     */
    _resetGame (event) {
      this._gameState = 'restarting'
      this._playerWon = false

      // Make sure questions begin from the beginning.
      this._eventBus('resetQuestion')

      // Render and then reset the state to default.
      this._renderGame()
      this._gameState = 'firstPage'
    }

    /**
     * Dispatch a new custom event.
     *
     * @param {string} event - The name of custom event to dispatch.
     */
    _eventBus (event) {
      this.dispatchEvent(new CustomEvent(`${event}`, { bubbles: true, composed: true }))
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
