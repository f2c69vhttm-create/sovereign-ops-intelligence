function calcularReporte() {
    // Obtener valores de entrada (usando 0 si están vacíos)
    const llegadaM = parseInt(document.getElementById('llegadaM').value) || 0;
    const llegadaF = parseInt(document.getElementById('llegadaF').value) || 0;
    
    const salidaM = parseInt(document.getElementById('salidaM').value) || 0;
    const salidaF = parseInt(document.getElementById('salidaF').value) || 0;
    
    const opM = parseInt(document.getElementById('opM').value) || 0;
    const opF = parseInt(document.getElementById('opF').value) || 0;
    
    const visitaEntrada = parseInt(document.getElementById('visitaEntrada').value) || 0;
    const visitaSalida = parseInt(document.getElementById('visitaSalida').value) || 0;

    // Cálculos
    const totalLlegadas = llegadaM + llegadaF;
    const totalRetirados = salidaM + salidaF;
    const totalOPFuera = opM + opF;
    
    // Miembros actuales en propiedad (Llegadas - Salidas - Los que están en OP fuera)
    const enPropiedadM = llegadaM - salidaM - opM;
    const enPropiedadF = llegadaF - salidaF - opF;
    const totalEnPropiedad = enPropiedadM + enPropiedadF;

    // Visitas
    const visitasActuales = visitaEntrada - visitaSalida;

    // Mostrar resultados
    document.getElementById('resultados').classList.remove('hidden');
    document.getElementById('resMiembrosPropiedad').innerText = `En Propiedad: ${totalEnPropiedad}`;
    document.getElementById('resMiembrosFuera').innerText = `En OP Fuera: ${totalOPFuera}`;
    document.getElementById('resRetirados').innerText = `Total Retirados: ${totalRetirados}`;
    
    document.getElementById('resGeneroM').innerText = `Masculinos: ${enPropiedadM}`;
    document.getElementById('resGeneroF').innerText = `Femeninos: ${enPropiedadF}`;
    
    document.getElementById('resVisitasDentro').innerText = `Visitas en Propiedad: ${visitasActuales}`;
}
