from error_handler import ErrorHandler
from python_tracer import PythonTracer
from player import Pelaaja
from js_bridge import JSBridge
import sys
import signal
import runpy

CODE_WAIT_TIME = 0.05

js_bridge = JSBridge()
erro_handler = ErrorHandler(js_bridge)
tracer = PythonTracer(js_bridge, CODE_WAIT_TIME)
tracer.start_tracer()

pelaaja = Pelaaja(js_bridge)

USER_SCRIPT_NAME = "userscript"

def interrupt_handler(sig, frame):
    print("[Python|Pyodide]: Handling interrupt")
    js_bridge.system_exit()
    sys.exit(0)

signal.signal(signal.SIGINT, interrupt_handler)

user_script_globals = {
    "pupu": pelaaja
}

try:
    runpy.run_module(mod_name=USER_SCRIPT_NAME, init_globals=user_script_globals)
except Exception as e:
    erro_handler.pass_error_info(e)
finally:
    js_bridge.finished_execution()