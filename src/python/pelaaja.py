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
        # DO NOT COMMENT OUT
        # Prevents movement not stopping when resetting
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

    def laske(self, variableName: str):
        #        if reset_flag:
        #            raise Exception("Interpreter was reset")
        if variableName == self.__name:
            return 1
        count = int(js.getInt(variableName))  # returns -1 if not found
        if count <= -1:
            self.sano("En tiedä minkä asian lukumäärää laskea!")
            return 0
        return count
    
    def luo(self, gridObjectType : str, x = -1, y = -1):
        if gridObjectType == self.__name:
            pupu.sano("Ei, voi olla vain yksi " + self.__name + "!")
            return
        js.createObject(gridObjectType, x, y)
        
    def poista(self, x, y):
        js.removeObject(x, y)
        return
    
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


