import json, subprocess, sys, tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
subprocess.run([sys.executable,str(ROOT/'aegis_harness.py'),'verify'],check=True)
b=json.loads((ROOT/'benchmark'/'runner.json').read_text())
assert len(b['cases'])==25
assert b['cases'][5]['test_id']=='AT-006' and 'under every admissible live model' in b['cases'][5]['scenario'].lower()
assert b['cases'][13]['test_id']=='AT-014' and 'Target policy for classification: P2' in b['cases'][13]['scenario']
with tempfile.TemporaryDirectory() as td:
    out=Path(td)/'run'
    subprocess.run([sys.executable,str(ROOT/'aegis_harness.py'),'run','--provider','mock','--conditions','ABC','--tests','AT-001,AT-006','--output',str(out)],check=True)
    rows=[json.loads(x) for x in (out/'raw.jsonl').read_text().splitlines()]
    assert len(rows)==6
    assert json.loads((out/'manifest.json').read_text())['scorer_key_loaded_during_generation'] is False
    subprocess.run([sys.executable,str(ROOT/'aegis_harness.py'),'score',str(out)],check=True)
    assert (out/'review.csv').exists() and (out/'summary.json').exists()
print('ALL TESTS PASSED')
