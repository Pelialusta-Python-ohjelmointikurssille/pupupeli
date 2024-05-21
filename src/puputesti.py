import sys
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
        global liikelista
        if liike in self.liikkeet:
            liikelista.append(liike)

pupu = Pelaaja()

liikkeet = pupu.liikkeet