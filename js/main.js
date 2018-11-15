const operator = {
    ADDITION: 'addition',
    SUBTRACTION: 'subtraction',
    MULTIPLICATION: 'multiplication',
    DIVISION: 'division',
    EQUALITY: 'equality',
};

let elem = document.querySelector('.display-screen');
let currentAmountInString = '';
let partialResult = 0;
let waitForNewNumber = true;
let nextAction = '';

let selectedButton;

let calculatorPad = document.querySelector('.calculator-pad');

calculatorPad.onclick = function(event) {
    let target = event.target;

    if (target.tagName != 'DIV') return;

    select(target);
};

function select(button) {
    press(button);
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
            elem.innerHTML = '0';
            currentAmountInString = '0';
            partialResult = 0;
            console.log(`Your current number is ${currentAmountInString}`);
            break;
        default:
            console.log(`My attribute value is: ${button.title}`)
            addDigit(button.title);
            printInScreen();
    }
}

function press(button) {
    if (selectedButton) {
        selectedButton.classList.remove('highlight');
    }
    selectedButton = button;
    selectedButton.classList.add('highlight');
}

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

        elem.innerHTML = partialResult.toString();

        // Current amount is restarted the first time an addition is submit
        currentAmountInString = '0';
    }

    waitForNewNumber = true;
};

let addDigit = (digit) => {
    waitForNewNumber = false;
    currentAmountInString += digit;
};

let printInScreen = () => {
    while (currentAmountInString[0] === '0' && currentAmountInString.length > 1) {
        currentAmountInString = currentAmountInString.substring(1);
    }
    elem.innerHTML = currentAmountInString;
    console.log(`Your current number is ${currentAmountInString}`);
};
