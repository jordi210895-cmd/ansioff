import os, re
import sys

def get_all_files(root_dir):
    files = set()
    for dirpath, _, filenames in os.walk(root_dir):
        for f in filenames:
            files.add(os.path.join(dirpath, f))
    return files

files = get_all_files("src")

error_count = 0
for filepath in files:
    if not filepath.endswith((".ts", ".tsx")): continue
    with open(filepath, "r") as f:
        content = f.read()
    
    # Simple regex for imports: import ... from "./foo" or "@/components/foo"
    imports = re.findall(r"(?:import|export).*?from\s+[\"']([^\"']+)[\"']", content)
    
    for imp in imports:
        # Ignore external modules
        if not (imp.startswith(".") or imp.startswith("@/")):
            continue
            
        if imp.startswith("."): # Relative import
            target_dir = os.path.dirname(filepath)
            target_base = os.path.normpath(os.path.join(target_dir, imp))
        elif imp.startswith("@/"):
            target_base = os.path.normpath(os.path.join("src", imp[2:]))
            
        # Check if target_base exists with .ts, .tsx, .css etc in EXACT case
        found = False
        options = ["", ".ts", ".tsx", ".css", ".js", ".jsx", "/index.ts", "/index.tsx"]
        for ext in options:
            if (target_base + ext) in files:
                found = True
                break
        
        if not found:
            # Let us see if it matches case-insensitively
            lower_files = {f.lower(): f for f in files}
            matched_wrong_case = False
            for ext in options:
                target_lower = (target_base + ext).lower()
                if target_lower in lower_files:
                    print(f"CASE MISMATCH in {filepath}: imported '{imp}', actual file is {lower_files[target_lower]}")
                    error_count += 1
                    matched_wrong_case = True
                    break
            
            if not matched_wrong_case:
                print(f"NOT FOUND in {filepath}: imported '{imp}' (looked for {target_base})")
                error_count += 1

if error_count == 0:
    print("NO IMPORT ERRORS FOUND")
