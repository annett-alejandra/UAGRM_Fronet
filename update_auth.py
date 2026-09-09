import sys

schema_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\apps\ocr_core\schema.py"
with open(schema_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '        # TODO: Autenticacion/Autorizacion via SSO Middleware\n        user = info.context.user',
    '        user = info.context.user\n        if not user or not user.is_authenticated:\n            raise Exception("No autenticado. Por favor inicie sesion.")\n        # Verificacion de rol (idealmente verificando grupo Unidad_Auditoria)\n        # if not user.groups.filter(name="Unidad_Auditoria").exists():\n        #     raise Exception("No autorizado. Requiere rol Unidad_Auditoria.")\n'
)

with open(schema_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Auth enforcement injected")
