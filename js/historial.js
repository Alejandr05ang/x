document.addEventListener('DOMContentLoaded', function() {
    mostrarEstadisticas();
    cargarHistorial();
});

function mostrarEstadisticas() {
    const stats = gameStorage.getStatistics();
    const container = document.getElementById('estadisticas');
    
    container.innerHTML = `
        <div class="estadistica-item">
            <div class="valor">${stats.totalPartidas}</div>
            <div class="label">Total Partidas</div>
        </div>
        <div class="estadistica-item">
            <div class="valor" style="color: #1892EA;">${stats.victoriasJ1}</div>
            <div class="label">Victorias J1</div>
        </div>
        <div class="estadistica-item">
            <div class="valor" style="color: #A737FF;">${stats.victoriasJ2}</div>
            <div class="label">Victorias J2</div>
        </div>
        <div class="estadistica-item">
            <div class="valor" style="color: #666;">${stats.empates}</div>
            <div class="label">Empates</div>
        </div>
        <div class="estadistica-item">
            <div class="valor">${stats.promedioMovimientos}</div>
            <div class="label">Promedio Movs.</div>
        </div>
        <div class="estadistica-item">
            <div class="valor">${GameStorage.formatDuration(stats.promedioDuracion)}</div>
            <div class="label">Duración Prom.</div>
        </div>
    `;
}

/**
 * Carga y muestra el historial de partidas en la tabla
 * @param {Array} partidas - Array de partidas a mostrar (opcional)
 */
function cargarHistorial(partidas = null) {
    const tbody = document.getElementById('tablaBody');
    const games = partidas || gameStorage.getAllGames();

    if (games.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="no-datos">
                    No hay partidas registradas aún.<br>
                    ¡Juega algunas partidas para ver el historial!
                </td>
            </tr>
        `;
        return;
    }

    games.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    tbody.innerHTML = games.map(game => {
        let ganadorBadge = '';
        if (game.ganador === 'Empate') {
            ganadorBadge = '<span class="ganador-badge ganador-empate">Empate</span>';
        } else if (game.ganador === game.jugador1 || game.ganador === 'jugador1') {
            ganadorBadge = `<span class="ganador-badge ganador-j1">${game.jugador1}</span>`;
        } else if (game.ganador === game.jugador2 || game.ganador === 'jugador2') {
            ganadorBadge = `<span class="ganador-badge ganador-j2">${game.jugador2}</span>`;
        }

        return `
            <tr>
                <td>${GameStorage.formatDate(game.fecha)}</td>
                <td>${game.jugador1}</td>
                <td>${game.jugador2}</td>
                <td>${ganadorBadge}</td>
                <td>${GameStorage.formatDuration(game.duracion)}</td>
                <td>${game.movimientos}</td>
            </tr>
        `;
    }).join('');
}

function aplicarFiltros() {
    const ganador = document.getElementById('filtroGanador').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    const filtros = {
        ganador: ganador !== 'Todos' ? ganador : null,
        fechaInicio: fechaInicio || null,
        fechaFin: fechaFin || null
    };

    const partidasFiltradas = gameStorage.applyFilters(filtros);
    cargarHistorial(partidasFiltradas);
}

function exportarHistorial() {
    const ganador = document.getElementById('filtroGanador').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    if (ganador !== 'Todos' || fechaInicio || fechaFin) {
        const filtros = {
            ganador: ganador !== 'Todos' ? ganador : null,
            fechaInicio: fechaInicio || null,
            fechaFin: fechaFin || null
        };
        const partidasFiltradas = gameStorage.applyFilters(filtros);
        gameStorage.exportToJSON(partidasFiltradas);
    } else {
        gameStorage.exportToJSON();
    }
}

function limpiarHistorial() {
    if (gameStorage.clearHistory()) {
        cargarHistorial();
        mostrarEstadisticas();
        alert('Historial limpiado correctamente');
    }
}
