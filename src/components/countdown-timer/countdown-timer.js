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
      display: block;
      background-color: #CCCCCC;
  }

  #timer {
    display: flex;
    flex-direction: row;
   /* align-items: baseline; */
    justify-content: center;
  }

  div {
    border: 1px solid;
    padding: 5px;
  }
</style>

<div id="timer">
  <div id="counter"></div>
  <div><p>seconds</p></div>
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

      this._counter = this.shadowRoot.querySelector('#counter')

      // Binding so that it reaches the limit-property.
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
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute.
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
      //
      window.addEventListener('load', this._countdown)
      // window.addEventListener('load', this._displayTime)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      //
      // this.removeEventListener('onload', this._countdown)
    }

    /**
     * Stop the timer.
     *
     * @param {*} timer - The interval to stop/clear out.
     */
    _reset (timer) {
      clearInterval(timer)
      console.log('clearing countdown timer')
    }

    /**
     * Timer counting down.
     *
     */
    _countdown () {
      // Starting number for the timer.
      let timing = this._limit + 1
      // console.log(this._limit)

      // Begin timer in an interval.
      const timer = setInterval(() => {
        // Decrease timer by one.
        timing--
        // console.log(`Timing: ${timing}`)

        // Stop the timer when reaching 0.
        if (timing <= 0) {
          this._reset(timer)
        }

        this._displayTime(timing)
      }, 1000)
    }

    /**
     * Display current time.
     *
     * @param {number} time - The number of the current second.
     */
    _displayTime (time) {
      // console.log(this._counter)
      // console.log(time)
      // See if there is a number and remove if so.
      if (this._counter.hasChildNodes()) {
        this._counter.removeChild(this._counter.firstChild)
      }

      // Create a element to present and add the time in.
      const number = document.createElement('p')
      number.textContent = time

      // Add the time to the #counter-div.
      this._counter.append(number)
    }
  }
)
