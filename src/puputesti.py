import sys
#import time
#from bunny_module import moveBunny
sys.version

liikelista = []

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
        #time.sleep(1) # poista editor.js kommentti jos poistat nämä kommentit
        #moveBunny(liike) # poista editor.js kommentti jos poistat nämä kommentit
        global liikelista
        if liike in self.liikkeet:
            liikelista.append(liike)

pupu = Pelaaja()

liikkeet = pupu.liikkeet