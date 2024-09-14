from python_tracer import PythonTracer
from player import Pelaaja
from js_bridge import JSBridge
from condition_checker import ConditionChecker
from global_variable import GlobalVariable
import sys
import os
import signal
import runpy
import traceback

js_bridge = JSBridge()
checker = ConditionChecker(js_bridge)
tracer = PythonTracer(js_bridge, CODE_WAIT_TIME)
tracer.start_tracer()

pelaaja = Pelaaja(js_bridge)
testi = 0
kerattavat = GlobalVariable(1)

# def interrupt_handler(sig, frame):
# print("[Python|Pyodide]: Handling interrupt")
# js_bridge.system_exit()
# sys.exit(0)
# os._exit(0)
# raise SyntaxError("LOL")

# signal.signal(signal.SIGINT, interrupt_handler)

user_script_globals = {
    PLAYER_NAME: pelaaja,
    COLLECTIBLES_COUNT: kerattavat,
    TESTI : testi
}

try:
    runpy.run_module(mod_name=USER_SCRIPT_NAME,
                     init_globals=user_script_globals)
except KeyboardInterrupt as ki:
    js_bridge.system_exit()
except Exception as e:
    js_bridge.send_error_info(-1, str(e), str(type(e).__name__),
                              "".join(traceback.format_exception(e)))
finally:
    js_bridge.finished_execution(
        checker.check_while_usage(), checker.check_for_usage())
