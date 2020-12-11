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
    background-color: #eeeccc;
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
      clearInterval(timer)
      this._reset()
    }

    /**
     * Reset the timer.
     *
     * @returns {object} - Reference to itself.
     */
    _reset () {
      // Send information of how many seconds the timer has elapsed.
      this.dispatchEvent(new CustomEvent('timerStopped', { bubbles: true, composed: true, detail: { counter: this._count } }))

      this._count = 0

      return this
    }

    /**
     * Timer counting down with a setInterval,
     * which callbacks every 1 sec.
     *
     * @param {Event} event - Starting the countdown.
     */
    _countdown (event) {
      let time = this._limit

      // First display of starting number.
      this._displayTime(time)

      // Begin timer in an interval every 1 second.
      timer = setInterval(() => {
        this._count++
        time = this._limit - this._count

        if (time <= 0) {
          // Tell that timer has reached its end.
          // But dependent on other component to tell timer to stop if desired.
          this.dispatchEvent(new CustomEvent('timeEnd', { bubbles: true, composed: true }))
        } else {
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

      // Add the number to the #counter-div.
      this._counter.append(number)
    }
  }
)
