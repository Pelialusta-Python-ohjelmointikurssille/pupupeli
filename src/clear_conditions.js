import { onTaskComplete } from "./ui/ui";

export function checkIfGameWon() {
    if (globals.getMultipleChoiceCorrect()) {
        onTaskComplete();
        gameController.notifyGameWon(true);
    } else {
        gameController.notifyGameWon(false);
    }
}