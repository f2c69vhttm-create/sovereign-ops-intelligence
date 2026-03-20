function calcularReporte() {
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

    const totalEnPropiedadM = (inputs.llegadaM) - (inputs.salidaM + inputs.opM);
    const totalEnPropiedadF = (inputs.llegadaF) - (inputs.salidaF + inputs.opF);
    const totalGlobalMiembros = totalEnPropiedadM + totalEnPropiedadF;
    const totalFueraOP = inputs.opM + inputs.opF;
    const totalRetirados = inputs.salidaM + inputs.salidaF;
    const balanceVisitas = inputs.visitaE - inputs.visitaS;

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
    
    doc.setFillColor(0, 26, 77);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(20);
    doc.text("SOVEREIGN OPS INTELLIGENCE", 105, 20, { align: "center" });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`REPORTE LOGÍSTICO - ${ahora.toLocaleString()}`, 105, 32, { align: "center" });

    const datos = {
        vL: document.getElementById('villasLlegada').value || "N/A",
        vO: document.getElementById('villasOP').value || "N/A",
        vis: document.getElementById('resVisitasDentro').innerText,
        totalM: document.getElementById('resMiembrosPropiedad').innerText
    };

    doc.setTextColor(0, 26, 77);
    doc.setFontSize(14);
    doc.text("RESUMEN OPERATIVO", 20, 60);
    doc.setFontSize(12);
    doc.text(`- ${datos.totalM}`, 25, 75);
    doc.text(`- Miembros en Actividades fuera: ${datos.vO}`, 25, 85);
    doc.text(`- Villas de llegada hoy: ${datos.vL}`, 25, 95);
    doc.text(`- Visitas activas en perímetro: ${datos.vis}`, 25, 105);

    doc.save(`Sovereign_Report_${ahora.getTime()}.pdf`);
}

function limpiarFormulario() {
    if(confirm("¿Está seguro de que desea limpiar todos los datos del turno actual?")) {
        const ids = ['villasLlegada', 'llegadaM', 'llegadaF', 'villasSalida', 'salidaM', 'salidaF', 'villasOP', 'opM', 'opF', 'visitaEntrada', 'visitaSalida'];
        ids.forEach(id => document.getElementById(id).value = "");
        document.getElementById('resultados').classList.add('hidden');
    }
}
