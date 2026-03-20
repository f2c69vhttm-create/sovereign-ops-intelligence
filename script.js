function calcularReporte() {
    // 1. Obtener valores de los campos
    const inputs = {
        llegadaM: parseInt(document.getElementById('llegadaM').value) || 0,
        llegadaF: parseInt(document.getElementById('llegadaF').value) || 0,
        salidaM: parseInt(document.getElementById('salidaM').value) || 0,
        salidaF: parseInt(document.getElementById('salidaF').value) || 0,
        opM: parseInt(document.getElementById('opM').value) || 0,
        opF: parseInt(document.getElementById('opF').value) || 0,
        visitaE: parseInt(document.getElementById('visitaEntrada').value) || 0,
        visitaS: parseInt(document.getElementById('visitaSalida').value) || 0
    };

    // 2. Cálculos Logísticos
    const totalEnPropiedadM = (inputs.llegadaM) - (inputs.salidaM + inputs.opM);
    const totalEnPropiedadF = (inputs.llegadaF) - (inputs.salidaF + inputs.opF);
    const totalGlobalMiembros = totalEnPropiedadM + totalEnPropiedadF;
    const totalFueraOP = inputs.opM + inputs.opF;
    const totalRetirados = inputs.salidaM + inputs.salidaF;
    const balanceVisitas = inputs.visitaE - inputs.visitaS;

    // 3. Mostrar en Interfaz
    document.getElementById('resultados').classList.remove('hidden');
    document.getElementById('resMiembrosPropiedad').innerText = `En Propiedad: ${totalGlobalMiembros}`;
    document.getElementById('resMiembrosFuera').innerText = `En Actividad OP: ${totalFueraOP}`;
    document.getElementById('resRetirados').innerText = `Total Retirados: ${totalRetirados}`;
    document.getElementById('resGeneroM').innerText = `Masculinos: ${totalEnPropiedadM}`;
    document.getElementById('resGeneroF').innerText = `Femeninos: ${totalEnPropiedadF}`;
    document.getElementById('resVisitasDentro').innerText = balanceVisitas;
}

window.exportarPDF = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const ahora = new Date();
    const fechaStr = ahora.toLocaleDateString();
    const horaStr = ahora.toLocaleTimeString();

    // Colores Corporativos
    const navy = [0, 26, 77];
    const gold = [212, 175, 55];

    // Encabezado
    doc.setFillColor(...navy);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(...gold);
    doc.setFontSize(20);
    doc.text("SOVEREIGN OPS INTELLIGENCE", 105, 20, { align: "center" });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("REPORTE EJECUTIVO DE CONTROL LOGÍSTICO", 105, 30, { align: "center" });
    doc.text(`Fecha: ${fechaStr} | Hora: ${horaStr}`, 105, 38, { align: "center" });

    // Variables de datos (re-captura)
    const vLlegada = document.getElementById('villasLlegada').value || "Ninguna";
    const vFuera = document.getElementById('villasOP').value || "Ninguna";
    const visitas = (parseInt(document.getElementById('visitaEntrada').value) || 0) - (parseInt(document.getElementById('visitaSalida').value) || 0);

    // Cuerpo del Reporte
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.setFontSize(14);
    doc.text("1. RESUMEN DE MIEMBROS", 20, 65);
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`- Miembros recibidos en villas: ${vLlegada}`, 25, 75);
    doc.text(`- Miembros en actividades fuera de propiedad (OP): ${vFuera}`, 25, 85);
    
    doc.setFontSize(14);
    doc.setTextColor(...navy);
    doc.text("2. CONTROL DE VISITAS", 20, 105);
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`- Balance neto de visitas activas en propiedad: ${visitas}`, 25, 115);

    // Cuadro de Totales
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.line(20, 130, 190, 130);
    
    doc.setFontSize(12);
    doc.setTextColor(...navy);
    doc.setFont("helvetica", "bold");
    doc.text("ESTADO ACTUAL DE OPERACIONES:", 105, 145, { align: "center" });

    // Pie de página
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text("Documento oficial generado por el sistema Sovereign Intelligence.", 105, 285, { align: "center" });

    doc.save(`Reporte_Sovereign_${ahora.getTime()}.pdf`);
}
