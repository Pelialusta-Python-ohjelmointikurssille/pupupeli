import js

class JSBridge:
    def __init__(self) -> None:
        pass

    def run_command(self, command, parameter):
        pass

    def create_object(self, object_type, x, y):
        pass

    def destroy_object(self, x, y):
        pass

    def get_int(self, variable_name):
        pass

    def send_line_info(self, line_number):
        js.processLine(line_number)

    def send_error_info(self, line_number, error_message, error_type):
        pass
