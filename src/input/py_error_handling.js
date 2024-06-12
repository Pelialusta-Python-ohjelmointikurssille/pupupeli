/**
 * 
 * @param {*} errorMessage 
 * @returns returns the error message in a readable form to a beginner programmer.
 */
export function extractErrorDetails(errorMessage) {
    const regex = /File .*?, line (\d+)/g;
    let match;
    let lastLineReference;

    const lines = errorMessage.split('\n');
    const errorTypeMatch = lines[lines.length - 2].trim();

    while ((match = regex.exec(errorMessage)) !== null) {
        lastLineReference = match[1];
    }

    const lineNumberMatch = lastLineReference || "Tuntematon rivi";
    const translatedErrorType = translateErrorType(errorTypeMatch);

    if (translatedErrorType) {
        return { text: translatedErrorType, line: lineNumberMatch };
    } else {
        return { text: errorMessage, line: "Tuntematon rivi" };
    }
}

/**
 * Returns Finnish translation explaining the type of error (SyntaxError -> kirjoitusvirhe)
 * @param {string} errorType 
 * @returns {string}
 */
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

    if (errorType.startsWith("IndentationError:")) {
        return "Tarkista, että jätät rivin alkuun tyhjää tilaa";
    }

    if (errorType.startsWith("TypeError:")) {
        return "Tarkista, että käyttämäsi arvot ovat oikeaa tyyppiä";
    }

    if (errorType.startsWith("AttributeError:")) {
        return "Hahmollasi ei ole ominaisuutta, jota yrität käyttää";
    }

    return translations[errorType] || errorType;
}
