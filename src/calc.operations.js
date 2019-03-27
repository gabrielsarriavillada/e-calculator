export let addition = (a, b) => {
    return resolveOnline(a, b, '+');
};

export let subtraction = (a, b) => {
    return resolveOnline(a, b, '-');
};

export let multiplication = (a, b) => {
    return resolveOnline(a, b, '*');
};

export let division = (a, b) => {
    return resolveOnline(a, b, '/');
};

// Resolve given operation using an external API.
let resolveOnline = (a, b, op) => {
    let request = new XMLHttpRequest();

    request.open('GET', `http://api.mathjs.org/v4/?expr=${a}${op}${b}`, false);
    request.send(null);

    return request.responseText;
};