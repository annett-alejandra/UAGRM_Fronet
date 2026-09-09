import sys

schema_content = """
import graphene
from .connectors import InformixCajaConnector
from .orchestrator import buscar_historial_academico_unificado

class ResultadoCajaType(graphene.ObjectType):
    valido = graphene.Boolean()
    monto = graphene.Float()
    concepto = graphene.String()
    motivo = graphene.String()

class HistorialAcademicoType(graphene.ObjectType):
    origen = graphene.String()
    estado_tramite = graphene.String()
    numero_titulo = graphene.String()
    fecha_emision = graphene.String()
    nombre_graduado = graphene.String()

class IniciarTramite(graphene.Mutation):
    class Arguments:
        ci = graphene.String(required=True)
        nro_recibo = graphene.String(required=True)

    exito = graphene.Boolean()
    mensaje = graphene.String()
    ruta_sugerida = graphene.String()

    @classmethod
    def mutate(cls, root, info, ci, nro_recibo):
        # 1. Validar Caja
        resultado_caja = InformixCajaConnector.validar_recibo(nro_recibo)
        if not resultado_caja["valido"]:
            return IniciarTramite(exito=False, mensaje=resultado_caja["motivo"], ruta_sugerida="")

        # 2. Consultar ANZIO
        resultados_anzio = buscar_historial_academico_unificado(ci)
        es_post_2023 = any(r["origen"] == "ANZIO" for r in resultados_anzio)
        
        if es_post_2023:
            return IniciarTramite(exito=True, mensaje="Trámite Post-2023 iniciado.", ruta_sugerida="tramite_directo")
        else:
            return IniciarTramite(exito=True, mensaje="Requiere reconstrucción Pre-2023.", ruta_sugerida="archivo_central")

class Query(graphene.ObjectType):
    validar_recibo_caja = graphene.Field(ResultadoCajaType, nro_recibo=graphene.String(required=True))
    buscar_estudiante_unificado = graphene.List(HistorialAcademicoType, ci=graphene.String(required=True))

    def resolve_validar_recibo_caja(self, info, nro_recibo):
        res = InformixCajaConnector.validar_recibo(nro_recibo)
        return ResultadoCajaType(**res)

    def resolve_buscar_estudiante_unificado(self, info, ci):
        resultados = buscar_historial_academico_unificado(ci)
        return [HistorialAcademicoType(**r) for r in resultados]

class Mutation(graphene.ObjectType):
    iniciar_tramite = IniciarTramite.Field()
"""

with open(r"C:\Users\MSI\OneDrive\Titulo_Supletorio\apps\titulos_tramites\schema.py", "w", encoding="utf-8") as f:
    f.write(schema_content)
print("schema.py de titulos_tramites creado.")

config_schema_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\config\schema.py"
with open(config_schema_path, "r", encoding="utf-8") as f:
    config_content = f.read()

if "import apps.titulos_tramites.schema" not in config_content:
    config_content = config_content.replace(
        "import apps.libros_matrices.schema",
        "import apps.libros_matrices.schema\nimport apps.titulos_tramites.schema"
    )
    config_content = config_content.replace(
        "class Query(apps.libros_matrices.schema.Query",
        "class Query(apps.titulos_tramites.schema.Query, apps.libros_matrices.schema.Query"
    )
    config_content = config_content.replace(
        "class Mutation(apps.libros_matrices.schema.Mutation",
        "class Mutation(apps.titulos_tramites.schema.Mutation, apps.libros_matrices.schema.Mutation"
    )
    with open(config_schema_path, "w", encoding="utf-8") as f:
        f.write(config_content)
    print("config/schema.py actualizado con titulos_tramites.")
