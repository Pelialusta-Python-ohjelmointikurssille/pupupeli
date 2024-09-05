from js_bridge import JSBridge

class Pelaaja:
    def __init__(self, js_bridge: JSBridge):
        self.__directions = ["oikea", "vasen", "ylös", "alas"]
        self.__js_bridge = js_bridge

    def liiku(self, direction: str) -> None:
        if (direction not in self.__directions):
            raise ValueError("Virheellinen suunta")
        self.__js_bridge.run_command("move", direction)

    def sano(self, sentence: str) -> None:
        self.__js_bridge.run_command("say", sentence)

    def puhu(self, sentence: str) -> None:
        self.sano(sentence)

    def kysy(self, question: str = "?") -> str:
        self.__js_bridge.run_command("ask", question)
        return input()

    def laske(self, objectType: str) -> int:
        result = self.__js_bridge.get_object_count(objectType)
        return int(result)
    
    def luo(self, objectType: str, x: int = -1, y: int = -1) -> None:
        self.__js_bridge.create_object(objectType, x, y)
        
    def poista(self, x: int = -1, y: int = -1) -> None:
        self.__js_bridge.destroy_object(x, y)
