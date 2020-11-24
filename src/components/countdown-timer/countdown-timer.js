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
  <div id="countdown">0</div>
  <div><p>seconds left.</p></div>
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
    }

    /**
     * Looks out for changes in attributes.
     *
     * @returns {string[]} - An array with stings of the attibutes.
     */
    static get observedAttributes () {
      return ['']
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      //
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      //
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
    }

    //
  }
)
