// scripts/fix_utf8.cjs
const fs = require('fs');

function fixMojibake(str) {
  return str
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã±/g, 'ñ')
    .replace(/Ã/g, 'Á')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã/g, 'Í')
    .replace(/Ã“/g, 'Ó')
    .replace(/Ãš/g, 'Ú')
    .replace(/Ã‘/g, 'Ñ')
    .replace(/Âº/g, 'º')
    .replace(/Âª/g, 'ª')
    .replace(/Â¿/g, '¿')
    .replace(/Â¡/g, '¡')
    .replace(/â€¢/g, '•')
    .replace(/â†’/g, '→')
    .replace(/â†/g, '←')
    .replace(/Ã€/g, 'À')
    .replace(/DINÃMICO/g, 'DINÁMICO')
    .replace(/DINÃMICA/g, 'DINÁMICA')
    .replace(/DINÃMICAS/g, 'DINÁMICAS')
    .replace(/DINÃMICOS/g, 'DINÁMICOS')
    .replace(/RÃPIDOS/g, 'RÁPIDOS')
    .replace(/RÃPIDO/g, 'RÁPIDO')
    .replace(/JURÃDICAS/g, 'JURÍDICAS')
    .replace(/JURÃDICA/g, 'JURÍDICA')
    .replace(/INFORMÃTICA/g, 'INFORMÁTICA')
    .replace(/INFORMÃTICO/g, 'INFORMÁTICO')
    .replace(/MARÃA/g, 'MARÍA')
    .replace(/GARCÃA/g, 'GARCÍA')
    .replace(/TÃTULO/g, 'TÍTULO')
    .replace(/TÃTULOS/g, 'TÍTULOS');
}

const files = [
  'src/features/reconstruccion-ocr/DigitalizacionOcrView.tsx',
  'src/features/reconstruccion-ocr/ReconstruccionOcrSplitView.tsx',
  'src/pages/archivo-central/CargaExcelLibrosHistoricos.tsx',
  'src/pages/archivo-central/DashboardNotificacionesPage.tsx',
  'src/pages/archivo-central/ReconstruccionExpedientePage.tsx',
  'src/pages/login/SSOCallbackPage.tsx',
  'src/pages/titulos/BusquedaInformixPage.tsx',
  'src/pages/titulos/DashboardNotificacionesTitulosPage.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const fixed = fixMojibake(content);
    fs.writeFileSync(file, fixed, 'utf8');
    console.log('Fixed UTF-8 in:', file);
  }
}
