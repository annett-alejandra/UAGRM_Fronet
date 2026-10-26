import React, { useState } from 'react';
import { Search, QrCode, CheckCircle, Clock, MapPin, CreditCard, Printer, FileText, AlertCircle } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Badge } from '@/shared/ui';
import mockData from '@/shared/mock/mock_data.json';

interface TramiteItem {
  codigoRut: string;
  tipoTramite: string;
  titularNombre: string;
  ci: string;
  documento: string;
  carrera: string;
  gestionEmision: number;
  unidadFisica: string;
  faseActual: number;
  faseNombre: string;
  estadoArancel: 'PENDIENTE' | 'PAGADO' | 'GRATUITO_CONVENIO';
  arancelMonto: number;
  codigoCpt: string;
  fechaRegistro: string;
}

const FASES_STEPPER = [
  { numero: 1, titulo: 'Solicitud Ingresada', desc: 'Recepción y radicación digital de cartas/oficios.' },
  { numero: 2, titulo: 'Revisión Secretaría General', desc: 'Control previo y verificación de firmas por asesores jurídicos.' },
  { numero: 3, titulo: 'Validación Títulos / Archivo', desc: 'Cotejo contra sistema digital ANZIO o Libros Matrices físicos.' },
  { numero: 4, titulo: 'Refrendo Legal y Firma', desc: 'Firma digital de Rector y Secretario General.' },
  { numero: 5, titulo: 'Listo para Descarga / Retiro', desc: 'Certificación oficial emitida disponible para entrega en ventanilla.' },
];

export function VistaSeguimiento() {
  const [queryRut, setQueryRut] = useState('');
  const [tramiteEncontrado, setTramiteEncontrado] = useState<TramiteItem | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const handleBuscar = (codigo: string) => {
    const buscado = codigo.trim().toUpperCase();
    if (!buscado) return;

    const encontrado = mockData.tramitesSeguimiento.find(
      t => t.codigoRut.toUpperCase() === buscado || t.ci.includes(buscado)
    );

    if (encontrado) {
      setTramiteEncontrado(encontrado as TramiteItem);
      setMensajeError(null);
    } else {
      setTramiteEncontrado(null);
      setMensajeError(`No se encontró ningún expediente con el código RUT o C.I.: "${codigo}". Verifique el código ingresado e intente nuevamente.`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Cabecera de la Vista 1.3 */}
      <div className="flex justify-between items-start mb-5 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Search className="w-6 h-6 text-[#191A7D]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#191A7D]">
              Portal de Seguimiento y Trazabilidad RUT
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Consulte en tiempo real la fase de procesamiento de su expediente, unidad física actual y estado de arancel.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="gap-2 bg-white text-[#191A7D] border-[#191A7D]/30 hover:bg-slate-50"
        >
          <Printer size={16} />
          <span>Imprimir Hoja de Ruta</span>
        </Button>
      </div>

      {/* Buscador de Trámite en Tarjeta Institucional */}
      <Card className="p-6 bg-white border border-slate-200">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-[#191A7D] border border-slate-300 uppercase tracking-wider inline-block">
            Sistema Centralizado de Trazabilidad UAGRM
          </span>

          <h2 className="text-xl font-extrabold text-[#191A7D]">
            Consulta de Expediente por RUT o Carnet
          </h2>

          <p className="text-xs sm:text-sm text-slate-500">
            Ingrese el Código Único de Trámite asignado o el número de Cédula de Identidad del titular.
          </p>

          {/* Formulario de Búsqueda */}
          <div className="flex gap-2 pt-2">
            <div className="relative flex-1">
              <Input
                placeholder="Ej. UAGRM-2024-00101 o RUT-2026-00412"
                value={queryRut}
                onChange={e => setQueryRut(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleBuscar(queryRut)}
                className="pl-9 font-mono text-sm uppercase"
              />
              <Search size={18} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
            </div>
            <Button
              type="button"
              variant="primary"
              onClick={() => handleBuscar(queryRut)}
              className="bg-[#191A7D] hover:bg-[#2B6CB0] gap-2 px-5"
            >
              <Search size={16} />
              <span>Consultar</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Mensaje de Error si no se encuentra */}
      {mensajeError && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-3.5 text-red-800 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle size={20} className="text-red-700 shrink-0" />
          <span>{mensajeError}</span>
        </div>
      )}

      {/* Ficha de Información del Expediente Encontrado */}
      {tramiteEncontrado && (
        <Card className="p-6 bg-white border border-slate-200 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4 flex-wrap gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Código Único de Trámite (RUT)
              </span>
              <h2 className="text-2xl font-black text-[#191A7D] font-mono mt-0.5">
                {tramiteEncontrado.codigoRut}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge status={tramiteEncontrado.faseActual === 5 ? "success" : "info"}>
                {tramiteEncontrado.faseNombre}
              </Badge>
            </div>
          </div>

          {/* Resumen Estilo Consolidado */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[#191A7D]" />
              <span className="text-xs font-bold text-[#191A7D] uppercase tracking-wider">
                Ficha Técnica Consolidada del Expediente
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
                <span className="text-slate-500 text-[11px] font-semibold uppercase block">
                  Titular / Solicitante
                </span>
                <strong className="text-sm text-slate-900 block mt-0.5">
                  {tramiteEncontrado.titularNombre}
                </strong>
                <span className="text-xs text-slate-500">C.I. {tramiteEncontrado.ci}</span>
              </div>

              <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
                <span className="text-slate-500 text-[11px] font-semibold uppercase block">
                  Documento Solicitado
                </span>
                <strong className="text-sm text-slate-900 block mt-0.5">
                  {tramiteEncontrado.documento}
                </strong>
                <span className="text-xs text-slate-500 truncate block">{tramiteEncontrado.carrera}</span>
              </div>

              <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
                <span className="text-slate-500 text-[11px] font-semibold uppercase block">
                  Gestión y Circuito
                </span>
                <strong className="text-sm text-slate-900 block mt-0.5">
                  Año {tramiteEncontrado.gestionEmision}
                </strong>
                <span className={`text-xs font-semibold ${tramiteEncontrado.gestionEmision <= 2022 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {tramiteEncontrado.gestionEmision <= 2022 ? 'Libros Matrices (≤ 2022)' : 'Sistema ANZIO (≥ 2023)'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
                <span className="text-slate-500 text-[11px] font-semibold uppercase block">
                  Fecha de Radicación
                </span>
                <strong className="text-sm text-slate-900 block mt-0.5">
                  {tramiteEncontrado.fechaRegistro}
                </strong>
                <span className="text-xs text-slate-500">{tramiteEncontrado.tipoTramite}</span>
              </div>
            </div>
          </div>


          {/* Unidad Física Actual */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center gap-3">
            <MapPin size={24} className="text-[#191A7D] flex-shrink-0" />
            <div className="text-xs">
              <span className="text-slate-500 font-semibold uppercase tracking-wider block">Ubicación Física Actual del Expediente</span>
              <strong className="text-[#191A7D] text-sm">{tramiteEncontrado.unidadFisica}</strong>
            </div>
          </div>

          {/* Stepper Interactivo de 5 Fases */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">Línea de Tiempo del Trámite (5 Fases Institucionales)</h4>
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 py-2">
              {FASES_STEPPER.map((fase) => {
                const esCompletada = fase.numero < tramiteEncontrado.faseActual;
                const esActual = fase.numero === tramiteEncontrado.faseActual;
                const esFutura = fase.numero > tramiteEncontrado.faseActual;

                return (
                  <div key={fase.numero} className="relative pl-6">
                    {/* Indicador circular en la línea */}
                    <div
                      className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        esCompletada
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : esActual
                          ? 'bg-[#191A7D] border-[#191A7D] text-white shadow-md ring-4 ring-blue-100'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {esCompletada ? '✓' : fase.numero}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className={`text-sm font-bold ${esActual ? 'text-[#191A7D]' : esCompletada ? 'text-slate-800' : 'text-slate-400'}`}>
                          {fase.titulo}
                        </h5>
                        {esActual && <Badge status="warning">En Curso</Badge>}
                        {esCompletada && <Badge status="success">Completado</Badge>}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{fase.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Control de Arancel Institucional */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CreditCard size={24} className="text-slate-700" />
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Estado de Arancel Universitario (Cajas)</span>
                <div className="flex items-center gap-2 mt-0.5">
                  {tramiteEncontrado.estadoArancel === 'PENDIENTE' && (
                    <>
                      <Badge status="danger">Pendiente de Pago (Bs. {tramiteEncontrado.arancelMonto})</Badge>
                      <span className="text-xs font-mono text-slate-600">Código CPT: {tramiteEncontrado.codigoCpt}</span>
                    </>
                  )}
                  {tramiteEncontrado.estadoArancel === 'PAGADO' && (
                    <Badge status="success">Arancel Conciliado en Cajas (Bs. {tramiteEncontrado.arancelMonto})</Badge>
                  )}
                  {tramiteEncontrado.estadoArancel === 'GRATUITO_CONVENIO' && (
                    <Badge status="success">Exento de Pago / Gratuito por Convenio</Badge>
                  )}
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer size={16} />
              <span>Imprimir Hoja de Ruta</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
