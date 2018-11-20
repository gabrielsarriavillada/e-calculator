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
let currentAmountInString = '0';
let partialResult = 0;
let waitForNewNumber = true;
let nextAction = '';
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

// Make math operation.
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
            displayScreen.innerHTML = 'TOO BIG!';
        } else {
            currentAmountInString = partialResult.toString();
            printInScreen();
        }

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

// Adapt current amount and print it on display screen.
let printInScreen = () => {
    currentAmountInString = adaptAmount(currentAmountInString);
    currentAmountInString = removeSpareZeros(currentAmountInString);

    // Add 0 as integer part when . is the first character to be introduced.
    if (currentAmountInString[0] === '.') currentAmountInString = `0${currentAmountInString}`;

    displayScreen.innerHTML = currentAmountInString;
};

// Prepare amount before being printed on screen. It needs to be an expanded number, with equal or less than 12 digits.
let adaptAmount = (amountInString) => {
    let lastDecimalRemoved = '';

    // Avoid logic in case of integer.
    if(!amountInString.includes('.') && !amountInString.includes('e')) return amountInString;

    // TODO: Unify regular expression
    // Convert the amount with format X.Ye-Z to expanded number.
    if (amountInString.match(/^[-+]?[1-9]\.[0-9]+e[-]?[1-9][0-9]*$/) ||
        amountInString.match(/^[-+]?[1-9]+e[-]?[1-9][0-9]*$/)) {
        amountInString = (+amountInString).toFixed(getPrecision(amountInString));
    }

    const int = amountInString.split('.')[0];
    let dec = amountInString.split('.')[1];

    // Reduce the amount of decimals according to the max amount of digit in the e-Calculator.
    while ( int.length + dec.length > 12) {
        lastDecimalRemoved = dec[dec.length - 1];
        dec = dec.substring(0, dec.length - 1);
    }

    // Round last decimal digit.
    if (parseInt(lastDecimalRemoved) > 5) {
        const lastDecimal = (parseInt(dec[dec.length - 1]) + 1).toString();
        dec = dec.substring(0, dec.length - 1);
        dec = dec + lastDecimal;
    }

    return `${int}.${dec}`;
};

let removeSpareZeros = (amountInString) => {
    let int = amountInString.split('.')[0];
    let dec = amountInString.split('.')[1];

    // Remove 0s on the left of integer part.
    while (int[0] === '0' && int.length > 1) {
        int = int.substring(1);
    }

    // Avoid logic in case of integer.
    if (!amountInString.includes('.')) return int;

    // Remove 0s on the right of decimal part.
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
