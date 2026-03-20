let baseDatosVillas = {};
let myChart;

function registrarVilla() {
    const id = document.getElementById('idVilla').value.trim();
    if (!id) return alert("Ingrese ID de Villa");

    baseDatosVillas[id] = {
        inM: parseInt(document.getElementById('inM').value) || 0,
        inF: parseInt(document.getElementById('inF').value) || 0,
        opM: parseInt(document.getElementById('opM').value) || 0,
        opF: parseInt(document.getElementById('opF').value) || 0,
        outM: parseInt(document.getElementById('outM').value) || 0,
        outF: parseInt(document.getElementById('outF').value) || 0
    };

    renderizarVillas();
    actualizarDashboard();
    limpiarCampos();
}

function renderizarVillas() {
    const contenedor = document.getElementById('contenedorVillas');
    contenedor.innerHTML = "";

    for (const v in baseDatosVillas) {
        const d = baseDatosVillas[v];
        const card = document.createElement('div');
        card.className = "villa-card p-3 rounded";
        card.innerHTML = `
            <div class="flex justify-between items-center border-b border-white/10 mb-2 pb-1">
                <span class="gold-text font-bold text-xs">${v}</span>
                <button onclick="eliminarVilla('${v}')" class="text-[8px] text-red-400 uppercase">Eliminar</button>
            </div>
            <div class="grid grid-cols-3 gap-1 text-[9px] text-center">
                <div class="bg-green-500/10 p-1 rounded">
                    <p class="opacity-70 font-bold">DENTRO</p>
                    <p>M:${d.inM} F:${d.inF}</p>
                </div>
                <div class="bg-blue-500/10 p-1 rounded">
                    <p class="opacity-70 font-bold text-blue-300">OP FUERA</p>
                    <p>M:${d.opM} F:${d.opF}</p>
                </div>
                <div class="bg-red-500/10 p-1 rounded">
                    <p class="opacity-70 font-bold text-red-300">RETIROS</p>
                    <p>M:${d.outM} F:${d.outF}</p>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    }
}

function actualizarDashboard() {
    let prop = 0, fuera = 0, retirados = 0;
    for (const v in baseDatosVillas) {
        const d = baseDatosVillas[v];
        prop += (d.inM + d.inF);
        fuera += (d.opM + d.opF);
        retirados += (d.outM + d.outF);
    }

    document.getElementById('tPropiedad').innerText = prop;
    document.getElementById('tFuera').innerText = fuera;

    const ctx = document.getElementById('opsChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['En Villa', 'En OP Fuera', 'Retirados'],
            datasets: [{
                data: [prop, fuera, retirados],
                backgroundColor: ['#D4AF37', '#3b82f6', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#fff', font: { size: 9 } } } }
        }
    });
}

function limpiarCampos() {
    ['idVilla','inM','inF','opM','opF','outM','outF'].forEach(i => document.getElementById(i).value = "");
}

function eliminarVilla(id) {
    delete baseDatosVillas[id];
    renderizarVillas();
    actualizarDashboard();
}

window.exportarPDF = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("REPORTE LOGÍSTICO SOVEREIGN", 105, 20, {align: 'center'});
    let y = 40;
    for (const v in baseDatosVillas) {
        const d = baseDatosVillas[v];
        doc.setFontSize(10);
        doc.text(`${v} - EN PROPIEDAD: ${d.inM+d.inF} | FUERA OP: ${d.opM+d.opF} | RETIRADOS: ${d.outM+d.outF}`, 20, y);
        y += 8;
    }
    doc.save("Reporte_Logistico.pdf");
}
