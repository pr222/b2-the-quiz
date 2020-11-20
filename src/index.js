/**
 * The main script file of the application.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

import './components/quiz-app/'
import './components/quiz-questions/'
import './components/user-nickname/'
import './components/high-score/'
import './components/countdown-timer/'

const messageContainer = document.querySelector('#messageContainer')
const message = document.createTextNode('Hi from an ECMAScript Module.')
messageContainer.appendChild(message)

// TODO: This is just some temple code that you are free to use, modify or completly delete. Add your code here instead.
