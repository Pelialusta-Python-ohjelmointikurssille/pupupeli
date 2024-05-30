export function extractErrorDetails(errorMessage) {
    const regex = /File .*?, line (\d+)/g;
    let match;
    let lastLineReference;
    let lastToLastLineReference;
    let lineNumberMatch

    const lines = errorMessage.split('\n');
    const errorTypeMatch = lines[lines.length - 2];

    while ((match = regex.exec(errorMessage)) !== null) {
        lastToLastLineReference = lastLineReference;
        lastLineReference = match[1];
    }

    if (errorTypeMatch === "ValueError: Virheellinen suunta") {
        lineNumberMatch = lastToLastLineReference;
    } else {
        lineNumberMatch = lastLineReference;
    }

    if (errorTypeMatch && lineNumberMatch) {
        return { text: errorTypeMatch, line: lineNumberMatch };
    } else {
        return { text: errorMessage, line: "Unknown Line" };
    }
}