import js
import ast
from sys import settrace
from time import sleep
import ast

def tracer(frame, event, arg):
    # DIRTY HACK, otherwise raises error in pyodide about js not being defined
    userCodeLength = -1
    try:
        userCodeLength = js.getSourceLineCount()
    except Exception as e:
        pass
    class_name = None
    code = frame.f_code
    func_name = code.co_qualname
    line_number = frame.f_lineno
    filename = code.co_filename
    try:
        class_name = frame.f_locals["self"].__class__.__name__
    except:
        pass
    #print(f"[e:{event} f:{filename}]: {func_name}(), line {line_number}, class: {class_name}, codelen: {userCodeLength}")
    if ("<exec>" in filename and frame.f_lineno-1 <= userCodeLength and frame.f_lineno-1 > 0):
        # DIRTY HACK, otherwise raises error in pyodide about js not being defined
        try:
            js.sendLine(frame.f_lineno-1)
            # Without sleep() the highlight wouldn't appear 
            # since it will be immediatly changed
            # Should be changed since this is really bad for performance
            # and just bad in general
            sleep(0.05)
            pass
        except Exception as e:
            pass
        #print(f"ASSUMED LINE: {frame.f_lineno-1}")
    # DIRTY HACK, otherwise raises error in pyodide about tracer not being defined
    try:
        return tracer
    except Exception as e:
        pass

settrace(tracer)

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
