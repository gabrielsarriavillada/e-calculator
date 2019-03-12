import SETTINGS from "./calc.settings.js";

// Prepare amount before being printed on screen. It needs to be an expanded number, with equal or less than 12 digits.
export let adaptAmount = (value) => {
    let lastDecimalRemoved = '';
    let newValue = value;

    // Avoid logic in case of integer.
    if(!newValue.includes('.') && !newValue.includes('e')) return newValue;

    // TODO: Unify regular expression
    // Convert the amount with format X.Ye-Z to expanded number.
    if (newValue.match(/^[-+]?[1-9]\.[0-9]+e[-]?[1-9][0-9]*$/) ||
        newValue.match(/^[-+]?[1-9]+e[-]?[1-9][0-9]*$/)) {
        newValue = (+newValue).toFixed(getPrecision(newValue));
    }

    const int = newValue.split('.')[0];
    let dec = newValue.split('.')[1];

    // Reduce the amount of decimals according to the max amount of digit in the e-Calculator.
    while ( int.length + dec.length > SETTINGS.SCREEN_LENGTH) {
        lastDecimalRemoved = dec[dec.length - 1];
        dec = dec.substring(0, dec.length - 1);
    }

    // Round last decimal digit.
    if (parseInt(lastDecimalRemoved) > 4) {
        const lastDecimal = (parseInt(dec[dec.length - 1]) + 1).toString();
        dec = dec.substring(0, dec.length - 1);
        dec = dec + lastDecimal;
    }

    return `${int}.${dec}`;
};

export let removeSpareZeros = (value) => {
    let int = value.split('.')[0];
    let dec = value.split('.')[1];

    // Remove 0s on the left of integer part.
    while (int[0] === '0' && int.length > 1) {
        int = int.substring(1);
    }

    // Avoid logic in case of integer.
    if (!value.includes('.')){
        return int;
    }

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
