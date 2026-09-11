import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PublicacionService,
  Publicacion,
  EstadoPublicacion,
} from '../../../nucleo/service/publicacion.service';
import { CategoriaService, Categoria } from '../../../nucleo/service/categoria.service';
import {
  TipoDePublicacionService,
  TipoPublicacion,
} from '../../../nucleo/service/tipo_de_publicacion.service';
import { RouterLink } from '@angular/router';
import { VerPublicacion } from './ver-publicacion/ver-publicacion';
import { PaginacionComponent } from '../../../compartido/paginacion/paginacion';
import { TooltipComponent } from '../../../compartido/tooltip/tooltip.component';
import { TablaWrapper } from '../../../compartido/tabla-wrapper/tabla-wrapper';
import {
  OrganizacionesService,
  Organizacion,
} from '../../../nucleo/service/organizaciones.service';
import {
  TipoOrganizacionService,
  TipoOrganizaciones,
} from '../../../nucleo/service/tipo-organizacion.service';
import { SelectBuscadorComponent } from '../../../compartido/select-buscador/select-buscador';
import { AuthService } from '../../../nucleo/service/auth.service';
import { AlertaServicio } from '../../../compartido/servicios/alerta.servicio';
import { UgyService } from '../../../compartido/servicios/ugy.service';
import { TourStep } from '../../../compartido/ugy-interactivo/ugy-interactivo.component';

interface FiltroPublicaciones {
  vistaActual: 'activas' | 'archivadas';
  terminoBusqueda: string;
  categoriaSeleccionada: number | null;
  tipoSeleccionado: number | null;
  organizacionSeleccionada: number | null;
  tipoOrgSeleccionado: number | null;
  estadoSeleccionado: EstadoPublicacion | null;
  currentPage: number;
}

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    VerPublicacion,
    PaginacionComponent,
    TooltipComponent,
    TablaWrapper,
    SelectBuscadorComponent,
  ],
  templateUrl: './publicaciones.html',
})
export class Publicaciones implements OnInit {
  private publicacionService = inject(PublicacionService);
  private categoriaService = inject(CategoriaService);
  private tipoService = inject(TipoDePublicacionService);
  private organizacionService = inject(OrganizacionesService);
  private tipoOrganizacionService = inject(TipoOrganizacionService);
  protected readonly auth = inject(AuthService);
  private alerta = inject(AlertaServicio);
  private ugyService = inject(UgyService);

  publicacionesFiltradas: Publicacion[] = [];
  categorias: Categoria[] = [];
  tipos: TipoPublicacion[] = [];
  organizaciones: Organizacion[] = [];
  tiposOrganizacion: TipoOrganizaciones[] = [];

  categoriaSeleccionada: number | null = null;
  tipoSeleccionado: number | null = null;
  organizacionSeleccionada: number | null = null;
  tipoOrgSeleccionado: number | null = null;
  terminoBusqueda: string = '';
  estadoSeleccionado: EstadoPublicacion | null = null;

  readonly EstadoPublicacion = EstadoPublicacion;
  readonly estadosFiltro: { valor: EstadoPublicacion; etiqueta: string }[] = [
    { valor: EstadoPublicacion.BORRADOR, etiqueta: 'Borrador' },
    { valor: EstadoPublicacion.PUBLICADO, etiqueta: 'Publicado' },
  ];

  vistaActual: 'activas' | 'archivadas' = 'activas';

  cargando = true;
  error = false;
  errorMessage = '';

  modalPublicacionId: number | null = null;

  pageSize = 10;
  currentPage = 1;
  totalItems: number = 0;
  totalActivas: number = 0;
  totalArchivadas: number = 0;

  // Selección múltiple
  filasSeleccionadas = new Set<number>();

  // Ordenamiento
  columnaOrden: 'titulo' | 'tipo' | 'categoria' | 'estado' | 'fecha' = 'fecha';
  ordenAscendente = false;

  get esAdminGlobal(): boolean {
    return this.auth.esAdministradorGlobal();
  }

  get puedeAccionar(): boolean {
    return (
      this.auth.tienePermiso('sistema_portal_web_publicaciones_actualizar') ||
      this.auth.tienePermiso('sistema_portal_web_publicaciones_eliminar') ||
      this.auth.tienePermiso('sistema_portal_web_publicaciones_eliminar_logico')
    );
  }

  // Estado guardado
  private estadoGuardado: FiltroPublicaciones | null = null;

  ngOnInit() {
    const st = sessionStorage.getItem('publicaciones_filtro');
    if (st) {
      try { this.estadoGuardado = JSON.parse(st) as FiltroPublicaciones; } catch (e) {}
    }

    if (this.estadoGuardado) {
      this.vistaActual = this.estadoGuardado.vistaActual || 'activas';
      this.terminoBusqueda = this.estadoGuardado.terminoBusqueda || '';
      this.categoriaSeleccionada = this.estadoGuardado.categoriaSeleccionada || null;
      this.tipoSeleccionado = this.estadoGuardado.tipoSeleccionado || null;
      this.organizacionSeleccionada = this.estadoGuardado.organizacionSeleccionada || null;
      this.tipoOrgSeleccionado = this.estadoGuardado.tipoOrgSeleccionado || null;
      this.estadoSeleccionado = this.estadoGuardado.estadoSeleccionado || null;
      this.currentPage = this.estadoGuardado.currentPage || 1;
    }

    this.cargarFiltros();
    this.configurarTour();
  }

  guardarEstado() {
    const state = {
      vistaActual: this.vistaActual,
      terminoBusqueda: this.terminoBusqueda,
      categoriaSeleccionada: this.categoriaSeleccionada,
      tipoSeleccionado: this.tipoSeleccionado,
      organizacionSeleccionada: this.organizacionSeleccionada,
      tipoOrgSeleccionado: this.tipoOrgSeleccionado,
      estadoSeleccionado: this.estadoSeleccionado,
      currentPage: this.currentPage
    };
    sessionStorage.setItem('publicaciones_filtro', JSON.stringify(state));
  }

  configurarTour() {
    const steps: TourStep[] = [
      {
        popover: {
          title: 'Gestión de Publicaciones',
          description: 'Aquí puedes administrar noticias, eventos y avisos de tus portales.',
        },
        narration: 'Bienvenido al módulo de publicaciones. Aquí es donde mantenemos informada a nuestra audiencia con noticias y avisos.'
      },
      {
        element: '#tour-publicaciones-tabs',
        popover: {
          title: 'Vistas de Listado',
          description: 'Cambia entre las publicaciones activas y aquellas que has archivado.',
          side: 'bottom'
        },
        narration: 'Puedes alternar entre tus publicaciones vigentes y el historial de archivadas fácilmente.'
      },
      {
        element: '#tour-publicaciones-nueva',
        popover: {
          title: 'Nueva Publicación',
          description: 'Crea contenido nuevo seleccionando su categoría y tipo.',
          side: 'bottom'
        },
        narration: 'Cuando tengas una noticia nueva que dar, usa este botón para empezar el proceso.'
      },
      {
        element: '#tour-publicaciones-buscar',
        popover: {
          title: 'Buscador',
          description: 'Encuentra publicaciones rápidamente por su título.',
          side: 'bottom'
        },
        narration: 'Si tienes mucho contenido, nuestro buscador te ayudará a encontrar lo que necesitas en segundos.'
      },
      {
        element: '#tour-publicaciones-filtros',
        popover: {
          title: 'Filtros Avanzados',
          description: 'Segmenta el listado por estado, categoría, tipo o la organización responsable.',
          side: 'top'
        },
        narration: 'Usa estos filtros para organizar tu vista. Como administrador global, también podrás filtrar por tipo de unidad.'
      },
      {
        element: '#tour-publicaciones-estado',
        popover: {
          title: 'Toggle de Estado',
          description: 'Publica o pasa a borrador con un solo clic directamente desde la tabla.',
          side: 'top'
        },
        narration: 'Fíjate en estos botones de estado. Son geniales porque te permiten publicar o despublicar algo al instante sin entrar a editarlo.'
      }
    ];

    this.ugyService.setSteps(steps);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.guardarEstado();
    this.cargarPublicaciones();
  }

  cargarFiltros() {
    this.cargando = true;
    if (this.esAdminGlobal) {
      // Admin global: cargar tipos de organización para el filtro en cascada
      this.tipoOrganizacionService.obtenerTodos().subscribe({
        next: (tipos) => {
          this.tiposOrganizacion = tipos;
          if (this.tipoOrgSeleccionado) {
            this.organizacionService.obtenerPorTipo(this.tipoOrgSeleccionado).subscribe({
              next: (orgs) => { this.organizaciones = orgs; },
              error: () => { this.organizaciones = []; }
            });
          }
        },
        error: () => {
          this.tiposOrganizacion = [];
        },
      });
      this.cargarDependenciasFiltros();
    } else {
      // Usuario normal: sus organizaciones raíz más todos sus descendientes
      this.organizacionService.obtenerMisOrganizaciones().subscribe({
        next: (orgs) => {
          this.organizaciones = [...orgs, ...orgs.flatMap((o) => o.descendientes ?? [])];
          if (this.organizaciones.length === 1 && !this.estadoGuardado) {
            this.organizacionSeleccionada = this.organizaciones[0].id;
          }
          this.cargarDependenciasFiltros();
        },
        error: () => {
          this.organizaciones = [];
          this.cargarDependenciasFiltros();
        },
      });
    }
  }

  private cargarDependenciasFiltros() {
    this.categoriaService.obtenerTodos().subscribe({
      next: (cats) => {
        this.categorias = cats;
        this.tipoService.obtenerTodos().subscribe({
          next: (tipos) => {
            this.tipos = tipos;
            this.cargarPublicaciones();
          },
          error: () => {
            this.tipos = [];
            this.cargarPublicaciones();
          },
        });
      },
      error: () => {
        this.categorias = [];
        this.cargarDependenciasFiltrosTiposYPublicaciones();
      },
    });
  }

  private cargarDependenciasFiltrosTiposYPublicaciones() {
    this.tipoService.obtenerTodos().subscribe({
      next: (tipos) => {
        this.tipos = tipos;
        this.cargarPublicaciones();
      },
      error: () => {
        this.tipos = [];
        this.cargarPublicaciones();
      },
    });
  }

  /** Solo admin global: al cambiar tipo de organización recarga el select de organizaciones. */
  alCambiarTipoOrg() {
    this.organizacionSeleccionada = null;
    this.organizaciones = [];
    this.currentPage = 1;
    if (this.tipoOrgSeleccionado) {
      this.organizacionService.obtenerPorTipo(this.tipoOrgSeleccionado).subscribe({
        next: (orgs) => {
          this.organizaciones = orgs;
        },
        error: () => {
          this.organizaciones = [];
        },
      });
    }
    this.guardarEstado();
    this.cargarPublicaciones();
  }

  cambiarVista(vista: 'activas' | 'archivadas') {
    this.vistaActual = vista;
    this.currentPage = 1;
    this.guardarEstado();
    this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    this.cargando = true;

    const observable =
      this.vistaActual === 'archivadas'
        ? this.publicacionService.obtenerArchivadasCms(
            this.currentPage,
            this.pageSize,
            this.terminoBusqueda || undefined,
            this.categoriaSeleccionada || undefined,
            this.tipoSeleccionado || undefined,
            this.organizacionSeleccionada || undefined,
          )
        : this.publicacionService.obtenerPaginadasCms(
            this.currentPage,
            this.pageSize,
            this.terminoBusqueda || undefined,
            this.categoriaSeleccionada || undefined,
            this.tipoSeleccionado || undefined,
            this.organizacionSeleccionada || undefined,
            this.estadoSeleccionado || undefined,
          );

    observable.subscribe({
      next: (res) => {
        this.publicacionesFiltradas = res.items;
        this.totalItems = res.totalItems;
        if (this.vistaActual === 'activas') {
          this.totalActivas = res.totalItems;
        } else {
          this.totalArchivadas = res.totalItems;
        }
        this.cargando = false;
        this.filasSeleccionadas.clear();
        this.aplicarOrdenamiento();
        
        // Cargar el conteo de la otra vista para las pestañas
        this.cargarConteosAdicionales();

        // Validar si la current page es válida tras el filtro
        const maxPage = Math.ceil(this.totalItems / this.pageSize) || 1;
        if (this.currentPage > maxPage) {
          this.currentPage = maxPage;
        }
        this.guardarEstado();
      },
      error: () => {
        this.error = true;
        this.errorMessage = 'Error al cargar publicaciones';
        this.cargando = false;
        this.guardarEstado();
      },
    });
  }

  cargarConteosAdicionales(): void {
    if (this.vistaActual === 'activas' && this.auth.tienePermiso('sistema_portal_web_publicaciones_obtener_archivadas_cms')) {
      this.publicacionService.obtenerArchivadasCms(1, 1).subscribe({
        next: (res) => { this.totalArchivadas = res.totalItems; },
        error: () => {}
      });
    } else if (this.vistaActual === 'archivadas') {
      this.publicacionService.obtenerPaginadasCms(1, 1).subscribe({
        next: (res) => { this.totalActivas = res.totalItems; },
        error: () => {}
      });
    }
  }

  // Métodos de Selección Múltiple
  esTodoSeleccionado(): boolean {
    if (!this.publicacionesFiltradas || this.publicacionesFiltradas.length === 0) return false;
    return this.publicacionesFiltradas.every((p) => this.filasSeleccionadas.has(p.id));
  }

  toggleSeleccionarTodo(): void {
    if (this.esTodoSeleccionado()) {
      this.filasSeleccionadas.clear();
    } else {
      this.publicacionesFiltradas.forEach((p) => this.filasSeleccionadas.add(p.id));
    }
  }

  toggleSeleccion(id: number): void {
    if (this.filasSeleccionadas.has(id)) {
      this.filasSeleccionadas.delete(id);
    } else {
      this.filasSeleccionadas.add(id);
    }
  }

  estaSeleccionado(id: number): boolean {
    return this.filasSeleccionadas.has(id);
  }

  desseleccionarTodos(): void {
    this.filasSeleccionadas.clear();
  }

  get cantidadSeleccionadas(): number {
    return this.filasSeleccionadas.size;
  }

  // Generador de iniciales de 2 letras para avatar de publicación
  getIniciales(titulo: string): string {
    if (!titulo) return 'PB';
    const palabras = titulo.trim().split(/\s+/).filter((p) => p.length > 0);
    if (palabras.length >= 2) {
      return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    return titulo.substring(0, 2).toUpperCase();
  }

  // Métodos para Etiquetas de Chips
  get nombreCategoriaSeleccionada(): string | null {
    if (!this.categoriaSeleccionada) return null;
    const cat = this.categorias.find((c) => c.id === this.categoriaSeleccionada);
    return cat ? cat.nombre : null;
  }

  get nombreTipoSeleccionado(): string | null {
    if (!this.tipoSeleccionado) return null;
    const t = this.tipos.find((tipo) => tipo.id === this.tipoSeleccionado);
    return t ? t.nombre : null;
  }

  get nombreTipoOrgSeleccionado(): string | null {
    if (!this.tipoOrgSeleccionado) return null;
    const to = this.tiposOrganizacion.find((t) => t.id === this.tipoOrgSeleccionado);
    return to ? to.nombre : null;
  }

  get nombreOrganizacionSeleccionada(): string | null {
    if (!this.organizacionSeleccionada) return null;
    const org = this.organizaciones.find((o) => o.id === this.organizacionSeleccionada);
    return org ? org.nombre : null;
  }

  get etiquetaEstadoSeleccionado(): string | null {
    if (!this.estadoSeleccionado) return null;
    const est = this.estadosFiltro.find((e) => e.valor === this.estadoSeleccionado);
    return est ? est.etiqueta : null;
  }

  get tieneFiltrosActivos(): boolean {
    return (
      !!this.terminoBusqueda ||
      this.categoriaSeleccionada !== null ||
      this.tipoSeleccionado !== null ||
      this.tipoOrgSeleccionado !== null ||
      this.organizacionSeleccionada !== null ||
      this.estadoSeleccionado !== null
    );
  }

  limpiarTodosFiltros(): void {
    this.terminoBusqueda = '';
    this.categoriaSeleccionada = null;
    this.tipoSeleccionado = null;
    this.tipoOrgSeleccionado = null;
    this.organizacionSeleccionada = null;
    this.estadoSeleccionado = null;
    this.currentPage = 1;
    this.guardarEstado();
    this.cargarPublicaciones();
  }

  removerFiltroEstado(): void {
    this.estadoSeleccionado = null;
    this.alCambiarEstado();
  }

  removerFiltroCategoria(): void {
    this.categoriaSeleccionada = null;
    this.alCambiarCategoria();
  }

  removerFiltroTipo(): void {
    this.tipoSeleccionado = null;
    this.alCambiarTipo();
  }

  removerFiltroTipoOrg(): void {
    this.tipoOrgSeleccionado = null;
    this.alCambiarTipoOrg();
  }

  removerFiltroOrganizacion(): void {
    this.organizacionSeleccionada = null;
    this.alCambiarOrganizacion();
  }

  removerFiltroBusqueda(): void {
    this.limpiarBusqueda();
  }

  // Ordenamiento interactivo
  getSimboloOrden(columna: 'titulo' | 'tipo' | 'categoria' | 'estado' | 'fecha'): string {
    if (this.columnaOrden !== columna) return '↑↓';
    return this.ordenAscendente ? '↑' : '↓';
  }

  ordenarPor(columna: 'titulo' | 'tipo' | 'categoria' | 'estado' | 'fecha'): void {
    if (this.columnaOrden === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrden = columna;
      this.ordenAscendente = true;
    }
    this.aplicarOrdenamiento();
  }

  aplicarOrdenamiento(): void {
    if (!this.publicacionesFiltradas || this.publicacionesFiltradas.length === 0) return;

    const arr = [...this.publicacionesFiltradas];
    arr.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (this.columnaOrden) {
        case 'titulo':
          valA = a.titulo.toLowerCase();
          valB = b.titulo.toLowerCase();
          break;
        case 'tipo':
          valA = a.tipoPublicacion?.nombre?.toLowerCase() ?? '';
          valB = b.tipoPublicacion?.nombre?.toLowerCase() ?? '';
          break;
        case 'categoria':
          valA = a.categoria?.nombre?.toLowerCase() ?? '';
          valB = b.categoria?.nombre?.toLowerCase() ?? '';
          break;
        case 'estado':
          valA = a.estado;
          valB = b.estado;
          break;
        case 'fecha':
          valA = new Date(a.createdAt || a.updatedAt || 0).getTime();
          valB = new Date(b.createdAt || b.updatedAt || 0).getTime();
          break;
      }

      if (valA < valB) return this.ordenAscendente ? -1 : 1;
      if (valA > valB) return this.ordenAscendente ? 1 : -1;
      return 0;
    });

    this.publicacionesFiltradas = arr;
  }

  // Acciones en lote (Bulk Actions)
  async publicarSeleccionadas(): Promise<void> {
    const ids = Array.from(this.filasSeleccionadas);
    if (ids.length === 0) return;

    const confirmado = await this.alerta.confirm(
      `¿Deseas cambiar el estado a PUBLICADO para las ${ids.length} publicaciones seleccionadas?`,
      'Publicación Masiva'
    );
    if (!confirmado) return;

    let completadas = 0;
    for (const id of ids) {
      this.publicacionService.cambiarEstado(id, EstadoPublicacion.PUBLICADO).subscribe({
        next: () => {
          completadas++;
          if (completadas === ids.length) {
            this.alerta.toast(`${completadas} publicaciones cambiadas a Publicado`);
            this.filasSeleccionadas.clear();
            this.cargarPublicaciones();
          }
        },
        error: (err: unknown) => {
          console.error('Error al cambiar estado masivo:', err);
        },
      });
    }
  }

  async archivarSeleccionadas(): Promise<void> {
    const ids = Array.from(this.filasSeleccionadas);
    if (ids.length === 0) return;

    const confirmado = await this.alerta.confirm(
      `¿Estás seguro de que deseas archivar las ${ids.length} publicaciones seleccionadas?`,
      'Archivado Masivo'
    );
    if (!confirmado) return;

    let completadas = 0;
    for (const id of ids) {
      this.publicacionService.eliminarLogico(id).subscribe({
        next: () => {
          completadas++;
          if (completadas === ids.length) {
            this.alerta.toast(`${completadas} publicaciones archivadas`);
            this.filasSeleccionadas.clear();
            this.cargarPublicaciones();
          }
        },
        error: (err: unknown) => {
          console.error('Error al archivar masivo:', err);
        },
      });
    }
  }

  async eliminarSeleccionadas(): Promise<void> {
    const ids = Array.from(this.filasSeleccionadas);
    if (ids.length === 0) return;

    const confirmado = await this.alerta.confirm(
      `¿Estás seguro de que deseas eliminar PERMANENTEMENTE las ${ids.length} publicaciones seleccionadas?\nEsta acción no se puede deshacer.`,
      '¡Atención!'
    );
    if (!confirmado) return;

    let completadas = 0;
    for (const id of ids) {
      this.publicacionService.eliminarPermanente(id).subscribe({
        next: () => {
          completadas++;
          if (completadas === ids.length) {
            this.alerta.toast(`${completadas} publicaciones eliminadas permanentemente`);
            this.filasSeleccionadas.clear();
            this.cargarPublicaciones();
          }
        },
        error: (err: unknown) => {
          console.error('Error al eliminar masivo:', err);
        },
      });
    }
  }

  alCambiarEstado() {
    this.currentPage = 1;
    this.guardarEstado();
    this.cargarPublicaciones();
  }

  alCambiarCategoria() {
    this.currentPage = 1;
    this.guardarEstado();
    this.cargarPublicaciones();
  }

  alCambiarOrganizacion() {
    this.currentPage = 1;
    this.guardarEstado();
    this.cargarPublicaciones();
  }

  alCambiarTipo() {
    this.currentPage = 1;
    this.guardarEstado();
    this.cargarPublicaciones();
  }

  getArchivoPrincipal(pub: Publicacion): any {
    return pub.archivos?.[0] || null;
  }

  erroresMedia = new Set<number>();
  onMediaError(pubId: number) {
    this.erroresMedia.add(pubId);
  }

  isYoutubeVideo(url: string): boolean {

    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  getYoutubeThumbnail(url: string): string {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = match && match[2].length === 11 ? match[2] : null;
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '';
  }

  onBuscar() {
    this.currentPage = 1;
    this.guardarEstado();
    this.cargarPublicaciones();
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.currentPage = 1;
    this.guardarEstado();
    this.cargarPublicaciones();
  }

  abrirModal(id: number) {
    this.modalPublicacionId = id;
  }

  cerrarModal() {
    this.modalPublicacionId = null;
  }

  async eliminarLogico(pub: Publicacion): Promise<void> {
    const confirmado = await this.alerta.confirm(
      `¿Estás seguro de que deseas archivar la publicación "${pub.titulo}"?`,
      'Archivar publicación'
    );
    if (!confirmado) return;

    this.publicacionService.eliminarLogico(pub.id).subscribe({
      next: () => {
        this.alerta.toast('Publicación archivada correctamente');
        this.cargarPublicaciones();
      },
      error: (err: unknown) => {
        console.error('Error al archivar:', err);
        this.alerta.error('Hubo un error al archivar la publicación.');
      },
    });
  }

  cargandoEstadoIds = new Set<number>();

  toggleEstado(pub: Publicacion) {
    if (this.cargandoEstadoIds.has(pub.id)) return;

    const nuevoEstado =
      pub.estado === EstadoPublicacion.PUBLICADO
        ? EstadoPublicacion.BORRADOR
        : EstadoPublicacion.PUBLICADO;

    this.cargandoEstadoIds.add(pub.id);

    this.publicacionService.cambiarEstado(pub.id, nuevoEstado).subscribe({
      next: (pubActualizada) => {
        this.cargandoEstadoIds.delete(pub.id);
        const estadoFinal = pubActualizada?.estado ?? nuevoEstado;

        // Actualizar el arreglo de forma inmutable para evitar error de solo lectura en objetos de la caché de Apollo
        this.publicacionesFiltradas = this.publicacionesFiltradas.map((p) =>
          p.id === pub.id ? { ...p, estado: estadoFinal } : p
        );

        this.alerta.toast(`Estado cambiado a ${estadoFinal.toLowerCase()}`);

        if (this.estadoSeleccionado) {
          this.cargarPublicaciones();
        }
      },
      error: (err: unknown) => {
        this.cargandoEstadoIds.delete(pub.id);
        console.error('Error al cambiar estado:', err);
        this.alerta.error('No se pudo cambiar el estado de la publicación.');
      },
    });
  }

  async restaurar(pub: Publicacion): Promise<void> {
    const confirmado = await this.alerta.confirm(
      `¿Deseas restaurar la publicación "${pub.titulo}" al estado BORRADOR?`,
      'Restaurar publicación'
    );
    if (!confirmado) return;

    this.publicacionService.restaurarPublicacion(pub.id).subscribe({
      next: () => {
        this.alerta.toast('Publicación restaurada');
        this.cargarPublicaciones();
      },
      error: (err: unknown) => {
        console.error('Error al restaurar:', err);
        this.alerta.error('Hubo un error al restaurar la publicación.');
      },
    });
  }

  async eliminarPermanente(pub: Publicacion): Promise<void> {
    const confirmado = await this.alerta.confirm(
      `¿Estás seguro de que deseas eliminar PERMANENTEMENTE la publicación "${pub.titulo}"?\nEsta acción no se puede deshacer.`,
      '¡Atención!'
    );
    if (!confirmado) return;

    this.publicacionService.eliminarPermanente(pub.id).subscribe({
      next: (success) => {
        if (success) {
          this.alerta.toast('Publicación eliminada permanentemente');
          this.cargarPublicaciones();
        } else {
          this.alerta.error('No se pudo eliminar la publicación permanentemente.');
        }
      },
      error: (err: unknown) => {
        console.error('Error al eliminar permanentemente:', err);
        this.alerta.error('Hubo un error al eliminar la publicación permanentemente.');
      },
    });
  }
}
