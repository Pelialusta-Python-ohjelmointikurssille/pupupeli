import js

class JSBridge:
    def run_command(self, command: str, parameter: str) -> None:
        js.runCommand(command, parameter)

    def create_object(self, object_type: str, x: int, y: int) -> None:
        js.createObject(object_type, x, y)

    def destroy_object(self, x: int, y: int) -> None:
        js.destroyObject(x, y)

    def get_object_count(self, object_type: str) -> int:
        return js.getObjectCount(object_type)

    def send_line_info(self, line_number: int) -> None:
        js.processLine(line_number)

    def send_error_info(self, line_number: int, error_message: str, error_type: str, full_message: str) -> None:
        js.processErrorInfo(line_number, error_message, error_type, full_message)

    def finished_execution(self, used_while_loop: bool, used_for_loop: bool) -> None:
        js.onFinishedExecution(used_while_loop, used_for_loop)
    
    def system_exit(self) -> None:
        js.resetFromPython()

    def get_source_code(self) -> str:
        return js.getSourceCode()
