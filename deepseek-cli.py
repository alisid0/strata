"""
Quick CLI for chatting with DeepSeek using the Strata briefing context.
Usage: python3 deepseek-cli.py "your prompt here"
"""
import sys
import io
import importlib.util

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

spec = importlib.util.spec_from_file_location("deepseek_helper", __file__.replace("deepseek-cli.py", "deepseek-helper.py"))
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

if len(sys.argv) < 2:
    print("Usage: python3 deepseek-cli.py \"your prompt here\"")
    sys.exit(1)

prompt = " ".join(sys.argv[1:])
result = mod.call_deepseek(prompt)
print(result)
