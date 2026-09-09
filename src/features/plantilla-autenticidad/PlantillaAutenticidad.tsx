import { useState } from 'react';

export function PlantillaAutenticidad() {
  const [showEnviar, setShowEnviar] = useState(false);
  const [certData, setCertData] = useState({
    nombre: 'JUAN PÉREZ GARCÍA',
    ci: '1234567 SC',
    ru: '219084732',
    carrera: 'INGENIERÍA INFORMÁTICA',
    facultad: 'FACULTAD DE CIENCIAS DE LA COMPUTACIÓN Y TELECOMUNICACIONES',
    libro: 'L-45',
    tomo: 'T-02',
    folio: 'F-128',
    gestion: '1999',
    pagina: '44',
    nroRegistro: 'TS-99-001'
  });

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 h-full animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Plantilla de Autenticidad UAGRM</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Certificado de Autenticidad con referencias de Libro, Tomo y Folio de Matriz.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => window.print()} className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-lg font-medium text-sm shadow-sm transition-colors">
            🖨️ Imprimir
          </button>
          
          <div className="relative">
            <button onClick={() => setShowEnviar(!showEnviar)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-sm transition-colors">
              Enviar a...
            </button>
            {showEnviar && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-10 animate-in slide-in-from-top-2">
                <button className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700">Secretaría General</button>
                <button className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700">Títulos y Grados</button>
                <button className="w-full text-left px-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Ambos Departamentos</button>
              </div>
            )}
          </div>
          
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm shadow-sm transition-colors">
            Guardar Plantilla
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-200 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 p-8 flex justify-center items-start overflow-auto shadow-inner">
        {/* Documento Hoja A4 */}
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[3.5rem] text-black shrink-0 relative flex flex-col justify-between">
          <div>
            <div className="absolute top-0 left-0 w-full h-3 bg-red-700"></div>
            <div className="absolute top-3 left-0 w-full h-1 bg-blue-900"></div>
            
            <div className="text-center mt-8 mb-12">
              <h1 className="text-xl font-bold font-serif uppercase tracking-wide">UNIVERSIDAD AUTÓNOMA "GABRIEL RENÉ MORENO"</h1>
              <p className="text-xs font-serif uppercase text-slate-600 mt-1">Santa Cruz de la Sierra - Bolivia</p>
              <div className="w-24 h-0.5 bg-black mx-auto my-3"></div>
              <h2 className="text-lg font-bold font-serif tracking-widest text-slate-800 uppercase mt-4">CERTIFICADO DE AUTENTICIDAD DE ARCHIVO</h2>
            </div>
            
            <div className="text-justify leading-relaxed text-sm font-serif space-y-5 px-4">
              <p>
                El Jefe del Departamento de Archivo Central de la Universidad Autónoma "Gabriel René Moreno", certifica por el presente documento oficial:
              </p>
              
              <div className="p-4 border border-slate-300 bg-slate-50/50 rounded space-y-2 text-xs font-sans">
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Estudiante:</strong> {certData.nombre}</div>
                  <div><strong>Carnet de Identidad:</strong> {certData.ci}</div>
                  <div><strong>Registro Univ. (RU):</strong> {certData.ru}</div>
                  <div><strong>Carrera:</strong> {certData.carrera}</div>
                  <div className="col-span-2"><strong>Facultad:</strong> {certData.facultad}</div>
                </div>
              </div>

              <p>
                Que habiendo revisado los libros de matrices y archivos físicos correspondientes a la gestión <strong>{certData.gestion}</strong>, se verifica el registro asentado con las siguientes especificaciones catalográficas:
              </p>

              <div className="p-4 border border-amber-300 bg-amber-50/40 rounded text-center text-xs font-mono font-bold space-x-6">
                <span>LIBRO: {certData.libro}</span>
                <span>TOMO: {certData.tomo}</span>
                <span>FOLIO: {certData.folio}</span>
                <span>PÁGINA: {certData.pagina}</span>
              </div>

              <p>
                Se valida la emisión del Título Supletorio bajo el código de registro <strong>{certData.nroRegistro}</strong>, habiéndose cumplido con los requisitos legales e institucionales establecidos.
              </p>
              <p>
                Es cuanto se certifica en honor a la verdad para los fines legales y administrativos que convengan al interesado.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 gap-12 max-w-lg mx-auto">
              <div className="border-t border-black pt-2 font-bold font-serif text-xs">
                FIRMA Y SELLO<br />
                <span className="font-normal text-[10px] text-slate-600">Encargado de Archivo Central</span>
              </div>
              <div className="border-t border-black pt-2 font-bold font-serif text-xs">
                Vo. Bo.<br />
                <span className="font-normal text-[10px] text-slate-600">Jefatura de Títulos y Grados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
