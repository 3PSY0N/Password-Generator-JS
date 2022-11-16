import './style.css'

const generatedPassword     = document.querySelector<HTMLParagraphElement>('#generatedPassword')!;
const charLength            = document.querySelector<HTMLInputElement>('#charLength')!;
const charLengthRange       = document.querySelector<HTMLInputElement>('#charLengthRange')!;
const includeCharsUppercase = document.querySelector<HTMLInputElement>('#includeCharsUppercase')!;
const includeCharsLowercase = document.querySelector<HTMLInputElement>('#includeCharsLowercase')!;
const includeCharsNumbers   = document.querySelector<HTMLInputElement>('#includeCharsNumbers')!;
const includeCharsSymbols   = document.querySelector<HTMLInputElement>('#includeCharsSymbols')!;
const generateButton        = document.querySelector<HTMLButtonElement>('#generateButton')!;
const copyButton            = document.querySelector<SVGElement>('#copyButton')!;
const copiedSuccess         = document.querySelector<HTMLParagraphElement>('#copiedSuccess')!;
const passwordStrength      = document.querySelector<HTMLParagraphElement>('#passwordStrength')!;

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
//nombreDeChar*log(nombreDeCharPossible)/log(2)
function computePasswordStrength(): number {
    const equivalentSizeKey: number = charLengthValue*Math.log(possibleChar)/Math.log(2);
    if(equivalentSizeKey > 100)
        return 4;
    if(equivalentSizeKey > 80)
        return 3;
    if(equivalentSizeKey > 64)
        return 2;
    return 1;

}

/**
 * Change Span color based on password strength
 */

function updatePasswordStrength(): void {
    const passwordStrengthValue: number = computePasswordStrength();
    for(let i = 0; i<4; i++)
    {
        passwordStrength.children[i].classList.remove('bg-tgreen')
    }
    for(let i = 0; i<passwordStrengthValue; i++)
    {
        passwordStrength.children[i].classList.add('bg-tgreen')
    }


}

