import js

class Pelaaja:
    def __init__(self, name="pupu"):
        self.name = name
        self.directions = {"oikea", "vasen", "ylös", "alas"}

    def liiku(self, direction: str):
        if direction in self.directions:
            js.runCommand("move", direction)

pupu = Pelaaja()

directions = pupu.directions

