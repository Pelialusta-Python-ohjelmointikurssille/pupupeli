import js

class Pelaaja:
    def __init__(self, name="pupu"):
        self.__name = name
        self.__directions =  ["oikea", "vasen", "ylös", "alas"]

    def liiku(self, direction: str):
        if direction in self.__directions:
            print("oikea suunta")
            js.runCommand("move", direction)
        else:
            raise ValueError("Virheellinen suunta")

pupu = Pelaaja()
