import sys
import js
#sys.version

liikelista = []

def input_with_js(prompt):
    js.handleInput(prompt)

def continue_execution():
    global user_input
    return user_input

# Replace Python's input function with the custom one
input = input_with_js
    

class Pelaaja:
    def __init__(self, nimi="pupu"):
        self.nimi = nimi
        self.liikkeet = {"oikea", "vasen", "ylös", "alas"}
        # self.liikelista = []
        self.alusta_liikelista()


    def alusta_liikelista(self):
        global liikelista
        liikelista = []

    def liiku(self, liike: str):
        global liikelista
        if liike in self.liikkeet:
            liikelista.append(liike)

pupu = Pelaaja()

liikkeet = pupu.liikkeet