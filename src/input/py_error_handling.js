export function extractErrorDetails(errorMessage) {
    const regex = /File .*?, line (\d+)/g;
    let match;
    let lastLineReference;
    // let lastToLastLineReference;
    let lineNumberMatch

    const lines = errorMessage.split('\n');
    const errorTypeMatch = lines[lines.length - 2];

    while ((match = regex.exec(errorMessage)) !== null) {
        // lastToLastLineReference = lastLineReference;
        lastLineReference = match[1];
    }

    if (errorTypeMatch === "ValueError: Virheellinen suunta") {
        // lineNumberMatch = lastToLastLineReference;
        lineNumberMatch = lastLineReference
    } else {
        lineNumberMatch = lastLineReference;
    }

    const translatedErrorType = translateErrorType(errorTypeMatch)

    if (translatedErrorType && lineNumberMatch) {
        return { text: translatedErrorType, line: lineNumberMatch };
    } else {
        return { text: errorMessage, line: "Tuntematon rivi" };
    }
}

function translateErrorType(errorType) {
    const translations = {
        "SyntaxError: invalid syntax": "Kirjoititko koodisi varmasti oikein?",
        "ValueError: Virheellinen suunta": "Antamasi suunta ei ole kirjoitettu oikein",
        "IndexError: list index out of range": "Yritit käyttää listan kohtaa, jota ei ole olemassa. Tarkista listan pituus ja yritä uudelleen!"

    };

    if (errorType.startsWith("NameError: name")) {
        return "Käytit nimeä, jota ei ole määritelty. Tarkista kirjoitusvirheet!";
    }
    
    if (errorType.startsWith("ModuleNotFoundError: No module named")) {
        return "Yritit käyttää moduulia, jota ei löydy. Tarkista moduulin nimi!";
    }

    return translations[errorType] || errorType;
}