let baseDatosVillas = {};
let myChart;

function registrarVilla() {
    const id = document.getElementById('idVilla').value.trim();
    if (!id) return alert("Identifique la Villa.");

    baseDatosVillas[id] = {
        mM: parseInt(document.getElementById('miemM').value) || 0,
        mF: parseInt(document.getElementById('miemF').value) || 0,
        vM: parseInt(document.getElementById('visM').value) || 0,
        vF: parseInt(document.getElementById('visF').value) || 0,
        oM: parseInt(document.getElementById('opM').value) || 0,
        oF: parseInt(document.getElementById('opF').value) || 0,
        sM: parseInt(document.getElementById('outM').value) || 0,
        sF: parseInt(document.getElementById('outF').value) || 0
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
        card.className = "p-3 rounded bg-white/5 border-l-4 gold-border";
        card.innerHTML = `
            <div class="flex justify-between items-center border-b border-white/10 mb-2 pb-1">
                <span class="gold-text font-bold text-xs uppercase">${v}</span>
                <button onclick="eliminarVilla('${v}')" class="text-[8px] text-red-400 uppercase">Eliminar</button>
            </div>
            <div class="grid grid-cols-2 gap-2 text-[9px]">
                <div class="bg-green-500/5 p-1 rounded">
                    <p class="text-green-400 font-bold">MIEMBROS: ${d.mM + d.mF}</p>
                    <p>M:${d.mM} F:${d.mF}</p>
                </div>
                <div class="bg-white/5 p-1 rounded">
                    <p class="gold-text font-bold">VISITAS: ${d.vM + d.vF}</p>
                    <p>M:${d.vM} F:${d.vF}</p>
                </div>
                <div class="bg-blue-500/5 p-1 rounded">
                    <p class="text-blue-400 font-bold">OP FUERA: ${d.oM + d.oF}</p>
                </div>
                <div class="bg-red-500/5 p-1 rounded">
                    <p class="text-red-400 font-bold">RETIROS: ${d.sM + d.sF}</p>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    }
}

function actualizarDashboard() {
    let tM = 0, tV = 0, tOP = 0, tS = 0;
    for (const v in baseDatosVillas) {
        const d = baseDatosVillas[v];
        tM += (d.mM + d.mF);
        tV += (d.vM + d.vF);
        tOP += (d.oM + d.oF);
        tS += (d.sM + d.sF);
    }

    document.getElementById('tMiem').innerText = tM;
    document.getElementById('tVis').innerText = tV;

    const ctx = document.getElementById('opsChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Miembros', 'Visitas', 'Fuera OP', 'Retiros'],
            datasets: [{
                data: [tM, tV, tOP, tS],
                backgroundColor: ['#10b981', '#D4AF37', '#3b82f6', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#fff', font: { size: 8 } } } }
        }
    });
}

function limpiarCampos() {
    const ids = ['idVilla','miemM','miemF','visM','visF','opM','opF','outM','outF'];
    ids.forEach(id => document.getElementById(id).value = "");
}

function eliminarVilla(v) {
    delete baseDatosVillas[v];
    renderizarVillas();
    actualizarDashboard();
}

window.exportarPDF = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("REPORTE DETALLADO SOVEREIGN", 105, 20, {align:'center'});
    let y = 40;
    for (const v in baseDatosVillas) {
        const d = baseDatosVillas[v];
        doc.setFontSize(9);
        doc.text(`${v} | M:${d.mM+d.mF} | V:${d.vM+d.vF} | OP:${d.oM+d.oF} | RET:${d.sM+d.sF}`, 20, y);
        y += 10;
    }
    doc.save("Reporte_Completo.pdf");
}
