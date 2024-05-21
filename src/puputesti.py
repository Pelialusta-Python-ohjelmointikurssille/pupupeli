import sys
sys.version

class PupuTesti:
    def __init__(self):
        self.tervehdys = "Tervehdys!\n"

    def sano(self, string):
        print("Pupu sanoo: " + string)

pupu = PupuTesti()