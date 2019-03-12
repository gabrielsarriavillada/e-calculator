import { selectOnPad } from './calc.js';
import { getLeastCommonMultiple } from './lcm.js';
import OPERATORS from './operators.const.js';

// Selector of elements for header and containers.
const headerMenu = document.querySelector('#header-menu');
const headerMenuOptions = document.querySelectorAll('#header-menu li');
const homeContainer = document.querySelector('#home-container');
const calcContainer = document.querySelector('#calculator-container');
const lcmContainer = document.querySelector('#lcm-calculator-container');

// Selector of elements in the calculator.
let calculatorPad = document.querySelector('#calculator-pad');

// Selector of elements in the least common multiple calculator.
let displayResult = document.querySelector('#result');
const getLMC = document.querySelector('#getLMC');
const amountInput = document.querySelector('[title="amountNumbers"]');
const firstStage = document.querySelector('#lcm-first-stage');
const secondStage = document.querySelector('#lcm-second-stage');
const submitAmount = document.querySelector('#submitAmount');

headerMenu.onclick = (event) => {
    let option = event.target;

    if (option.tagName != 'LI') return;

    for (let i = 0; i < headerMenuOptions.length; i++) {
        headerMenuOptions[i].classList.remove('active');
    }

    option.classList.add('active');

    switch (option.title) {
        case 'home':
            displayHome();
            break;
        case 'calc':
            displayCalc();
            break;
        case 'lcm':
            displayLCM();
            break;
        default:
            addDigit(button.title);
            printInScreen();
    }
};

submitAmount.onclick = () => {
    const amount = amountInput.value;
    let numberInputs = getInputElement(1) + getInputElement(2);

    for(let i = 3; i <= amount; i++) {
        numberInputs += getInputElement(i);
    }

    firstStage.classList.add('hidden');
    secondStage.classList.remove('hidden');

    const secondStageInputs = document.querySelector('#inputs');
    secondStageInputs.innerHTML += numberInputs;
};

getLMC.onclick = () => {
    const numberSelectors = document.querySelectorAll('#inputNumber');
    const numbers = [];
    let result = 1;

    // Get the numbers from the input fields into an array.
    for (let i = 0;i < numberSelectors.length; i++) {
        numbers.push(parseInt(numberSelectors[i].value));
    }

    // Calculate lcm across the array.
    for (let i = 0; i < numbers.length; i++) {
        result = getLeastCommonMultiple(result, numbers[i]);
    }

    displayResult.innerHTML = result;
};

// Action is performed when a button in calculator pad is clicked on.
calculatorPad.onclick = (event) => {
    let target = event.target;
    let action = OPERATORS.EQUALITY;

    if (target.tagName != 'DIV') return;

    action = selectOnPad(target, action);
};

// Button is displayed as pressed while it is pressed by the mouse.
calculatorPad.onmousedown = (event) => {
    let target = event.target;

    if (target.tagName != 'DIV') return;

    target.classList.add('active');
};

// Button is displayed as unpressed if it is not longer pressed by mouse.
calculatorPad.onmouseup = (event) => {
    let target = event.target;

    if (target.tagName != 'DIV') return;

    target.classList.remove('active');
};

// Button is displayed as unpressed if mouse leaves the button.
calculatorPad.onmouseout = (event) => {
    let target = event.target;

    if (target.tagName != 'DIV') return;

    target.classList.remove('active');
};

let displayHome = () => {
    homeContainer.classList.remove('hidden');
    calcContainer.classList.add('hidden');
    lcmContainer.classList.add('hidden');
};

let displayCalc = () => {
    homeContainer.classList.add('hidden');
    calcContainer.classList.remove('hidden');
    lcmContainer.classList.add('hidden');
};

let displayLCM = () => {
    homeContainer.classList.add('hidden');
    calcContainer.classList.add('hidden');
    lcmContainer.classList.remove('hidden');
};

// Construct the input element for the lcm calculator.
let getInputElement = (int) => {
    return `<input id="inputNumber" title="number${int}" placeholder="Default to 1">`;
};