/**
 * The countdown-timer web component module.
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
      this._counter = 0

      // Get the div-element for displaying the counting number.
      this._counter = this.shadowRoot.querySelector('#counter')

      // Bindings for reaching the this._limit-property.
      this._countdown = this._countdown.bind(this)
      this._displayTime = this._displayTime.bind(this)
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
        this._limit = newValue
      }
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      window.addEventListener('startTimer', this._countdown)
      window.addEventListener('stopTimer', this._reset)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      window.removeEventListener('startTimer', this._countdown)
      window.removeEventListener('stopTimer', this._reset)
    }

    /**
     * Get the counter.
     *
     * @readonly
     * @returns {number} - The counters current number.
     */
    get counter () {
      return this._counter
    }

    /**
     * Stop the timer.
     *
     * @param {number} timer - The interval to stop.
     * @returns {object} - Reference to itself.
     *
     */
    _reset (timer) {
      clearInterval(timer)
      console.log('clearing countdown timer')

      return this
    }

    /**
     * Timer counting down with a setInterval,
     * which callbacks every 1 sec.
     */
    _countdown () {
      let time = this._limit

      // First display of starting number.
      this._displayTime(time)

      // Begin timer in an interval.
      const timer = setInterval(() => {
        this._counter++
        time = this._limit - this._counter

        // Stop the timer when reaching 0.
        if (time <= 0) {
          this._reset(timer)
        }

        // If timer was not stopped, render the number.
        this._displayTime(time)
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
