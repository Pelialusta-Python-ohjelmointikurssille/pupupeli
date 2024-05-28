import js

class Pelaaja:
    def __init__(self, name="pupu"):
        self.__name = name
        self.__directions =  ["oikea", "vasen", "ylös", "alas"]

    def liiku(self, direction: str):
        if direction in self.__directions:
            js.runCommand("move", direction)

pupu = Pelaaja()
