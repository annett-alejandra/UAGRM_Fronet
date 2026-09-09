import sys

req_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\requirements.txt"
with open(req_path, "r", encoding="latin-1") as f:
    req_content = f.read()

# Replace any problematic characters like "ó" that pip hates in utf-8
import unicodedata
clean_content = unicodedata.normalize("NFKD", req_content).encode("ascii", "ignore").decode("ascii")

with open(req_path, "w", encoding="utf-8") as f:
    f.write(clean_content)

print("requirements.txt limpiado a ASCII/UTF-8 puro.")
