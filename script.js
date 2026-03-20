let myChart;

function calcularReporte() {
    // 1. Captura de datos
    const d = {
        lM: parseInt(document.getElementById('llegadaM').value) || 0,
        lF: parseInt(document.getElementById('llegadaF').value) || 0,
        oM: parseInt(document.getElementById('opM').value) || 0,
        oF: parseInt(document.getElementById('opF').value) || 0,
        sM: parseInt(document.getElementById('salidaM').value) || 0,
        sF: parseInt(document.getElementById('salidaF').value) || 0,
        veM: parseInt(document.getElementById('visEntradaM').value) || 0,
        veF: parseInt(document.getElementById('visEntradaF').value) || 0,
        vsM: parseInt(document.getElementById('visSalidaM').value) || 0,
        vsF: parseInt(document.getElementById('visSalidaF').value) || 0
    };

    // 2. Cálculos de Miembros y Visitas por Género
    const miembrosM = d.lM - d.oM - d.sM;
    const miembrosF = d.lF - d.oF - d.sF;
    const visitasM = d.veM - d.vsM;
    const visitasF = d.veF - d.vsF;

    const totalM = miembrosM + visitasM;
    const totalF = miembrosF + visitasF;
    const totalGral = totalM + totalF;

    // 3. Actualizar Interfaz
    document.getElementById('resultados').classList.remove('hidden');
    document.getElementById('resMiem').innerText = miembrosM + miembrosF;
    document.getElementById('resVis').innerText = visitasM + visitasF;
    document.getElementById('resM').innerText = totalM;
    document.getElementById('resF').innerText = totalF;
    document.getElementById('totalGral').innerText = totalGral;

    // 4. Actualizar Gráfico
    updateChart(miembrosM + miembrosF, visitasM + visitasF, d.oM + d.oF);
}

function updateChart(miembros, visitas, fuera) {
    const ctx = document.getElementById('opsChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['En Villa', 'Visitas', 'Actividad OP'],
            datasets: [{
                data: [miembros, visitas, fuera],
                backgroundColor: ['#D4AF37', '#ffffff', '#003399'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#fff', font: { size: 10 } } }
            }
        }
    });
}

window.exportarPDF = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const ahora = new Date();
    
    doc.setFillColor(0, 26, 77);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(18);
    doc.text("SOVEREIGN OPS INTELLIGENCE", 105, 18, { align: "center" });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`REPORTE DE SEGURIDAD POR GÉNERO - ${ahora.toLocaleString()}`, 105, 28, { align: "center" });

    doc.setTextColor(0, 26, 77);
    doc.setFontSize(12);
    doc.text("DESGLOSE DE OCUPACIÓN:", 20, 55);
    doc.setFontSize(10);
    doc.text(`- Miembros en Propiedad: ${document.getElementById('resMiem').innerText}`, 25, 65);
    doc.text(`- Visitas en Propiedad: ${document.getElementById('resVis').innerText}`, 25, 75);
    doc.text(`- Distribución por Género: Masc: ${document.getElementById('resM').innerText} / Fem: ${document.getElementById('resF').innerText}`, 25, 85);
    
    doc.save(`Sovereign_Full_Report_${ahora.getTime()}.pdf`);
}

function limpiarFormulario() {
    if(confirm("Reiniciar todos los campos del turno?")) {
        location.reload();
    }
}
