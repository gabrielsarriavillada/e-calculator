// Generate an array of {prime, exp} of a given integer.
let breakDown = (int) => {
    let bdint = [];
    for (let i = 2; i <= int; i++) {
        let temp = int;
        let exp = 0;
        while (temp % i === 0) {
            temp /= i;
            exp++;
        }
        if (isPrime(i) && exp !== 0) bdint.push({prime: i, exp});
    }
    return bdint;
};

// Check if given integer is prime (true) or not (false).
let isPrime = (int) => {
    for (let i = 2; i < int; i++) {
        if (int % i === 0) return false;
    }
    return true;
};

// Calculate lcm from 2 numbers.
export const getLeastCommonMultiple = (a, b) => {
    let bdinta = breakDown(a);
    let bdintb = breakDown(b);
    let bdleastCommonMultiple = [];
    let leastCommonMultiple = 1;
    let primesa = bdinta.map(elem => elem.prime);
    let primesb = bdintb.map(elem => elem.prime);

    // Get an array with all the primes in number A and B.
    let allprimes;
    if (primesa.length > primesb.length) {
        allprimes = primesa;
        primesb.forEach(elem => {
            if (!allprimes.includes(elem)) allprimes.push(elem);
        });
    } else {
        allprimes = primesb;
        primesa.forEach(elem => {
            if (!allprimes.includes(elem)) allprimes.push(elem);
        });
    }

    // Get the higher exp for every prime in allprimes array.
    allprimes.forEach(elem => {
        let indexa = bdinta.findIndex(i => i.prime === elem);
        let indexb = bdintb.findIndex(i => i.prime === elem);
        const expa = indexa > -1 ? bdinta[indexa].exp : 0;
        const expb = indexb > -1 ? bdintb[indexb].exp : 0;
        const exp = expa > expb ? expa : expb;
        bdleastCommonMultiple.push({prime: elem, exp});
    });

    // Get an integer based on the broken down number.
    bdleastCommonMultiple.forEach(elem => {
        leastCommonMultiple *= elem.prime ** elem.exp;
    });
    return leastCommonMultiple;
};
