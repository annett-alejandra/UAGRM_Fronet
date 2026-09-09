import sys

settings_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\config\settings.py"
with open(settings_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_installed_apps = False
for line in lines:
    new_lines.append(line)
    if line.startswith('INSTALLED_APPS = ['):
        in_installed_apps = True
        new_lines.append("    'apps.ocr_core.apps.OcrCoreConfig',\n")

with open(settings_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Updated settings.py")
