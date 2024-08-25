from time import sleep
from sys import settrace, setprofile
from js_bridge import JSBridge

class PythonTracer:
    def __init__(self, js_bridge: JSBridge, code_wait_time: int) -> None:
        self.js_bridge = js_bridge
        self.code_wait_time = code_wait_time
        self.current_line_number = -1

    def trace(self, frame, event, args):
        code = frame.f_code
        func_name = code.co_name
        line_no = frame.f_lineno
        filename = code.co_filename
        if event == "exception":
            print(f"[Python|Pyodide]: {event} - {filename}.{func_name}() at line {line_no} ")
        if filename == "/home/pyodide/userscript.py":
            print(f"[Python|Pyodide]: {event} - {filename}.{func_name}() at line {line_no} ")
            self.current_line_number = line_no
            self.js_bridge.send_line_info(line_no)
            sleep(self.code_wait_time)
        return self.trace

    def set_as_trace(self):
        settrace(self.trace)
    
    def set_as_profile(self):
        setprofile(self.trace)
    
    def start_tracer(self):
        self.set_as_profile()
        self.set_as_trace()
