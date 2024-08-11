from error_handler import ErrorHandler
from python_tracer import PythonTracer
from player import Pelaaja
import sys
import signal
import runpy

errorHandler = ErrorHandler()
tracer = PythonTracer()
tracer.start_tracer()

pelaaja = Pelaaja()

USER_SCRIPT_NAME = "userscript"

def interrupt_handler(sig, frame):
    print("INTERRUPT EXECUTION")
    sys.exit(0)

signal.signal(signal.SIGINT, interrupt_handler)

try:
    runpy.run_module(mod_name=USER_SCRIPT_NAME, init_globals={"pupu": pelaaja})
except Exception as e:
    errorHandler.pass_error_info(e)