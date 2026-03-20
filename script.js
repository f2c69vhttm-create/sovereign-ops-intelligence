let baseDatosVillas = {};
let myChart;

function registrarVilla() {
    const villaId = document.getElementById('idVilla').value.trim();
    
    if (!villaId) {
        alert("Por favor, ingrese un número o nombre de Villa.");
        return;
    }

    // Capturar datos
    const datos = {
        miemM: parseInt(document.getElementById('miemM').value) || 0,
        miemF: parseInt(document.getElementById('miemF').value) || 0,
        visM: parseInt(document.getElementById('visM').value) || 0,
        visF: parseInt(document.getElementById('visF').value) || 0
    };

    // Guardar en la base de datos local
    baseDatosVillas[villaId] = datos;

    // Actualizar Interfaz
    renderizarVillas();
    actualizarTotalesYGrafico();
    
    // Limpiar campos de entrada para la siguiente villa
    document.getElementById('idVilla').value = "";
    document.getElementById('miemM').value = "";
    document.getElementById('miemF').value = "";
    document.getElementById('visM').value = "";
    document.getElementById('visF').value = "";
}

function renderizarVillas() {
    const contenedor = document.getElementById('contenedorVillas');
    contenedor.innerHTML = "";

    for (const villa in baseDatosVillas) {
        const d = baseDatosVillas[villa];
        const totalVilla = d.miemM + d.miemF + d.visM + d.visF;
        
        const card = document.createElement('div');
        card.className = "villa-card p-3 rounded";
        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="gold-text font-bold text-sm uppercase">${villa}</span>
                <span class="bg-white/10 px-2 py-0.5 rounded text-[10px]">Total: ${totalVilla}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                    <p class="opacity-60">MIEMBROS</p>
                    <p>M: ${d.miemM} | F: ${d.miemF}</p>
                </div>
                <div>
                    <p class="opacity-60">VISITAS</p>
                    <p>M: ${d.visM} | F: ${d.visF}</p>
                </div>
            </div>
            <button onclick="eliminarVilla('${villa}')" class="text-[8px] text-red-400 mt-2 uppercase hover:underline">Eliminar</button>
        `;
        contenedor.appendChild(card);
    }
}

function actualizarTotalesYGrafico() {
    let tMiem = 0, tVis = 0, tM = 0, tF = 0;

    for (const villa in baseDatosVillas) {
        const d = baseDatosVillas[villa];
        tMiem += (d.miemM + d.miemF);
        tVis += (d.visM + d.visF);
        tM += (d.miemM + d.visM);
        tF += (d.miemF + d.visF);
    }

    document.getElementById('totalGral').innerText = tMiem + tVis;

    // Gráfico
    const ctx = document.getElementById('opsChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Miembros', 'Visitas'],
            datasets: [{
                data: [tMiem, tVis],
                backgroundColor: ['#D4AF37', '#ffffff'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#fff', font: { size: 10 } } } }
        }
    });
}

function eliminarVilla(id) {
    delete baseDatosVillas[id];
    renderizarVillas();
    actualizarTotalesYGrafico();
}

window.exportarPDF = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const ahora = new Date();
    
    doc.setFillColor(0, 26, 77);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(212, 175, 55);
    doc.text("SOVEREIGN OPS - REPORTE POR VILLAS", 105, 20, { align: "center" });
    
    let y = 60;
    doc.setTextColor(0,0,0);
    doc.setFontSize(10);
    
    for (const villa in baseDatosVillas) {
        const d = baseDatosVillas[villa];
        doc.text(`${villa}: Miembros(${d.miemM}M/${d.miemF}F) - Visitas(${d.visM}M/${d.visF}F)`, 20, y);
        y += 10;
        if (y > 270) { doc.addPage(); y = 20; }
    }
    
    doc.save(`Reporte_Villas_${ahora.getTime()}.pdf`);
}
