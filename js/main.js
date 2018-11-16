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

let currentAmountInString = '';
let partialResult = 0;
let waitForNewNumber = true;
let nextAction = '';


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
        case 'clear':
            displayScreen.innerHTML = '0';
            currentAmountInString = '0';
            partialResult = 0;
            console.log(`Your current number is ${currentAmountInString}`);
            break;
        default:
            addDigit(button.title);
            printInScreen();
    }
};

// Make an math operation.
let resolveOperation = () => {
    const currentAmount = parseInt(currentAmountInString);

    if (!waitForNewNumber) {
        // Partial result is updated according to last action
        console.log('I am not waiting a number');
        switch (nextAction) {
            case operator.ADDITION:
                console.log('Last action was an addition');
                partialResult += currentAmount;
                break;
            case operator.SUBTRACTION:
                console.log('Last action was a subtraction');
                partialResult -= currentAmount;
                break;
            case operator.MULTIPLICATION:
                console.log('Last action was a multiplication');
                partialResult = partialResult * currentAmount;
                break;
            case operator.DIVISION:
                console.log('Last action was a division');
                partialResult = partialResult / currentAmount | 0;
                break;
            case '':
                console.log('This is the first action');
                partialResult = currentAmount;
                break;
            default:
                console.log('Invalid operator.');
        }

        displayScreen.innerHTML = partialResult.toString();

        // Current amount is restarted the first time an addition is submit
        currentAmountInString = '0';
    }

    waitForNewNumber = true;
};

// Add a digit to the current amount.
let addDigit = (digit) => {
    waitForNewNumber = false;
    currentAmountInString += digit;
};

// Print current amount on display screen.
let printInScreen = () => {
    while (currentAmountInString[0] === '0' && currentAmountInString.length > 1) {
        currentAmountInString = currentAmountInString.substring(1);
    }
    displayScreen.innerHTML = currentAmountInString;
    console.log(`Your current number is ${currentAmountInString}`);
};
