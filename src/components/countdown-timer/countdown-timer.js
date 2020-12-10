/**
 * The countdown-timer web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

let timer

/**
 * Define the template.
 */
const template = document.createElement('template')
template.innerHTML = ` 
<style>
  :host {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    display: block;
    background-color: #CCCCCC;
    border-radius: 5px;
  }

  #timer {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  #counter {
    margin-right: 5px;
  }
</style>

<div id="timer">
  <div id="counter"></div>
  <div><p>seconds left</p></div>
</div>
`
/**
 * Define the custom element.
 */
customElements.define('countdown-timer',
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

      // Default time limit of 20 seconds.
      this._limit = 20

      // How many times the countdown has been activated.
      this._count = 0

      // Get the div-element for displaying the counting number.
      this._counter = this.shadowRoot.querySelector('#counter')

      // Bindings for reaching the this._limit-property.
      this._countdown = this._countdown.bind(this)
      this._displayTime = this._displayTime.bind(this)
      this._reset = this._reset.bind(this)
      this._stopTimer = this._stopTimer.bind(this)
    }

    /**
     * Looks out for changes in attributes.
     *
     * @returns {string[]} - An array with stings of the attibutes.
     */
    static get observedAttributes () {
      return ['limit']
    }

    /**
     * Called by the browser when an attribute is changed.
     *
     * @param {string} name - The name of the attribute.
     * @param {string} oldValue - The old attribute value.
     * @param {string} newValue - The new attribute.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      //
      if (name === 'limit') {
        if (newValue === '') {
          this._limit = 20
        } else {
          this._limit = newValue
        }
      }
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      window.addEventListener('startTimer', this._countdown)
      window.addEventListener('stopTimer', this._stopTimer)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      window.removeEventListener('startTimer', this._countdown)
      window.removeEventListener('stopTimer', this._stopTimer)
    }

    /**
     * Stop the timer.
     *
     * @param {Event} event - To stop the timer.
     */
    _stopTimer (event) {
      console.log('Stopping the timer')
      clearInterval(timer)
      timer = null
      this._reset()
    }

    /**
     * Reset the timer.
     *
     * @returns {object} - Reference to itself.
     */
    _reset () {
      console.log('resetting countdown timer')
      // console.log('limit ' + this._limit)
      // console.log('counter ' + this._count)

      console.log('Timer stopped, here is how many seconds...')
      this.dispatchEvent(new CustomEvent('timerStopped', { bubbles: true, composed: true, detail: { counter: this._count } }))

      this._count = 0
      // console.log('limit ' + this._limit)
      // console.log('counter ' + this._count)
      return this
    }

    /**
     * Timer counting down with a setInterval,
     * which callbacks every 1 sec.
     *
     * @param {Event} event - Starting the countdown.
     */
    _countdown (event) {
      console.log('Starting the timer.')
      let time = this._limit
      // console.log('The limit for this question: ' + this._limit)

      // First display of starting number.
      this._displayTime(time)

      // console.log('START INTERVAL')

      // Begin timer in an interval.
      timer = setInterval(() => {
        // console.log(timer)
        // console.log('an interval')

        this._count++
        time = this._limit - this._count

        // Stop the timer when reaching 0.
        if (time <= 0) {
          this.dispatchEvent(new CustomEvent('gameover', { bubbles: true, composed: true }))
        } else {
          // If timer was not stopped, render the number.
          this._displayTime(time)
        }
      }, 1000)
    }

    /**
     * Display current time.
     *
     * @param {number} time - The number of the current second.
     */
    _displayTime (time) {
      // Remove element if already displaying a number.
      if (this._counter.hasChildNodes()) {
        this._counter.removeChild(this._counter.firstChild)
      }

      // Create a element to present and add the number.
      const number = document.createElement('p')
      number.textContent = time

      // Add the time-number to the #counter-div.
      this._counter.append(number)
    }
  }
)
