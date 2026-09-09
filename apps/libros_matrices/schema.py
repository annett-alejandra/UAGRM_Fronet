import graphene
from graphene_django.types import DjangoObjectType
from graphene.types.generic import GenericScalar
from apps.libros_matrices.models import PaginaLibroEscaneada, FilaRegistroHistorico, EstadoPagina
from apps.libros_matrices.services import validar_y_consolidar_pagina

class PaginaLibroEscaneadaType(DjangoObjectType):
    class Meta:
        model = PaginaLibroEscaneada
        fields = "__all__"

class FilaRegistroHistoricoType(DjangoObjectType):
    class Meta:
        model = FilaRegistroHistorico
        fields = "__all__"

class ConsolidarPaginaTabular(graphene.Mutation):
    class Arguments:
        pagina_id = graphene.UUID(required=True)
        # filas_corregidas recibe la lista de objetos de cada fila
        filas_corregidas = GenericScalar(required=True)

    pagina = graphene.Field(PaginaLibroEscaneadaType)

    @classmethod
    def mutate(cls, root, info, pagina_id, filas_corregidas):
        user = info.context.user
        usuario_id = user.id if user and user.is_authenticated else None
        
        pagina = validar_y_consolidar_pagina(
            pagina_id=pagina_id,
            filas_corregidas=filas_corregidas,
            usuario_auditor_id=usuario_id
        )
        return ConsolidarPaginaTabular(pagina=pagina)

class Query(graphene.ObjectType):
    paginas_pendientes_libros = graphene.List(PaginaLibroEscaneadaType)

    def resolve_paginas_pendientes_libros(self, info):
        return PaginaLibroEscaneada.objects.filter(estado=EstadoPagina.PENDIENTE_CONTROL_CALIDAD)

class Mutation(graphene.ObjectType):
    consolidar_pagina_tabular = ConsolidarPaginaTabular.Field()
