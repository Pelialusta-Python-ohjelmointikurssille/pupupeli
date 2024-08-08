from error_handler import ErrorHandler
from python_tracer import PythonTracer
import sys
import signal

e = ErrorHandler()
t = PythonTracer()
t.start_tracer()

USER_SCRIPT_NAME = "userscript"

def interrupt_handler(sig, frame):
    print("INTERRUPT EXECUTION")
    sys.exit(0)

signal.signal(signal.SIGINT, interrupt_handler)

try:
    __import__(USER_SCRIPT_NAME)
except Exception as e:
    e.pass_error_info(e)