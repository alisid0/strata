"""
Quick CLI for chatting with DeepSeek using the Strata briefing context.
Usage: python3 deepseek-cli.py "your prompt here"
       python3 deepseek-cli.py --model=pro "your prompt here"   (pro = reasoning model)
"""
import sys
import io
import importlib.util

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

spec = importlib.util.spec_from_file_location("deepseek_helper", __file__.replace("deepseek-cli.py", "deepseek-helper.py"))
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

args = sys.argv[1:]
model = "flash"
if args and args[0].startswith("--model="):
    model = args[0].split("=", 1)[1]
    args = args[1:]

if not args:
    print("Usage: python3 deepseek-cli.py [--model=flash|pro] \"your prompt here\"")
    sys.exit(1)

prompt = " ".join(args)
result = mod.call_deepseek(prompt, model=model, verbose=True)
print(result)
