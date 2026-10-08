#!/usr/bin/env python3
"""Compatibility entry point: update v2.7+ market catalogue safely.
The old 77-only generator is retired."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('generate_market.py')),run_name='__main__')
