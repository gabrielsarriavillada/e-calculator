// Enum with the available operators.
const operator = {
    ADDITION: 'addition',
    SUBTRACTION: 'subtraction',
    MULTIPLICATION: 'multiplication',
    DIVISION: 'division',
    EQUALITY: 'equality',
};

// Selector of elements in the calculator.
let displayScreen = document.querySelector('.display-screen');
let calculatorPad = document.querySelector('.calculator-pad');

// Initialize e-Calculator.
let currentAmountInString = '';
let partialResult = 0;
let waitForNewNumber = true;
let nextAction = '';
let waitForFirstDecimal = false;

displayScreen.innerHTML = '0';

// Action is performed when a button in calculator pad is clicked on.
calculatorPad.onclick = (event) => {
    let target = event.target;

    if (target.tagName != 'DIV') return;

    select(target);
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

// Actions to be performed when a button in calculator pad is clicked on.
let select = (button) => {
    switch (button.title) {
        case 'addition':
            resolveOperation();
            nextAction = operator.ADDITION;
            break;
        case 'subtraction':
            resolveOperation();
            nextAction = operator.SUBTRACTION;
            break;
        case 'multiplication':
            resolveOperation();
            nextAction = operator.MULTIPLICATION;
            break;
        case 'division':
            resolveOperation();
            nextAction = operator.DIVISION;
            break;
        case 'equality':
            resolveOperation();
            nextAction = '';
            break;
        case 'clear-to-empty':
            currentAmountInString = '0';
            printInScreen();
            break;
        case 'all-clear':
            currentAmountInString = '0';
            partialResult = 0;
            printInScreen();
            break;
        case 'decimal':
            addDecimalSeparator();
            printInScreen();
            break;
        default:
            addDigit(button.title);
            printInScreen();
    }
};

// Make an math operation.
let resolveOperation = () => {
    const currentAmount = parseFloat(currentAmountInString);
    let display = '';

    if (!waitForNewNumber) {
        // Partial result is updated according to last action
        switch (nextAction) {
            case operator.ADDITION:
                partialResult += currentAmount;
                break;
            case operator.SUBTRACTION:
                partialResult -= currentAmount;
                break;
            case operator.MULTIPLICATION:
                partialResult = partialResult * currentAmount;
                break;
            case operator.DIVISION:
                partialResult = partialResult / currentAmount;
                break;
            case '':
                partialResult = currentAmount;
                break;
            default:
                console.log('Invalid operator.');
        }

        if (partialResult > 99999999999) {
            display = 'A LOT!';
        } else {
            console.log(`Amount before being rounded is ${partialResult}`);
            display = roundAmount(partialResult);
        }

        displayScreen.innerHTML = display;

        // Current amount is restarted when operation is submitted.
        currentAmountInString = '0';
    }

    waitForNewNumber = true;
};

// Add a digit to the current amount.
let addDigit = (digit) => {
    let amountLength = currentAmountInString.length;
    waitForNewNumber = false;

    if (currentAmountInString.includes('.')) amountLength--;

    if (amountLength < 12) {
        if (waitForFirstDecimal) {
            currentAmountInString += '.';
            waitForFirstDecimal = false;
        }
        currentAmountInString += digit;
    }
};

let addDecimalSeparator = () => {
    waitForNewNumber = false;
    if (!currentAmountInString.includes('.')) waitForFirstDecimal = true;
};

// Print current amount on display screen.
let printInScreen = () => {
    while (currentAmountInString[0] === '0' && currentAmountInString.length > 1) {
        currentAmountInString = currentAmountInString.substring(1);
    }

    if (currentAmountInString[0] === '.') currentAmountInString = `0${currentAmountInString}`;

    displayScreen.innerHTML = currentAmountInString;
    console.log(`Your current number is ${currentAmountInString}, where first digit is ${currentAmountInString[0]} and last digit is ${currentAmountInString[currentAmountInString.length - 1]}`);
};


let roundAmount = (amount) => {
    let amountToString = amount.toString();
    let lastDecimalRemoved = '';

    // Avoid logic in case of integer.
    if(!amountToString.includes('.') && !amountToString.includes('e')) return amountToString;

    // TODO: Unify regular expression
    // Convert the amount with format X.Ye-Z to expanded number.
    if (amountToString.match(/^[-+]?[1-9]\.[0-9]+e[-]?[1-9][0-9]*$/) || amountToString.match(/^[-+]?[1-9]+e[-]?[1-9][0-9]*$/)) {
        console.log('Inside IF');
        amountToString = (+amountToString).toFixed(getPrecision(amountToString));
    }

    const int = amountToString.split('.')[0];
    let dec = amountToString.split('.')[1];

    while ( int.length + dec.length > 12) {
        lastDecimalRemoved = dec[dec.length - 1];
        dec = dec.substring(0, dec.length - 1);
    }

    if (parseInt(lastDecimalRemoved) > 5) {
        const lastDecimal = (parseInt(dec[dec.length - 1]) + 1).toString();
        dec = dec.substring(0, dec.length - 1);
        dec = dec + lastDecimal;
    }

    while (dec[dec.length - 1] === '0') {
        dec = dec.substring(0, dec.length - 1)
    }

    return `${int}.${dec}`;
};

// Get a nice decimal place precision for the scientific notation number.
// e.g. 1.23e-7 yields 7+2 places after the decimal point
// e.g. 4.5678e-11 yields 11+4 places after the decimal point
let getPrecision = (scinum) => {
    let arr = scinum.split('e');
    let precision = Math.abs(arr[1]);

    if (arr[0].includes('.')) {
        arr = arr[0].split('.');
        precision += arr[1].length;
    }

    return precision;
};
