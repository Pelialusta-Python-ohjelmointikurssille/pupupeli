from js_bridge import JSBridge

class Pelaaja:
    def __init__(self, js_bridge: JSBridge):
        self.__directions = ["oikea", "vasen", "ylös", "alas"]
        self.js_bridge = js_bridge

    def liiku(self, direction: str):
        if (direction not in self.__directions):
            raise ValueError("Virheellinen suunta")
        self.js_bridge.run_command("move", direction)

    def sano(self, sentence: str):
        self.js_bridge.run_command("say", sentence)

    def puhu(self, sentence: str):
        self.sano(sentence)

    def kysy(self, question: str = "?"):
        self.js_bridge.run_command("ask", question)
        return input()

    def laske(self, objectType: str):
        result = self.js_bridge.get_object_count(objectType)
        print(result)
        return int(result)
    
    def luo(self, gridObjectType : str, x = -1, y = -1):
        self.js_bridge.create_object(gridObjectType, x, y)
        
    def poista(self, x, y):
        self.js_bridge.destroy_object(x, y)
