import graphene
from graphene_django.types import DjangoObjectType
from graphene.types.generic import GenericScalar
from apps.ocr_core.models import DocumentoEscaneado, DocumentoEstado
from apps.ocr_core.services import validar_y_consolidar_documento, devolver_documento

class DocumentoEscaneadoType(DjangoObjectType):
    class Meta:
        model = DocumentoEscaneado
        fields = ("id", "object_key", "estado", "ocr_guesses", "fecha_subida")
    
    document_class = graphene.String()

    def resolve_document_class(self, info):
        return "DocumentoEscaneado"


class ValidarYConsolidarDocumento(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        datos_corregidos = GenericScalar(required=True)
        
    documento = graphene.Field(DocumentoEscaneadoType)
    url_pdf_informe = graphene.String()
    
    @classmethod
    def mutate(cls, root, info, id, datos_corregidos):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise Exception("No autenticado. Por favor inicie sesion.")
        # Verificacion de rol (idealmente verificando grupo Unidad_Auditoria)
        # if not user.groups.filter(name="Unidad_Auditoria").exists():
        #     raise Exception("No autorizado. Requiere rol Unidad_Auditoria.")

        usuario_id = user.id if user and user.is_authenticated else None
        
        doc, url_pdf = validar_y_consolidar_documento(
            documento_id=id,
            datos_validados=datos_corregidos,
            usuario_auditor_id=usuario_id
        )
        return ValidarYConsolidarDocumento(documento=doc, url_pdf_informe=url_pdf)

class DevolverPorDeficiencia(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        motivo = graphene.String(required=True)

    documento = graphene.Field(DocumentoEscaneadoType)
    url_pdf_informe = graphene.String()

    @classmethod
    def mutate(cls, root, info, id, motivo):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise Exception("No autenticado. Por favor inicie sesion.")
        # Verificacion de rol (idealmente verificando grupo Unidad_Auditoria)
        # if not user.groups.filter(name="Unidad_Auditoria").exists():
        #     raise Exception("No autorizado. Requiere rol Unidad_Auditoria.")

        usuario_id = user.id if user and user.is_authenticated else None
        
        doc = devolver_documento(
            documento_id=id,
            motivo=motivo,
            usuario_auditor_id=usuario_id
        )
        return DevolverPorDeficiencia(documento=doc)

class Query(graphene.ObjectType):
    documentos_pendientes = graphene.List(DocumentoEscaneadoType, modulo_origen=graphene.String())

    def resolve_documentos_pendientes(self, info, modulo_origen=None):
        qs = DocumentoEscaneado.objects.filter(estado=DocumentoEstado.PENDIENTE_CONTROL_CALIDAD)
        if modulo_origen:
            qs = qs.filter(object_key__startswith=f"{modulo_origen}/")
        return qs

class Mutation(graphene.ObjectType):
    validar_y_consolidar_documento = ValidarYConsolidarDocumento.Field()
    devolver_por_deficiencia = DevolverPorDeficiencia.Field()
