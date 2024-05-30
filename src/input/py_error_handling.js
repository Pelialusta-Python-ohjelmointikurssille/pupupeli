export function extractErrorDetails(errorMessage) {
    const regex = /File .*?, line (\d+)/g;
    let match;
    let lastLineReference;

    while ((match = regex.exec(errorMessage)) !== null) {
        lastLineReference = match[1];
    }
    const lineNumberMatch = lastLineReference;

    const lines = errorMessage.split('\n');
    const errorTypeMatch = lines[lines.length - 2];

    if (errorTypeMatch && lineNumberMatch) {
        return { text: errorTypeMatch, line: lineNumberMatch };
    } else {
        return { text: errorMessage, line: "Unknown Line" };
    }
}