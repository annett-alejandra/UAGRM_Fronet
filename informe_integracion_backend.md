# Informe de Arquitectura de Negocio e Integración Backend/Frontend
## Estructura Jerárquica de Libros Matrices en Archivo Central

---

### 1. Resumen de la Estructura de Negocio Física
La organización real de Títulos y Expedientes en **Archivo Central** no es una lista plana. Sigue estrictamente la clasificación física de libros y legajos anuales:

```plaintext
📁 GESTIÓN (Año, ej: 2001)
   └── 📁 CARRERA (ej: Lic. en Ciencias Jurídicas)
        └── 📁 LIBRO / TOMO / LEGAJO (ej: Legajo #01)
             ├── 📄 Metadatos: Rango correlativo oficial (Del 03399 al 03010)
             └── 📋 Lista Indexada de Graduados:
                  ├── [Título #03399] MARIA S. ARISPE LLANOS
                  ├── [Título #03398] LILIANA I. NAVARRO PAZ
                  ├── [Título #03393] HERIBERTO ORELLANA VILLANUEVA
                  └── ...
```

---

### 2. Especificación de Modelos Backend (Django ORM / PostgreSQL)

Para que el backend refleje fielmente la estructura física, se definen los siguientes modelos jerárquicos:

```python
from django.db import models

class GestionArchivo(models.Model):
    gestion_year = models.IntegerField(unique=True, help_text="Año de gestión, ej. 2001")
    descripcion = models.CharField(max_length=100, blank=True)
    cerrada = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Gestión de Archivo"
        ordering = ['-gestion_year']

class CarreraArchivo(models.Model):
    codigo_carrera = models.CharField(max_length=20, unique=True)
    nombre_carrera = models.CharField(max_length=150) # ej: Lic. en Ciencias Jurídicas
    facultad = models.CharField(max_length=150, blank=True)

    class Meta:
        verbose_name = "Carrera / Programa"

class TomoLegajo(models.Model):
    ESTADO_CHOICES = (
        ('ABIERTO', 'Abierto'),
        ('CERRADO', 'Cerrado al fin de gestión'),
    )
    
    gestion = models.ForeignKey(GestionArchivo, on_delete=models.CASCADE, related_name='tomos')
    carrera = models.ForeignKey(CarreraArchivo, on_delete=models.CASCADE, related_name='tomos')
    nro_tomo = models.CharField(max_length=50, help_text="Ej: Legajo #01")
    nro_titulo_inicial = models.CharField(max_length=20, help_text="Ej: 03399")
    nro_titulo_final = models.CharField(max_length=20, help_text="Ej: 03010")
    total_hojas = models.IntegerField(default=0)
    estado_libro = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='CERRADO')
    fecha_clausura = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = "Tomo / Legajo Matrix"
        unique_together = ('gestion', 'carrera', 'nro_tomo')

class GraduadoLegajo(models.Model):
    ESTADO_VERIFICACION = (
        ('VERIFICADO', 'Verificado'),
        ('CONVALIDADO', 'Convalidado'),
        ('PENDIENTE', 'Pendiente'),
    )

    tomo_legajo = models.ForeignKey(TomoLegajo, on_delete=models.CASCADE, related_name='graduados')
    nro_titulo_correlativo = models.CharField(max_length=30, index=True, help_text="Ej: 03399")
    nombre_completo = models.CharField(max_length=255)
    ci = models.CharField(max_length=30, index=True)
    fecha_emision = models.DateField(null=True, blank=True)
    estado_verificacion = models.CharField(max_length=20, choices=ESTADO_VERIFICACION, default='VERIFICADO')

    # Expediente Digital (Multi-documento)
    ci_pdf_url = models.URLField(blank=True, null=True)
    notas_pdf_url = models.URLField(blank=True, null=True)
    diploma_pdf_url = models.URLField(blank=True, null=True)
    otros_tramites_pdf_url = models.URLField(blank=True, null=True)
    foja_unica_ocr_url = models.URLField(blank=True, null=True, help_text="Fallback si solo se tiene foja OCR")

    class Meta:
        ordering = ['nro_titulo_correlativo']
```

---

### 3. Endpoints REST API Requeridos

1. **`GET /api/v1/archivo-central/gestiones/`**
   - Retorna la lista de gestiones anuales disponibles (`[2001, 2000, 1999, ...]`).

2. **`GET /api/v1/archivo-central/carreras/?gestion_id={id}`**
   - Retorna las carreras que contienen libros registrados en la gestión seleccionada.

3. **`GET /api/v1/archivo-central/tomos/?gestion_id={id}&carrera_id={id}`**
   - Retorna los libros/tomos cerrados de esa gestión y carrera, con sus rangos correlativos (`Del: 03399 al: 03010`).

4. **`GET /api/v1/archivo-central/tomos/{tomo_id}/graduados/?ordering=nro_titulo_correlativo`**
   - Retorna la lista indexada de graduados en el tomo, ordenada exactamente por número de título correlativo.

---

### 4. Implementación en el Frontend (`BusquedaExpedientesArchivoPage.tsx`)

El frontend de **Archivo Central** se ha actualizado con la navegación por Filtros en Cascada:

- **Filtro 1: Gestión (Año)**: Selector desplegable (ej: `2001`).
- **Filtro 2: Carrera / Programa**: Selector desplegable dependiente (ej: `Lic. en Ciencias Jurídicas`).
- **Filtro 3: Tomo / Legajo**: Muestra los libros cerrados con metadatos de rango (ej: `Legajo #01 (Del: 03399 al: 03010)`).
- **Tabla de Resultados del Tomo**:
  - Lista indexada con `N° Título Correlativo` | `Nombre del Graduado` | `C.I.` | `Estado (Verificado/Convalidado)` | `Acción: Ver Expediente / Emitir Certificado`.
