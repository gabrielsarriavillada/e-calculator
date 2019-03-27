import { adaptAmount, removeSpareZeros } from './calc.methods.js';
import { addition, subtraction, multiplication, division } from './calc.operations.js'
import MESSAGES from './displayMessages.const.js';
import OPERATORS from './operators.const.js';
import SETTINGS from './calc.settings.js';
import SELECTORS from './calc.selectors.js';

// Selector of elements in the calculator.
// let displayScreen = document.querySelector('#display-screen');

// Information in the calculator buffer. Values have been initialized.
let buffer = {
    action: OPERATORS.EQUALITY,
    result: 0,
    number: {
        value: '0',
        sign: '',
    },
    waitForNewNumber: true,
    waitForFirstDecimal: false,
};

// Actions to be performed when a button in calculator pad is clicked on.
export const selectOnPad = (button) => {
    let previousAction = getAction();
    let nextAction = previousAction;

    switch (button.title) {
        case 'addition':
            setResult(resolveOperation(previousAction, getNumber(), getResult(), getWaitForNewNumber()));
            nextAction = OPERATORS.ADDITION;
            break;
        case 'subtraction':
            setResult(resolveOperation(previousAction, getNumber(), getResult(), getWaitForNewNumber()));
            nextAction = OPERATORS.SUBTRACTION;
            break;
        case 'multiplication':
            setResult(resolveOperation(previousAction, getNumber(), getResult(), getWaitForNewNumber()));
            nextAction = OPERATORS.MULTIPLICATION;
            break;
        case 'division':
            setResult(resolveOperation(previousAction, getNumber(), getResult(), getWaitForNewNumber()));
            nextAction = OPERATORS.DIVISION;
            break;
        case 'equality':
            setResult(resolveOperation(previousAction, getNumber(), getResult(), getWaitForNewNumber()));
            nextAction = OPERATORS.EQUALITY;
            break;
        case 'invert':
            plusNegative(getResult(), getNumber(), getWaitForNewNumber());
            break;
        case 'clear-to-empty':
            setNumberValue('0');
            printInScreen(getNumber());
            break;
        case 'all-clear':
            setNumberValue('0');
            setResult(0);
            printInScreen(getNumber());
            break;
        case 'decimal':
            addDecimalSeparator(getNumberValue());
            break;
        default:
            setNumberValue(addDigit(getNumberValue(), button.title, getWaitForFirstDecimal()));
            printInScreen(getNumber());
    }

    setAction(nextAction);
};

// Make math operation.
export let resolveOperation = (action, number, result, waitForNewNumber) => {
    let currentAmount = parseFloat(number.value);

    if (number.sign === '-') currentAmount *= -1;

    if (!waitForNewNumber) {
        // Result is updated according to last action.
        switch (action) {
            case OPERATORS.ADDITION:
                result = addition(result, currentAmount);
                break;
            case OPERATORS.SUBTRACTION:
                result = subtraction(result, currentAmount);
                break;
            case OPERATORS.MULTIPLICATION:
                result = multiplication(result, currentAmount);
                break;
            case OPERATORS.DIVISION:
                result = division(result, currentAmount);
                break;
            case OPERATORS.EQUALITY:
                result = currentAmount;
                break;
            default:
                console.log('Invalid operator.');
        }

        if (result > (Math.pow(10, SETTINGS.SCREEN_LENGTH) - 1)) {
            SELECTORS.displayScreen.innerHTML = MESSAGES.BIG_AMOUNT;
        } else {
            number.value = Math.abs(result).toString();
            number.sign = '';

            if (result < 0) number.sign = '-';

            printInScreen(getNumber());
        }

        // Current amount and sign are restarted when operation is submitted.
        number.value = '0';
        number.sign = '';
    }

    setWaitForNewNumber(true);

    return result;
};

// Add a digit to the current amount.
let addDigit = (value, digit, waitForFirstDecimal) => {
    let amountLength = value.length;
    let newValue = value;
    setWaitForNewNumber(false);

    if (newValue.includes('.')) amountLength--;

    if (amountLength < SETTINGS.SCREEN_LENGTH) {
        if (waitForFirstDecimal) {
            newValue += '.';
            setWaitForFirstDecimal(false);
        }
        newValue += digit;
    }

    return newValue;
};

// Change the sign of the amount displayed in the screen.
let plusNegative = (result, number, waitForNewNumber) => {
    // The amount in the screen is a result of an operation.
    if (waitForNewNumber === true) {
        setNumberValue(Math.abs(result).toString());
        setNumberSign('-');

        if (result < 0) setNumberSign('');

        printInScreen(number);

        result *= -1;

        setResult(result);
        setNumberValue('0');
        setNumberSign('');
        return;
    }

    // The amount in the screen is being introduced.
    if (number.sign === '-' || number.value === '0') {
        setNumberSign('');
    } else if (number.sign === '') {
        setNumberSign('-');
    } else {
        console.log('Unexpected sign in current amount');
    }
    printInScreen(number);
};

let addDecimalSeparator = (value) => {
    setWaitForNewNumber(false);
    if (!value.includes('.')) setWaitForFirstDecimal(true);
};

// Adapt current amount and print it on display screen.
let printInScreen = (number) => {
    number.value = adaptAmount(number.value);
    number.value = removeSpareZeros(number.value);

    setNumberValue(number.value);

    // Add 0 as integer part when . is the first character to be introduced.
    if (number.value[0] === '.') setNumberValue(`0${number.value}`);

    SELECTORS.displayScreen.innerHTML = number.sign + number.value;
};

let setAction = (action) => {
    buffer.action = action;
};

let getAction = () => {
    return buffer.action;
};

let setResult = (result) => {
    buffer.result = result;
};

let getResult = () => {
    return buffer.result;
};

let setNumberValue = (value) => {
    buffer.number.value = value;
};

let setNumberSign = (sign) => {
    buffer.number.sign = sign;
};

let getNumber = () => {
    return buffer.number;
};

let getNumberValue = () => {
    return buffer.number.value;
};

let getNumberSign = () => {
    return buffer.number.sign;
};

let setWaitForNewNumber = (state) => {
    buffer.waitForNewNumber = state;
};

let setWaitForFirstDecimal = (state) => {
    buffer.waitForFirstDecimal = state;
};

let getWaitForNewNumber = () => {
    return buffer.waitForNewNumber;
};

let getWaitForFirstDecimal = () => {
    return buffer.waitForFirstDecimal;
};
