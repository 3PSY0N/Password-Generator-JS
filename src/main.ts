import './style.css'

const generatedPassword         = document.querySelector<HTMLParagraphElement>('#generatedPassword')!;
const charLength                = document.querySelector<HTMLInputElement>('#charLength')!;
const charLengthRange           = document.querySelector<HTMLInputElement>('#charLengthRange')!;
const includeCharsUppercase     = document.querySelector<HTMLInputElement>('#includeCharsUppercase')!;
const includeCharsLowercase     = document.querySelector<HTMLInputElement>('#includeCharsLowercase')!;
const includeCharsNumbers       = document.querySelector<HTMLInputElement>('#includeCharsNumbers')!;
const includeCharsSymbols       = document.querySelector<HTMLInputElement>('#includeCharsSymbols')!;
const includePassphrase         = document.querySelector<HTMLInputElement>('#includePassphrase')!;
const generateButton            = document.querySelector<HTMLButtonElement>('#generateButton')!;
const copyButton                = document.querySelector<SVGElement>('#copyButton')!;
const copiedSuccess             = document.querySelector<HTMLParagraphElement>('#copiedSuccess')!;
const passwordStrength          = document.querySelector<HTMLParagraphElement>('#passwordStrength')!;
const passwordStrengthContainer = document.querySelector<HTMLParagraphElement>('#passwordStrengthContainer')!;
const checkboxes                = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')!;

let charLengthValue: number
let possibleChar: number

/* Generate password when range slider is moved */
charLengthRange.addEventListener('input', (event: Event) => {
    charLength.innerText = (event.target as HTMLInputElement).value
    charLengthValue = parseInt((event.target as HTMLInputElement).value)
    generatePassword(Number.parseInt(charLengthRange.value))
})

/* Generate password when checkbox is checked */
const checkBoxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')!

Array.from(checkBoxes).forEach((checkBoxes) => {
    checkBoxes.addEventListener('change', () =>
        generatePassword(Number.parseInt(charLengthRange.value))
    )
})

/* Generate password with generate button */
generateButton.addEventListener('click', () => generatePassword(Number.parseInt(charLengthRange.value)))

/* Copy to clipboard button */
copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(generatedPassword.innerText)

    copiedSuccess.classList.remove('opacity-0')
    setTimeout(() => copiedSuccess.classList.add('opacity-0'), 1500)
})

/**
 * Generate random password when loading the page and edit charLength indicator
 */
charLength.innerText = charLengthRange.value
generatePassword(Number.parseInt(charLengthRange.value))

/**
 * Generate password according to the number of characters indicated by the cursor
 * and according to the checked boxes
 */

function generatePassword(length: number)
{
    let possibleCharacters: Array<string | any> = []

    /** Letters in uppercase */
    if (includeCharsUppercase.checked) {
        possibleCharacters.push(...generateCharacterFromAsciiRange(65, 90))
    }

    /** Letters in lowercase */
    if (includeCharsLowercase.checked) {
        possibleCharacters.push(...generateCharacterFromAsciiRange(97, 122))
    }

    /** Numbers */
    if (includeCharsNumbers.checked) {
        possibleCharacters.push(...generateCharacterFromAsciiRange(48, 57))
    }

    /** Special chars */
    if (includeCharsSymbols.checked) {
        possibleCharacters.push(...generateCharacterFromAsciiRange(33, 47))
        possibleCharacters.push(...generateCharacterFromAsciiRange(58, 64))
        possibleCharacters.push(...generateCharacterFromAsciiRange(91, 96))
        possibleCharacters.push(...generateCharacterFromAsciiRange(123, 126))
    }

    possibleChar = possibleCharacters.length;
    /** Shuffle array for more randomness */
    possibleCharacters = shuffleArray(possibleCharacters)

    let randomPassword = ""
    Array(length).fill(true).forEach(() => {
        const pickedChar = possibleCharacters.at(generateRandomIntegerInRange(0, possibleCharacters.length - 1)) ?? "*"
        randomPassword += pickedChar
    })

    generatedPassword.innerText = randomPassword

    updatePasswordStrength()

    if (includePassphrase.checked) {
        generateAndDisplayPassphrase(length);
    }

    /* hide or show Stengh bar depending Passphrase checkbox state */
    if(includePassphrase.checked) {
        passwordStrength.classList.add('opacity-0')
    } else {
        passwordStrength.classList.add('opacity-100')
    }
}

async function generateAndDisplayPassphrase(length: number) {
    const randomPassphrase = await generateRandomPassphrase(length);
    generatedPassword.innerText = randomPassphrase;
    updatePasswordStrength();
}

/**
 * Deselect all other checkbox if Passphrase is checked
 */
includePassphrase.addEventListener('change', () => {
    toggleOtherCheckboxes();
    generatePassword(Number.parseInt(charLengthRange.value));
});

/**
 *  Deselect Passphrase checkbox if any other checkbox is checked
 */
function toggleOtherCheckboxes() {
    checkboxes.forEach((checkbox) => {
        if (checkbox !== includePassphrase) {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                includePassphrase.checked = false;
                }
            });
        }

        /**
        * Add event to check if passphrase is checked, and hide password stength indicator depending state
        */
        checkbox.addEventListener('change', () => {
            hideNshowPasswordStrengh()
        });
    });

    /**
     * Enable or disable other checkboxes based on includePassphrase state
     */
    checkboxes.forEach((checkbox) => {
      if (checkbox !== includePassphrase) {
        checkbox.checked = false;
      }
    });
}


/**
 * password stength indicator function
 */
function hideNshowPasswordStrengh() {
    if(includePassphrase.checked) {
        passwordStrengthContainer.classList.add('hidden')
        passwordStrengthContainer.classList.remove('flex')
    } else {
        passwordStrengthContainer.classList.remove('hidden')
        passwordStrengthContainer.classList.add('flex')
    }
}

/**
 * Generate random passphrase from worldlist
 */
async function generateRandomPassphrase(length: number): Promise<string> {
    return fetch('./wordlist.txt')
        .then(response => response.text())
        .then(wordlist => {
            const words = wordlist.trim().split('\n');
            let randomPassphrase = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * words.length);
                const randomWord = words[randomIndex].trim();
                randomPassphrase += randomWord + ' ';
            }
            return randomPassphrase.trim();
        });
}

/**
 * Generate chars from ascii table according to the range
 */
function generateCharacterFromAsciiRange(startRange: number, endRange: number): Array<string> {

    const characters: Array<string> = []
    let index = startRange

    while (index <= endRange) {
        characters.push(String.fromCharCode(index))
        index++
    }

    return characters
}

/**
 * Shuffling the array
 */
function shuffleArray(array: Array<string>): Array<string> {
    const newArr = array.slice()
    for (let i = newArr.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr
}

/**
 * Generate random number from minimum value and inclusive maximum value
 */
function generateRandomIntegerInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Compute the strength of the password
 */
function computePasswordStrength(): number {
    const equivalentSizeKey: number = charLengthValue*Math.log(possibleChar)/Math.log(2);

    if (equivalentSizeKey > 320)
        return 10;
    if (equivalentSizeKey > 288)
        return 9;
    if (equivalentSizeKey > 256)
        return 8;
    if (equivalentSizeKey > 224)
        return 7;
    if (equivalentSizeKey > 192)
        return 6;
    if (equivalentSizeKey > 160)
        return 5;
    if (equivalentSizeKey > 128)
        return 4;
    if (equivalentSizeKey > 96)
        return 3;
    if (equivalentSizeKey > 64)
        return 2;

    return 1;
}

/**
 * Change Span color based on password strength
 */
function updatePasswordStrength(): void {
    const passwordStrengthValue: number = computePasswordStrength();

    for (let i = 0; i < 10; i++) {
        passwordStrength.children[i].classList.remove('bg-red-500', 'bg-yellow-500', 'bg-green-500');
    }

    if (passwordStrengthValue >= 1 && passwordStrengthValue <= 2) {
        for (let i = 0; i < passwordStrengthValue; i++) {
            passwordStrength.children[i].classList.add('bg-red-500');
        }
    } else if (passwordStrengthValue >= 3 && passwordStrengthValue <= 5) {
        for (let i = 0; i < passwordStrengthValue; i++) {
            passwordStrength.children[i].classList.add('bg-yellow-500');
        }
    } else if (passwordStrengthValue >= 6 && passwordStrengthValue <= 10) {
        for (let i = 0; i < passwordStrengthValue; i++) {
            passwordStrength.children[i].classList.add('bg-green-500');
        }
    }
}
