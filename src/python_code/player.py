
class Pelaaja:
    def __init__(self, name="pupu"):
        #self.__name = name
        self.__directions = ["oikea", "vasen", "ylös", "alas"]

    def liiku(self, direction: str):
        pass

    def sano(self, sentence: str):
        pass

    def puhu(self, sentence: str):
        self.sano(sentence)

    def kysy(self, question: str = "?"):
        pass

    def laske(self, variableName: str):
        pass
    
    def luo(self, gridObjectType : str, x = -1, y = -1):
        pass
        
    def poista(self, x, y):
        pass
