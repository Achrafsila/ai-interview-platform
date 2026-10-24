#!/usr/bin/env python3
# The Python urllib client receives Cloudflare error 1010 on this Mac.
# Use the Node.js test harness, which uses the same network runtime as Next.js.
import subprocess
from pathlib import Path
raise SystemExit(subprocess.call(["node",str(Path(__file__).with_suffix(".cjs"))]))
