let baseDatosVillas = {};
let myChart;

function registrarVilla() {
    const id = document.getElementById('idVilla').value.trim();
    if (!id) return alert("Por favor, identifique la Villa.");

    // Guardamos los 3 estados: Dentro, Fuera (OP) y Retirados
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
        card.className = "card-villa p-3 rounded";
        card.innerHTML = `
            <div class="flex justify-between items-center mb-2 border-b border-white/10 pb-1">
                <span class="gold-text font-bold text-xs uppercase">${v}</span>
                <button onclick="eliminarVilla('${v}')" class="text-[8px] text-red-400 uppercase">Eliminar</button>
            </div>
            <div class="grid grid-cols-3 gap-1 text-[9px] text-center">
                <div class="bg-green-500/10 p-1 rounded">
                    <p class="text-green-400 font-bold mb-1">DENTRO</p>
                    <p>M:${d.inM} F:${d.inF}</p>
                </div>
                <div class="bg-blue-500/10 p-1 rounded">
                    <p class="text-blue-400 font-bold mb-1">OP FUERA</p>
                    <p>M:${d.opM} F:${d.opF}</p>
                </div>
                <div class="bg-red-500/10 p-1 rounded">
                    <p class="text-red-400 font-bold mb-1">RETIROS</p>
                    <p>M:${d.outM} F:${d.outF}</p>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    }
}

function actualizarDashboard() {
    let tProp = 0, tFuera = 0, tRet = 0;

    for (const v in baseDatosVillas) {
        const d = baseDatosVillas[v];
        tProp += (d.inM + d.inF);
        tFuera += (d.opM + d.opF);
        tRet += (d.outM + d.outF);
    }

    document.getElementById('tProp').innerText = tProp;
    document.getElementById('tFuera').innerText = tFuera;

    const ctx = document.getElementById('opsChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['En Villa', 'En OP Fuera', 'Retiros'],
            datasets: [{
                data: [tProp, tFuera, tRet],
                backgroundColor: ['#D4AF37', '#3b82f6', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#fff', font: { size: 9 } } }
            }
        }
    });
}

function limpiarCampos() {
    ['idVilla','inM','inF','opM','opF','outM','outF'].forEach(id => document.getElementById(id).value = "");
}

function eliminarVilla(v) {
    delete baseDatosVillas[v];
    renderizarVillas();
    actualizarDashboard();
}

window.exportarPDF = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SOVEREIGN OPS - INFORME LOGÍSTICO", 105, 20, { align: "center" });
    
    let y = 40;
    doc.setFontSize(10);
    for (const v in baseDatosVillas) {
        const d = baseDatosVillas[v];
        doc.text(`${v} >> DENTRO: ${d.inM+d.inF} | FUERA OP: ${d.opM+d.opF} | RETIROS: ${d.outM+d.outF}`, 20, y);
        y += 10;
        if (y > 275) { doc.addPage(); y = 20; }
    }
    doc.save("Reporte_Ops_Sovereign.pdf");
}
