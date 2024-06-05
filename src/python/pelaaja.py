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

class Pelaaja:
    def __init__(self, name="pupu"):
        self.__name = name
        self.__directions =  ["oikea", "vasen", "ylös", "alas"]

    def liiku(self, direction: str):
        if reset_flag:
            raise Exception("Interpreter was reset")
        if direction in self.__directions:
            js.runCommand("move", direction)
        else:
            raise ValueError("Virheellinen suunta")

pupu = Pelaaja()
