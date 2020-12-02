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

// A container-div on index.html
const container = document.querySelector('#container')

// Create a countdown-timer and insert to page.
const countdownTimer = document.createElement('countdown-timer')
container.appendChild(countdownTimer)
