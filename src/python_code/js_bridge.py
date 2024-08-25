import js

class JSBridge:
    def __init__(self) -> None:
        pass

    def run_command(self, command, parameter):
        js.runCommand(command, parameter)

    def create_object(self, object_type, x, y):
        js.createObject(object_type, x, y)

    def destroy_object(self, x, y):
        js.destroyObject(x, y)

    def get_object_count(self, object_type):
        return js.getObjectCount(object_type)

    def send_line_info(self, line_number):
        js.processLine(line_number)

    def send_error_info(self, line_number, error_message, error_type, traceback):
        js.processErrorInfo(line_number, error_message, error_type, traceback)

    def finished_execution(self, used_while_loop, used_for_loop):
        js.onFinishedExecution(used_while_loop, used_for_loop)
    
    def system_exit(self):
        js.resetFromPython()

    def get_source_code(self):
        return js.getSourceCode()
