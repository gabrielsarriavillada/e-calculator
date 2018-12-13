import MESSAGES from './displayMessages.const.js';

// Enum with the available operators.
const operator = {
    ADDITION: 'addition',
    SUBTRACTION: 'subtraction',
    MULTIPLICATION: 'multiplication',
    DIVISION: 'division',
    EQUALITY: 'equality',
};

// Selector of elements in the calculator.
let displayScreen = document.querySelector('#display-screen');
let calculatorPad = document.querySelector('#calculator-pad');

const SCREEN_LENGTH = 12;

// Initialize e-Calculator.
let number = {
    value: '0',
    sign: '',
};
let result = 0;
let waitForNewNumber = true;
let nextAction = operator.EQUALITY;
let waitForFirstDecimal = false;

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
            nextAction = operator.EQUALITY;
            break;
        case 'invert':
            plusNegative();
            break;
        case 'clear-to-empty':
            number.value = '0';
            printInScreen();
            break;
        case 'all-clear':
            number.value = '0';
            result = 0;
            printInScreen();
            break;
        case 'decimal':
            addDecimalSeparator();
            break;
        default:
            addDigit(button.title);
            printInScreen();
    }
};

// Make math operation.
let resolveOperation = () => {
    let currentAmount = parseFloat(number.value);

    if (number.sign === '-') currentAmount *= -1;

    if (!waitForNewNumber) {
        // Result is updated according to last action.
        switch (nextAction) {
            case operator.ADDITION:
                result += currentAmount;
                break;
            case operator.SUBTRACTION:
                result -= currentAmount;
                break;
            case operator.MULTIPLICATION:
                result = result * currentAmount;
                break;
            case operator.DIVISION:
                result = result / currentAmount;
                break;
            case operator.EQUALITY:
                result = currentAmount;
                break;
            default:
                console.log('Invalid operator.');
        }

        if (result > (Math.pow(10, SCREEN_LENGTH) - 1)) {
            displayScreen.innerHTML = MESSAGES.BIG_AMOUNT;
        } else {
            number.value = Math.abs(result).toString();
            number.sign = '';

            if (result < 0) number.sign = '-';

            printInScreen();
        }

        // Current amount and sign are restarted when operation is submitted.
        number.value = '0';
        number.sign = '';
    }

    waitForNewNumber = true;
};

// Add a digit to the current amount.
let addDigit = (digit) => {
    let amountLength = number.value.length;
    waitForNewNumber = false;

    if (number.value.includes('.')) amountLength--;

    if (amountLength < SCREEN_LENGTH) {
        if (waitForFirstDecimal) {
            number.value += '.';
            waitForFirstDecimal = false;
        }
        number.value += digit;
    }
};

// Change the sign of the amount displayed in the screen.
let plusNegative = () => {
    // The amount in the screen is a result of an operation.
    if (waitForNewNumber === true) {
        number.value = Math.abs(result).toString();
        number.sign = '-';

        if (result < 0) number.sign = '';

        printInScreen();

        result *= -1;
        number.value = '0';
        number.sign = '';
        return;
    }

    // The amount in the screen is being introduced.
    if (number.sign === '-' || number.value === '0') {
        number.sign = '';
    } else if (number.sign === '') {
        number.sign = '-';
    } else {
        console.log('Unexpected sign in current amount');
    }
    printInScreen();
};

let addDecimalSeparator = () => {
    waitForNewNumber = false;
    if (!number.value.includes('.')) waitForFirstDecimal = true;
};

// Adapt current amount and print it on display screen.
let printInScreen = () => {
    number.adaptAmount();
    number.removeSpareZeros();

    // Add 0 as integer part when . is the first character to be introduced.
    if (number.value[0] === '.') number.value = `0${number.value}`;

    displayScreen.innerHTML = number.sign + number.value;
};

// Prepare amount before being printed on screen. It needs to be an expanded number, with equal or less than 12 digits.
number.adaptAmount = () => {
    let lastDecimalRemoved = '';

    // Avoid logic in case of integer.
    if(!number.value.includes('.') && !number.value.includes('e')) return;

    // TODO: Unify regular expression
    // Convert the amount with format X.Ye-Z to expanded number.
    if (number.value.match(/^[-+]?[1-9]\.[0-9]+e[-]?[1-9][0-9]*$/) ||
        number.value.match(/^[-+]?[1-9]+e[-]?[1-9][0-9]*$/)) {
        number.value = (+number.value).toFixed(getPrecision(number.value));
    }

    const int = number.value.split('.')[0];
    let dec = number.value.split('.')[1];

    // Reduce the amount of decimals according to the max amount of digit in the e-Calculator.
    while ( int.length + dec.length > SCREEN_LENGTH) {
        lastDecimalRemoved = dec[dec.length - 1];
        dec = dec.substring(0, dec.length - 1);
    }

    // Round last decimal digit.
    if (parseInt(lastDecimalRemoved) > 4) {
        const lastDecimal = (parseInt(dec[dec.length - 1]) + 1).toString();
        dec = dec.substring(0, dec.length - 1);
        dec = dec + lastDecimal;
    }

    number.value = `${int}.${dec}`;
};

number.removeSpareZeros = () => {
    let int = number.value.split('.')[0];
    let dec = number.value.split('.')[1];

    // Remove 0s on the left of integer part.
    while (int[0] === '0' && int.length > 1) {
        int = int.substring(1);
    }

    // Avoid logic in case of integer.
    if (!number.value.includes('.')){
        number.value = int;
        return;
    }

    // Remove 0s on the right of decimal part.
    while (dec[dec.length - 1] === '0') {
        dec = dec.substring(0, dec.length - 1)
    }

    number.value = `${int}.${dec}`;
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
