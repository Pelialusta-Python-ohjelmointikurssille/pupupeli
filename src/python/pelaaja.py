import js
import ast

def check_while_usage(source_code):
    tree = ast.parse(source_code)

    for node in ast.walk(tree):
        if isinstance(node, ast.While):
            return True

    return False

class Pelaaja:
    def __init__(self, name="pupu"):
        self.__name = name
        self.__directions =  ["oikea", "vasen", "ylös", "alas"]

    def liiku(self, direction: str):
        print(reset_flag)
        if reset_flag:
            js.asd = "stop"
            print("execution stopped due to reset")
            return False
        if direction in self.__directions:
            js.runCommand("move", direction)
        else:
            raise ValueError("Virheellinen suunta")

pupu = Pelaaja()
