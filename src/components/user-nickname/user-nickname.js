/**
 * The user-nickname web component module.
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
    text-align: center;
    margin-top: 25px;
    padding-top: 1px;
    padding-bottom: 15px;
    border-radius: 5px;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>

<h1>Choose a username!</h1>
<form id="nameForm">
  <label for="username">Username: </label>
  <input type="text" id="username" name="username" autofocus autocomplete="off">
  <input type="submit" value="Confirm name">
</form>
`
/**
 * Define the custom element.
 */
customElements.define('user-nickname',
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

      this._userInput = this.shadowRoot.querySelector('#username')
      this._submitUser = this.shadowRoot.querySelector('#nameForm')
      //

      this._onSubmit = this._onSubmit.bind(this)
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
      this._submitUser.addEventListener('submit', this._onSubmit)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      //
      this._submitUser.removeEventListener('submit', this._onSubmit)
    }

    /**
     * Take care of submit username-event.
     *
     * @param {Event} event - submit the username.
     */
    _onSubmit (event) {
      event.preventDefault()

      const input = this._userInput.value
      console.log(input)
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
