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
    align-items: baseline;
    justify-content: center;
  }

  div {
    border: 1px solid;
    padding: 5px;
  }
</style>

<div id="timer">
  <div id="countdown"></div>
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

      // Binding so that it reaches the limit-property.
      this._countdown = this._countdown.bind(this)
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
      console.log('clearing')
    }

    /**
     * Counter.
     *
     */
    _countdown () {
      // const timings = []

      const timer = setInterval(() => {
        const start = new Date().getSeconds()
        console.log(this._limit)
        console.log(start)
        console.log('timing')

        if (start > this._limit) {
          this._reset(timer)
        }
      }, 1000)
    }
  }
)
