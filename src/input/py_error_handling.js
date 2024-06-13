export function extractErrorDetails(errorMessage) {
    const regex = /File .*?, line (\d+)/g;
    let match;
    let lastLineReference;
    let lastToLastLineReference;
    let lineNumberMatch;

    const lines = errorMessage.split('\n');
    const errorTypeMatch = lines[lines.length - 2].trim();

    while ((match = regex.exec(errorMessage)) !== null) {
        lastToLastLineReference = lastLineReference;
        lastLineReference = match[1];
    }

    const translatedErrorType = translateErrorType(errorTypeMatch);
    if ( currentLine !== null) {
        lineNumberMatch = getCurrentLine() || "Tuntematon rivi";
    } else {
        if (translatedErrorType === "Antamasi suunta ei ole kirjoitettu oikein") {
            lineNumberMatch = lastToLastLineReference || "Tuntematon rivi";
        } else {
            lineNumberMatch = lastLineReference || "Tuntematon rivi";
        }
    }

    if (translatedErrorType) {
        return { text: translatedErrorType, line: lineNumberMatch };
    } else {
        return { text: errorMessage, line: "Tuntematon rivi" };
    }
}

export function translateErrorType(errorType) {
    if (!errorType) {
        return errorType;
    }

    const translations = {
        "SyntaxError: invalid syntax": "Koodistasi löytyy kirjoitusvirhe",
        "ValueError: Virheellinen suunta": "Antamasi suunta ei ole kirjoitettu oikein",
        "IndexError: list index out of range": "Yritit käyttää listan kohtaa, jota ei ole olemassa. Tarkista listan pituus ja yritä uudelleen"
    };

    if (errorType.startsWith("NameError: name")) {
        return "Käytit nimeä, jota ei ole määritelty. Tarkista kirjoitusvirheet";
    }

    if (errorType.startsWith("ModuleNotFoundError: No module named")) {
        return "Yritit käyttää moduulia, jota ei löydy. Tarkista moduulin nimi";
    }

    if (errorType.startsWith("IndentationError: expected an indented block")) {
        return "Tarkista, että jätät rivin alkuun tyhjää tilaa";
    }

    if (errorType.startsWith("TypeError:")) {
        return "Tarkista, että käyttämäsi arvot ovat oikeaa tyyppiä";
    }

    return translations[errorType] || errorType;
}

let currentLine = null;

export function setCurrentLine(line) {
    currentLine = line;
}

function getCurrentLine() {
    return currentLine;
}
