import js

class JSBridge:
    def __init__(self) -> None:
        pass

    def run_command(self, command, parameter):
        print("RUNNING COMMAND FROM PYTHON")
        js.runCommand(command, parameter)

    def create_object(self, object_type, x, y):
        js.createObject(object_type, x, y)

    def destroy_object(self, x, y):
        js.destroyObject(x, y)

    def get_int(self, variable_name):
        js.getInt(variable_name)

    def send_line_info(self, line_number):
        js.processLine(line_number)

    def send_error_info(self, line_number, error_message, error_type):
        pass

    def finished_execution(self):
        js.onFinishedExecution()
    
    def system_exit(self):
        js.resetFromPython()
