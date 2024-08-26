import ast
from js_bridge import JSBridge

class ConditionChecker:
    def __init__(self, js_bridge: JSBridge) -> None:
        self.js_bridge = js_bridge

    def check_while_usage(self) -> bool:
        tree = ast.parse(self.js_bridge.get_source_code())

        for node in ast.walk(tree):
            if isinstance(node, ast.While):
                return True

        return False

    def check_for_usage(self) -> bool:
        tree = ast.parse(self.js_bridge.get_source_code())

        for node in ast.walk(tree):
            if isinstance(node, ast.For):
                return True

        return False
