from js_bridge import JSBridge

class ErrorHandler:
    def __init__(self, js_bridge: JSBridge) -> None:
        self.js_bridge = js_bridge

    def pass_error_info(self, error: Exception):
        print(error)