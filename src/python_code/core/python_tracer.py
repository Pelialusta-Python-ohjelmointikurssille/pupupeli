from sys import settrace, setprofile

class PythonTracer:
    def __init__(self) -> None:
        pass

    def trace(self, frame, event, args):
        code = frame.f_code
        func_name = code.co_name
        line_no = frame.f_lineno
        filename = code.co_filename
        if filename == "<exec>":
            print(f"A {event} encountered in {filename}.{func_name}() at line number {line_no} ") 
        return self.trace

    def set_as_trace(self):
        settrace(self.trace)
    
    def set_as_profile(self):
        setprofile(self.trace)
    
    def start_tracer(self):
        self.set_as_profile()
        self.set_as_trace()
