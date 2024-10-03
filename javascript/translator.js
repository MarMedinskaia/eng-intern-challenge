const brailleAlphabet = {
    'a': 'O.....', 'b': 'O.O...', 'c': 'OO....', 'd': 'OO.O..', 'e': 'O..O..',
    'f': 'OOO...', 'g': 'OOOO..', 'h': 'O.OO..', 'i': '.OO...', 'j': '.OOO..',
    'k': 'O...O.', 'l': 'O.O.O.', 'm': 'OO..O.', 'n': 'OO.OO.', 'o': 'O..OO.',
    'p': 'OOO.O.', 'q': 'OOOOO.', 'r': 'O.OOO.', 's': '.OO.O.', 't': '.OOOO.',
    'u': 'O...OO', 'v': 'O.O.OO', 'w': '.OOO.O', 'x': 'OO..OO', 'y': 'OO.OOO', 'z': 'O..OOO',
    '.': '..OO.O', ',': '..O...', '?': '..O.OO', '!': '..OOO.', ':': '..OO..',
    ';': '..O.O.', '-': '....OO', '/': '.O..O.', '<': '.OO..O', '>': 'O..OO.',
    '(': 'O.O..O', ')': '.O.OO.', ' ': '......', 'capital': '.....O', 'decimal': '.O...O', 'number': '.O.OOO'
};

function getNumber(i, input) {
    const revBrailleAlphabet = Object.fromEntries(Object.entries(brailleAlphabet).map(([key, value]) => [value, key]));
    let number = "";
    while (i < input.length) {
        let char = input.slice(i, i + 6);
        i += 6;
        if (revBrailleAlphabet[char] != ' ') {
            if (revBrailleAlphabet[char] != '.') {
                number += Object.keys(revBrailleAlphabet).indexOf(char) + 1;
            } else {
                number += revBrailleAlphabet[char];
            }
        } else {
            number += revBrailleAlphabet[char];
            break;
        }
    }

    return [i, number];
}

function numberToBraille(i, input) {
    const brailleNumbers = {
        '1': 'O.....', '2': 'O.O...', '3': 'OO....', '4': 'OO.O..', '5': 'O..O..',
        '6': 'OOO...', '7': 'OOOO..', '8': 'O.OO..', '9': '.OO...', '0': '.OOO..'
    };
    let result = "";
    let num = "";
    let decimal = false;
    while (i < input.length && input.charAt(i) != ' ') {
        if (input.charAt(i) === '.')
            decimal = true;
        num += input.charAt(i);
        i++;
    }
    if (!decimal)
        result += brailleAlphabet['number'];
    else
        result += brailleAlphabet['decimal'];
    for (let j = 0; j < num.length; j++) {
        if (num[j] === '.')
            result += brailleAlphabet['.'];
        else 
            result += brailleNumbers[num[j]];
    }

    return [i, result];
}

function brailleToEnglish(input) {
    let result = "";
    const revBrailleAlphabet = Object.fromEntries(Object.entries(brailleAlphabet).map(([key, value]) => [value, key]));

    let i = 0;
    while (i < input.length) {
        let char = input.slice(i, i + 6);
        i += 6;
        if (revBrailleAlphabet[char] === 'capital') {
            char = input.slice(i, i + 6);
            i += 6;
            result += revBrailleAlphabet[char].toUpperCase();
        } else if (revBrailleAlphabet[char] === 'decimal' || revBrailleAlphabet[char] === 'number') {
            const [newI, number] = getNumber(i, input);
            result += number;
            i = newI;
        } else {
            result += revBrailleAlphabet[char] || '[unsupported character]';
        }
    }
    return result;
}

function englishToBraille(input) {
    let i = 0;
    let result = "";
    while (i < input.length) {
        if (input.charAt(i) >= 'A' && input.charAt(i) <= 'Z') {
            result += brailleAlphabet['capital'];
            result += brailleAlphabet[input.charAt(i).toLowerCase()];
            i++;
        } else if (input.charAt(i) >= '0' && input.charAt(i) <= '9') {
            const [newI, number] = numberToBraille(i, input);
            result += number;
            i = newI;
        } else {
            result += brailleAlphabet[input.charAt(i)] || '[unsupported character]';
            i++;
        }
    }
    return result;
}

function translate(input) {
    const isBraille = input.split('').every(char => char === 'O' || char === '.');
    return isBraille ? brailleToEnglish(input) : englishToBraille(input);
}

const input = process.argv.slice(2).join(' ');
if (input) {
    console.log(translate(input));
} else {
    console.error("No input");
}