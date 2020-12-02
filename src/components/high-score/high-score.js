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

div {
  margin: 10px;
}

h1 {
  margin: 0px;
}

table {
  border-spacing: 15px;
  margin: 0 auto;
  background-color: #CCCCCC;
  border-radius: 5px;
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
    <tbody>
    <tr id="first"></tr>
    <tr id="second"></tr>
    <tr id="third"></tr>
    <tr id="fourth"></tr>
    <tr id="fifth"></tr>
    </tbody>
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

      //
    }

    /**
     * Looks out for changes in attributes.
     *
     * @returns {string[]} - An array with stings of the attibutes.
     */
    static get observedAttributes () {
      return ['hidden']
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

    //
  }
)
