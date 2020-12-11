/**
 * The high-score web component module.
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
    font-family: Arial, Helvetica, sans-serif;
  }

  :host div {
    margin: 10px;
  }

  :host h1 {
    margin: 0px;
  }

  :host table {
    border-spacing: 15px;
    margin: 0 auto;
    background-color: #fff17ecc;
    border-radius: 5px;
  }

  :host td {
    text-align: center;
  }
</style>

<div>
  <table>
    <thead>
      <tr>
        <th colspan="2"><h1>Highscores</h1></th>
      </tr>
      <tr>
        <th>Player</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>
`
/**
 * Define the custom element.
 */
customElements.define('high-score',
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

      // Highscore-array to keep the 5 best scores in.
      this._highscore = []

      // Get the table element from shadow to present the scores in.
      this._highscoreTable = this.shadowRoot.querySelector('tbody')

      // Bind to reach this.
      this._updateScores = this._updateScores.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      window.addEventListener('newScore', this._updateScores)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      window.removeEventListener('newScore', this._updateScores)
      //
    }

    /**
     * Update highscore with the new score.
     *
     * @param {Event} event - Incoming new score of a player.
     */
    _updateScores (event) {
      const currentPlayer = event.detail.scoreInfo
      const currentScore = currentPlayer.score

      // Lowest score taken into account is 1.
      if (currentScore > 1) {
        // First winner? Add player automatically to highscore.
        if (this._highscore.length < 1) {
          this._highscore.push(currentPlayer)
        // Still free space? Add player and sort.
        } else if (this._highscore.length < 5) {
          this._highscore.push(currentPlayer)
          this._highscore.sort((a, b) => a.score - b.score)
        } else {
          // Highscore already full? Check to see if worth updating
          // and make it so, otherwise just keep highscore as is.
          const worstScore = this._highscore[4].score

          if (currentScore < worstScore) {
            this._highscore.pop()
            this._highscore.push(currentPlayer)
            this._highscore.sort((a, b) => a.score - b.score)
          }
        }
      }

      // Convert highscore to a JSON format.
      const toJson = JSON.stringify(this._highscore)

      // Save highscore to web storage.
      localStorage.setItem('best-quiz-highscore', toJson)

      this._renderHighscore()
    }

    /**
     * Render the highscore information into the html template.
     */
    _renderHighscore () {
      // First, remove previous rendering.
      while (this._highscoreTable.firstElementChild) {
        this._highscoreTable.removeChild(this._highscoreTable.lastChild)
      }
      // Go through all players to add to the table.
      for (let i = 0; i < this._highscore.length; i++) {
        // Create a table row.
        const tr = document.createElement('tr')

        // Add the player name to row.
        const tdName = document.createElement('td')
        tdName.textContent = this._highscore[i].name
        tr.appendChild(tdName)

        // Add the player's score to row.
        const tdScore = document.createElement('td')
        tdScore.textContent = this._highscore[i].score
        tr.appendChild(tdScore)

        // Add row to the table.
        this._highscoreTable.appendChild(tr)
      }
    }
  }
)
