import sys

settings_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\config\settings.py"
with open(settings_path, 'r', encoding='utf-8') as f:
    settings_content = f.read()

if "graphene_django" not in settings_content:
    settings_content = settings_content.replace(
        '"django_celery_results",',
        '"django_celery_results",\n    "graphene_django",'
    )
    settings_content += '\n\nGRAPHENE = {"SCHEMA": "config.schema.schema"}\n'
    with open(settings_path, 'w', encoding='utf-8') as f:
        f.write(settings_content)
    print("settings.py actualizado con graphene_django")

urls_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\config\urls.py"
with open(urls_path, 'r', encoding='utf-8') as f:
    urls_content = f.read()

if "GraphQLView" not in urls_content:
    urls_content = urls_content.replace(
        "from django.urls import include, path",
        "from django.urls import include, path\nfrom django.views.decorators.csrf import csrf_exempt\nfrom graphene_django.views import GraphQLView"
    )
    urls_content = urls_content.replace(
        "urlpatterns = [",
        "urlpatterns = [\n    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),"
    )
    with open(urls_path, 'w', encoding='utf-8') as f:
        f.write(urls_content)
    print("urls.py actualizado con /graphql/")
