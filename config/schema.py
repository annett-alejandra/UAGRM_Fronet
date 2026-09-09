import graphene
import apps.ocr_core.schema
import apps.libros_matrices.schema
import apps.titulos_tramites.schema

class Query(apps.titulos_tramites.schema.Query, apps.libros_matrices.schema.Query, apps.ocr_core.schema.Query, graphene.ObjectType):
    pass

class Mutation(apps.titulos_tramites.schema.Mutation, apps.libros_matrices.schema.Mutation, apps.ocr_core.schema.Mutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
