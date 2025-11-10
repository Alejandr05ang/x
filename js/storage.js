const STORAGE_NAMESPACE = 'ppw-tresenraya';
const STORAGE_KEYS = {
    HISTORY: `${STORAGE_NAMESPACE}:history`,
    CONFIG: `${STORAGE_NAMESPACE}:config`,
    PLAYERS: `${STORAGE_NAMESPACE}:players`
};

class GameStorage {
    constructor() {
        this.history = this.loadHistory();
    }

    /**
     * Carga el historial desde localStorage
     * @returns {Array} Array de partidas
     */
    loadHistory() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al cargar historial:', error);
            return [];
        }
    }

    /**
     * Guarda el historial en localStorage
     * @param {Array} history - Array de partidas
     */
    saveHistory(history) {
        try {
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
            this.history = history;
        } catch (error) {
            console.error('Error al guardar historial:', error);
        }
    }

    /**
     * Registra una nueva partida finalizada
     * @param {Object} gameData - Datos de la partida
     * @returns {Object} La partida registrada
     */
    registerGame(gameData) {
        const partida = {
            id: this.generateId(),
            jugador1: gameData.jugador1 || 'JUGADOR1',
            jugador2: gameData.jugador2 || 'JUGADOR2',
            ganador: gameData.ganador || 'Empate', // 'jugador1', 'jugador2', o 'Empate'
            duracion: gameData.duracion || 0, // en milisegundos
            movimientos: gameData.movimientos || 0,
            fecha: new Date().toISOString(), // ISO 8601 local
            avatarJ1: gameData.avatarJ1 || '',
            avatarJ2: gameData.avatarJ2 || ''
        };

        this.history.push(partida);
        this.saveHistory(this.history);
        return partida;
    }

    /**
     * Genera un ID único para cada partida
     * @returns {string} ID único
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Obtiene todas las partidas
     * @returns {Array} Array de partidas
     */
    getAllGames() {
        return [...this.history];
    }

    /**
     * Filtra partidas por ganador
     * @param {string} winner - 'J1', 'J2', 'Empate', o nombre del jugador
     * @returns {Array} Partidas filtradas
     */
    filterByWinner(winner) {
        if (!winner || winner === 'Todos') return this.history;
        
        return this.history.filter(game => {
            if (winner === 'J1' || winner === 'jugador1') {
                return game.ganador === game.jugador1 || game.ganador === 'jugador1';
            }
            if (winner === 'J2' || winner === 'jugador2') {
                return game.ganador === game.jugador2 || game.ganador === 'jugador2';
            }
            if (winner === 'Empate') {
                return game.ganador === 'Empate';
            }
            return game.ganador === winner;
        });
    }

    /**
     * Filtra partidas por rango de fechas
     * @param {string|Date} startDate - Fecha de inicio
     * @param {string|Date} endDate - Fecha de fin
     * @returns {Array} Partidas filtradas
     */
    filterByDateRange(startDate, endDate) {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        // Ajustar end date al final del día
        if (end) {
            end.setHours(23, 59, 59, 999);
        }

        return this.history.filter(game => {
            const gameDate = new Date(game.fecha);
            
            if (start && end) {
                return gameDate >= start && gameDate <= end;
            }
            if (start) {
                return gameDate >= start;
            }
            if (end) {
                return gameDate <= end;
            }
            return true;
        });
    }

    /**
     * Aplica múltiples filtros a las partidas
     * @param {Object} filters - Objeto con filtros {ganador, fechaInicio, fechaFin}
     * @returns {Array} Partidas filtradas
     */
    applyFilters(filters = {}) {
        let result = [...this.history];

        if (filters.ganador && filters.ganador !== 'Todos') {
            result = result.filter(game => {
                if (filters.ganador === 'J1' || filters.ganador === 'jugador1') {
                    return game.ganador === game.jugador1 || game.ganador === 'jugador1';
                }
                if (filters.ganador === 'J2' || filters.ganador === 'jugador2') {
                    return game.ganador === game.jugador2 || game.ganador === 'jugador2';
                }
                if (filters.ganador === 'Empate') {
                    return game.ganador === 'Empate';
                }
                return game.ganador === filters.ganador;
            });
        }

        if (filters.fechaInicio || filters.fechaFin) {
            const start = filters.fechaInicio ? new Date(filters.fechaInicio) : null;
            const end = filters.fechaFin ? new Date(filters.fechaFin) : null;

            if (end) {
                end.setHours(23, 59, 59, 999);
            }

            result = result.filter(game => {
                const gameDate = new Date(game.fecha);
                
                if (start && end) {
                    return gameDate >= start && gameDate <= end;
                }
                if (start) {
                    return gameDate >= start;
                }
                if (end) {
                    return gameDate <= end;
                }
                return true;
            });
        }

        return result;
    }

    /**
     * Exporta el historial a JSON y descarga el archivo
     * @param {Array} games - Array de partidas a exportar (opcional, por defecto todas)
     */
    exportToJSON(games = null) {
        const dataToExport = games || this.history;
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tres-en-raya-historial-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Limpia todo el historial con confirmación
     * @returns {boolean} true si se limpió, false si se canceló
     */
    clearHistory() {
        const confirmacion = confirm(
            '¿Estás seguro de que deseas eliminar todo el historial de partidas?\n\n' +
            'Esta acción no se puede deshacer.'
        );

        if (confirmacion) {
            this.history = [];
            this.saveHistory([]);
            return true;
        }
        return false;
    }

    /**
     * Elimina una partida específica por ID
     * @param {string} gameId - ID de la partida
     * @returns {boolean} true si se eliminó, false si no se encontró
     */
    deleteGame(gameId) {
        const index = this.history.findIndex(game => game.id === gameId);
        if (index !== -1) {
            this.history.splice(index, 1);
            this.saveHistory(this.history);
            return true;
        }
        return false;
    }

    /**
     * Guarda la configuración de jugadores para la próxima partida
     * @param {Object} playersData - {jugador1, jugador2, primerTurno, avatarJ1, avatarJ2}
     */
    savePlayers(playersData) {
        try {
            localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(playersData));
        } catch (error) {
            console.error('Error al guardar jugadores:', error);
        }
    }

    /**
     * Carga la configuración de jugadores guardada
     * @returns {Object|null} Datos de jugadores o null
     */
    loadPlayers() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error al cargar jugadores:', error);
            return null;
        }
    }

    /**
     * Obtiene estadísticas generales
     * @returns {Object} Objeto con estadísticas
     */
    getStatistics() {
        const total = this.history.length;
        let j1Wins = 0;
        let j2Wins = 0;
        let empates = 0;
        let totalMovimientos = 0;
        let totalDuracion = 0;

        this.history.forEach(game => {
            if (game.ganador === game.jugador1 || game.ganador === 'jugador1') {
                j1Wins++;
            } else if (game.ganador === game.jugador2 || game.ganador === 'jugador2') {
                j2Wins++;
            } else if (game.ganador === 'Empate') {
                empates++;
            }
            totalMovimientos += game.movimientos;
            totalDuracion += game.duracion;
        });

        return {
            totalPartidas: total,
            victoriasJ1: j1Wins,
            victoriasJ2: j2Wins,
            empates: empates,
            promedioMovimientos: total > 0 ? (totalMovimientos / total).toFixed(1) : 0,
            promedioDuracion: total > 0 ? Math.round(totalDuracion / total) : 0,
            duracionTotal: totalDuracion
        };
    }

    /**
     * Formatea la duración en formato legible
     * @param {number} ms - Milisegundos
     * @returns {string} Duración formateada (mm:ss)
     */
    static formatDuration(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    /**
     * Formatea una fecha ISO a formato local legible
     * @param {string} isoDate - Fecha en formato ISO
     * @returns {string} Fecha formateada
     */
    static formatDate(isoDate) {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
}

const gameStorage = new GameStorage();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameStorage, gameStorage, STORAGE_NAMESPACE, STORAGE_KEYS };
}
