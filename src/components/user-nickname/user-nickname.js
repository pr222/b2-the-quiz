/**
 * The user-nickname web component module which handles a form
 * element and saves the submitted name as a new user.
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
    background-color: #eaa6ae8a;
    text-align: center;
    margin-top: 25px;
    margin-bottom: 15px;
    padding-top: 1px;
    padding-bottom: 25px;
    border-radius: 5px;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>

<h1>Choose a nickname!</h1>
<form id="nameForm">
  <label for="username">Name: </label>
  <input type="text" id="username" name="username" autofocus autocomplete="off">
  <input type="submit" value="Confirm">
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

      // Get the text input field of the form.
      this._userInput = this.shadowRoot.querySelector('#username')

      // Get the form element for listening to the submit event.
      this._submitUser = this.shadowRoot.querySelector('#nameForm')

      // Binding for _onSubmit to reach this.
      this._onSubmit = this._onSubmit.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this._submitUser.addEventListener('submit', this._onSubmit)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._submitUser.removeEventListener('submit', this._onSubmit)
    }

    /**
     * Take care of submit username-event.
     *
     * @param {Event} event - submit the username.
     */
    _onSubmit (event) {
      // Prevent default posting of form submission.
      event.preventDefault()

      const input = this._userInput.value

      // Make sure user enters at least 1 letter as its username.
      if (input.length < 1 || input === 'Please choose a name!') {
        this._userInput.value = 'Please choose a name!'
        this._userInput.focus()
        this._userInput.select()
      } else {
        // Create new event sending away the name of the user.
        this.dispatchEvent(new CustomEvent('newUser', { bubbles: true, detail: { username: input } }))

        // Making sure to empty the input field for next use.
        this._userInput.value = ''
      }
    }
  }
)
