import js
import ast


def check_while_usage(source_code):
    tree = ast.parse(source_code)

    for node in ast.walk(tree):
        if isinstance(node, ast.While):
            return True

    return False


def check_for_usage(source_code):
    tree = ast.parse(source_code)

    for node in ast.walk(tree):
        if isinstance(node, ast.For):
            return True

    return False


def mock_input(prompt=""):
    return 0


class Pelaaja:
    def __init__(self, name="pupu"):
        self.__name = name
        self.__directions = ["oikea", "vasen", "ylös", "alas"]

    def liiku(self, direction: str):
        if reset_flag:
            raise Exception("Interpreter was reset")
        if direction in self.__directions:
            js.runCommand("move", direction)
        else:
            raise ValueError("Virheellinen suunta")

    def sano(self, sentence: str):
        #        if reset_flag:
        #            raise Exception("Interpreter was reset")
        js.runCommand("say", sentence)

    def puhu(self, sentence: str):
        self.sano(sentence)

    def kysy(self, question: str = "?"):
        #        if reset_flag:
        #            raise Exception("Interpreter was reset")
        js.runCommand("ask", question)
        return input()

    def kysyMaara(self, variableName: str):
        #        if reset_flag:
        #            raise Exception("Interpreter was reset")
        if variableName == self.__name:
            self.sano("Minua voi olla vain yksi!")
            return 1
        count = int(js.getInt(variableName))  # returns -1 if not found
        if count < 0:
            self.sano("En tiedä minkä asian lukumäärää kysyit!")
            return 0
        self.sano("Ai " + variableName + "? Näen niitä " + str(count) + "!")
        return count

    def rivi(self, line: int):
        js.sendLine(line)


class ErrorCheck:
    def __init__(self, name="pupu"):
        self.__name = name
        self.__directions = ["oikea", "vasen", "ylös", "alas", 0]

    def liiku(self, direction: str):
        if direction in self.__directions:
            return
        else:
            raise ValueError("Virheellinen suunta")

    def sano(self, sentence: str):
        return

    def puhu(self, sentence: str):
        return

    def kysy(self, question: str = "?"):
        return

    def rivi(self, line: int):
        return


pupu = ErrorCheck()
