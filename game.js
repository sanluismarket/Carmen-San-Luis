// Datos del Juego
const LOCATIONS = [
    {
        id: 'san_luis',
        name: 'San Luis Capital',
        description: 'La capital histórica, fundada en 1594. Se ven las sierras de fondo.',
        clues: [
            "Dijo que quería ver el Hito del Bicentenario.",
            "Compró alfajores puntanos para el viaje.",
            "Mencionó que iba hacia donde el clima es más fresco."
        ],
        connections: ['potrero', 'merlo', 'villa_mercedes']
    },
    {
        id: 'potrero',
        name: 'Potrero de los Funes',
        description: 'Famoso por su lago y el circuito internacional de carreras.',
        clues: [
            "Estaba admirando el Hotel Internacional.",
            "Preguntó por el alquiler de botes en el lago.",
            "Llevaba ropa deportiva, como para escalar sierras."
        ],
        connections: ['san_luis', 'trapiche']
    },
    {
        id: 'merlo',
        name: 'Villa de Merlo',
        description: 'Conocida por su microclima y el aire puro.',
        clues: [
            "Hablaba mucho sobre el 'Abuelo Algarrobo'.",
            "Compró hierbas serranas en una tienda local.",
            "Dijo que quería ver el reloj de sol."
        ],
        connections: ['san_luis', 'concaran']
    },
    {
        id: 'villa_mercedes',
        name: 'Villa Mercedes',
        description: 'La ciudad de la Calle Angosta, cuna de guitarras.',
        clues: [
            "Cantaba una cueca cuyana muy bajito.",
            "Preguntó dónde queda el Parque La Pedrera.",
            "Tenía prisa por llegar al río Quinto."
        ],
        connections: ['san_luis', 'justo_daract']
    },
    {
        id: 'trapiche',
        name: 'El Trapiche',
        description: 'Un lugar tranquilo entre sierras y ríos.',
        clues: [
            "Estaba comiendo un asado cerca del río.",
            "Preguntó por el camino a La Florida.",
            "Parecía buscar tranquilidad en las cabañas."
        ],
        connections: ['potrero']
    },
    {
        id: 'concaran',
        name: 'Concarán',
        description: 'En el Valle del Conlara, cerca de minas antiguas.',
        clues: [
            "Preguntó por las pinturas rupestres.",
            "Llevaba un mapa de las minas de la zona.",
            "Dijo que le interesaba la historia minera."
        ],
        connections: ['merlo']
    },
    {
        id: 'justo_daract',
        name: 'Justo Daract',
        description: 'Ciudad ferroviaria y del tango.',
        clues: [
            "Tarareaba un tango mientras esperaba.",
            "Preguntó por los horarios del tren.",
            "Miraba con nostalgia las vías del ferrocarril."
        ],
        connections: ['villa_mercedes']
    }
];

const SUSPECTS = [
    {
        name: "Carmen San Luis",
        sex: "Femenino",
        hair: "Negro",
        feature: "Joya",
        vehicle: "Auto Clasico"
    },
    {
        name: "El Gato Puntano",
        sex: "Masculino",
        hair: "Negro",
        feature: "Cicatriz",
        vehicle: "Moto"
    },
    {
        name: "La Rubia de la Sierra",
        sex: "Femenino",
        hair: "Rubio",
        feature: "Tatuaje",
        vehicle: "Camioneta"
    },
    {
        name: "El Colorado",
        sex: "Masculino",
        hair: "Rojo",
        feature: "Tatuaje",
        vehicle: "Camioneta"
    }
];

// Auspiciantes globales
const SPONSORS = [
    { name: "Asados La Posta", text: "El mejor asado puntano", url: "https://example.com/asados", image: "" },
    { name: "Cafetería El Algarrobo", text: "Infusiones serranas desde 1950", url: "https://example.com/cafe", image: "" },
    { name: "Hostería de la Sierra", text: "Descanso con vistas serranas", url: "https://example.com/hosteria", image: "" }
];

// Asignar auspiciantes a algunas ubicaciones
const _ls = LOCATIONS.find(l => l.id === 'san_luis'); if (_ls) _ls.sponsor = 0;
const _m = LOCATIONS.find(l => l.id === 'merlo'); if (_m) _m.sponsor = 1;
const _p = LOCATIONS.find(l => l.id === 'potrero'); if (_p) _p.sponsor = 2;

const game = {
    currentLocation: null,
    thiefPath: [],
    thief: null,
    daysLeft: 7,
    hours: 9,
    warrant: null,
    previousLocation: null,

    init: function () {
        SoundManager.playStart();
        this.thief = SUSPECTS[Math.floor(Math.random() * SUSPECTS.length)];

        let path = [];
        let current = LOCATIONS[0];
        path.push(current);

        for (let i = 0; i < 3; i++) {
            let nextId = current.connections[Math.floor(Math.random() * current.connections.length)];
            current = LOCATIONS.find(l => l.id === nextId);
            path.push(current);
        }
        this.thiefPath = path;
        this.currentLocation = LOCATIONS[0];
        this.daysLeft = 7;
        this.hours = 9;
        this.warrant = null;
        this.previousLocation = null;

        ui.updateLocation();
        ui.updateTime();
        ui.log("¡El robo ha sido reportado! El sospechoso fue visto por última vez en " + this.currentLocation.name);
    },

    advanceTime: function (hours, triggerGameOver = true) {
        this.hours += hours;
        if (this.hours >= 22) {
            this.hours = 8;
            this.daysLeft--;
            ui.log("Has tenido que dormir. Un día menos.");
        }
        ui.updateTime();
        if (triggerGameOver && this.daysLeft <= 0) {
            this.gameOver(false);
        }
    },

    travel: function (destId) {
        // No se puede viajar si todavía no hay ubicación inicial
        if (!this.currentLocation) {
            SoundManager.playError();
            ui.log("Aún no sabes desde dónde viajar. Inicia la misión primero.");
            ui.closeModal('travel-modal');
            return;
        }

        SoundManager.playTravel();
        const dest = LOCATIONS.find(l => l.id === destId);
        if (!dest) {
            SoundManager.playError();
            ui.log("Destino inválido. No se puede viajar.");
            ui.closeModal('travel-modal');
            return;
        }

        this.previousLocation = this.currentLocation;
        this.currentLocation = dest;
        // No detonar Game Over inmediatamente por tiempo, primero verificar captura
        this.advanceTime(4, false);
        ui.updateLocation();
        ui.log("Has viajado a " + dest.name);
        ui.closeModal('travel-modal');

        // Aviso al jugador si intenta llegar al lugar final sin orden de arresto
        const lastLoc = this.thiefPath && this.thiefPath.length ? this.thiefPath[this.thiefPath.length - 1] : null;
        if (lastLoc && dest.id === lastLoc.id && !this.warrant) {
            ui.log("AVISO: Parece que este es el lugar final donde podría estar el sospechoso. Emitir una orden antes de intentar detenerlo.");
        }

        this.checkCatch();

        // Si después de verificar captura (y no ganar) se acabó el tiempo, entonces perder
        if (this.daysLeft <= 0) {
            this.gameOver(false);
        }
    },

    investigate: function () {
        // Si el juego no fue inicializado, evitar errores
        if (!this.currentLocation) {
            SoundManager.playError();
            ui.log("Primero debes iniciar la misión antes de investigar.");
            return;
        }

        SoundManager.playInvestigate();
        this.advanceTime(2);

        // Lógica inteligente para encontrar el índice correcto en el camino (manejando bucles)
        let pathIndex = -1;
        const indices = [];
        this.thiefPath.forEach((loc, idx) => {
            if (loc.id === this.currentLocation.id) indices.push(idx);
        });

        if (indices.length === 0) {
            pathIndex = -1;
        } else if (indices.length === 1) {
            pathIndex = indices[0];
        } else {
            // Hay bucles/visitas múltiples. Usar previousLocation para desambiguar.
            // Buscamos un índice tal que thiefPath[index - 1] sea previousLocation
            if (this.previousLocation) {
                const match = indices.find(idx => idx > 0 && this.thiefPath[idx - 1].id === this.previousLocation.id);
                if (match !== undefined) {
                    pathIndex = match;
                } else {
                    // Si no coincide con el anterior, quizás estamos en el inicio o nos desviamos.
                    // Por defecto tomamos el último visitado (asumiendo progreso) o el primero.
                    // Mejor estrategia: tomar el mayor índice que sea menor al final (para dar pistas)
                    pathIndex = indices[indices.length - 1];
                }
            } else {
                // Si no hay previousLocation, estamos al inicio
                pathIndex = indices[0];
            }
        }
        let clues = [];

        if (pathIndex !== -1 && pathIndex < this.thiefPath.length - 1) {
            const nextLocation = this.thiefPath[pathIndex + 1];
            const clue = nextLocation.clues[Math.floor(Math.random() * nextLocation.clues.length)];
            clues.push(`Un testigo dice: "${clue}"`);
            SoundManager.playClue();
            if (Math.random() > 0.5) {
                clues.push(this.getThiefClue());
            }
        } else if (pathIndex === this.thiefPath.length - 1) {
            clues.push("¡La gente está muy nerviosa! Alguien sospechoso anda cerca.");
            clues.push(this.getThiefClue());
            SoundManager.playClue();
        } else {
            clues.push("Nadie ha visto nada sospechoso por aquí.");
        }
        ui.showWitnesses(clues);
    },

    finalizeWarrant: function (name) {
        this.warrant = name;
        document.getElementById('warrant-status').innerText = "ORDEN EMITIDA PARA: " + this.warrant;
        document.getElementById('warrant-status').style.color = "var(--terminal-green)";
        const wm = document.getElementById('warrant-matches');
        if (wm) wm.innerHTML = '';
        ui.log("(DEBUG) Orden emitida: " + this.warrant);
    },

    normalize: function (s) {
        if (!s) return '';
        try {
            return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLowerCase();
        } catch (e) {
            return s.replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
        }
    },

    getThiefClue: function () {
        const traits = ['sex', 'hair', 'feature', 'vehicle'];
        const trait = traits[Math.floor(Math.random() * traits.length)];
        const value = this.thief[trait];
        switch (trait) {
            case 'sex': return `El sospechoso era de sexo ${value}.`;
            case 'hair': return `Tenía el cabello ${value}.`;
            case 'feature': return `Le noté algo: ${value}.`;
            case 'vehicle': return `Se fue en ${value}.`;
        }
    },

    showInvestigate: function () {
        ui.openModal('investigate-modal');
        this.investigate();
    },

    showTravel: function () {
        ui.renderDestinations();
        ui.openModal('travel-modal');
    },

    showComputer: function () {
        SoundManager.playComputer();
        ui.openModal('computer-modal');
    },

    issueWarrant: function () {
        SoundManager.playComputer();
        const sex = document.getElementById('w-sex').value;
        const hair = document.getElementById('w-hair').value;
        const feature = document.getElementById('w-feature').value;
        const vehicle = document.getElementById('w-vehicle').value;

        const matches = SUSPECTS.filter(s =>
            (!sex || s.sex === sex) &&
            (!hair || s.hair === hair) &&
            (!feature || s.feature === feature) &&
            (!vehicle || s.vehicle === vehicle)
        );

        const status = document.getElementById('warrant-status');
        const wm = document.getElementById('warrant-matches');
        if (!status) return;

        if (matches.length === 0) {
            SoundManager.playError();
            status.innerText = "ERROR: Ningún sospechoso coincide.";
            status.style.color = "red";
            if (wm) wm.innerHTML = '';
            return;
        }

        if (matches.length === 1) {
            SoundManager.playWarrant();
            this.finalizeWarrant(matches[0].name);
            return;
        }

        status.innerText = `Múltiples coincidencias: ${matches.length}. Seleccione para emitir.`;
        status.style.color = "yellow";
        if (wm) {
            wm.innerHTML = '';
            matches.forEach(m => {
                const btn = document.createElement('button');
                btn.className = 'match-btn';
                btn.innerText = m.name;
                btn.onclick = () => {
                    SoundManager.playWarrant();
                    this.finalizeWarrant(m.name);
                };
                wm.appendChild(btn);
            });
        }
    },

    checkCatch: function () {
        if (!this.thiefPath || this.thiefPath.length === 0) return;
        const lastLoc = this.thiefPath[this.thiefPath.length - 1];
        if (!lastLoc) return;

        if (this.currentLocation && this.currentLocation.id === lastLoc.id) {
            // comparar nombres de forma tolerante (sin tildes, espacios, mayúsculas)
            const warrantNorm = this.normalize(this.warrant);
            const thiefNorm = this.normalize(this.thief.name);
            ui.log("(DEBUG) Comparando orden: '" + warrantNorm + "' vs sospechoso: '" + thiefNorm + "'");

            // Sin orden: solo aviso, no Game Over todavía.
            if (!this.warrant) {
                SoundManager.playError();
                ui.log("Parece que el sospechoso podría estar aquí, pero aún no tienes una orden de arresto. Vuelve cuando la tengas.");
                return;
            }

            if (warrantNorm === thiefNorm) {
                SoundManager.playSuccess();
                this.gameOver(true);
            } else {
                SoundManager.playError();
                ui.log("¡Encontraste al sospechoso pero la orden es incorrecta! Escapó.");
                this.gameOver(false);
            }
        }
    },

    gameOver: function (win) {
        if (win) {
            setTimeout(() => {
                alert(`¡FELICIDADES! Has capturado a ${this.thief.name} y recuperado el tesoro.`);
                location.reload();
            }, 800);
        } else {
            setTimeout(() => {
                alert("JUEGO TERMINADO. El ladrón ha escapado.");
                location.reload();
            }, 600);
        }
    }
};

// UI Controller
const ui = {
    updateLocation: function () {
        if (!game.currentLocation) return;

        const locDisplay = document.getElementById('location-display');
        if (locDisplay) {
            locDisplay.innerText = "UBICACIÓN: " + game.currentLocation.name;
        }

        const locationImg = document.getElementById('location-img');
        if (locationImg) {
            locationImg.src = game.currentLocation.id + ".png";
            locationImg.alt = game.currentLocation.name;
            locationImg.style.display = 'block';
        }

        const msg = `\n\nLlegaste a ${game.currentLocation.name}. ${game.currentLocation.description}`;
        const area = document.getElementById('message-text');
        if (area) {
            area.innerText += msg;
            area.scrollTop = area.scrollHeight;
        }

        ui.showSponsor();
        ui.renderLocationActions();
    },

    updateTime: function () {
        const t = document.getElementById('time-display');
        if (!t) return;
        t.innerText = `DÍAS RESTANTES: ${game.daysLeft} | HORA: ${game.hours}:00`;
    },

    log: function (msg) {
        const area = document.getElementById('message-text');
        if (!area) return;
        area.innerText += "\n> " + msg;
        area.scrollTop = area.scrollHeight;
    },

    openModal: function (id) {
        document.getElementById(id).classList.remove('hidden');
    },

    closeModal: function (id) {
        document.getElementById(id).classList.add('hidden');
    },

    renderDestinations: function () {
        const list = document.getElementById('destinations-list');
        if (!list || !game.currentLocation || !Array.isArray(game.currentLocation.connections)) return;
        list.innerHTML = '';
        game.currentLocation.connections.forEach(connId => {
            const loc = LOCATIONS.find(l => l.id === connId);
            if (!loc) return;
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.innerText = loc.name;
            btn.onclick = () => game.travel(connId);
            list.appendChild(btn);
        });
    },

    renderLocationActions: function () {
        const container = document.getElementById('location-actions');
        if (!container) return;
        container.innerHTML = '';

        const inv = document.createElement('button');
        inv.className = 'loc-action-btn';
        inv.innerText = 'INVESTIGAR (rápido)';
        inv.onclick = () => game.showInvestigate();
        container.appendChild(inv);

        const pc = document.createElement('button');
        pc.className = 'loc-action-btn';
        pc.innerText = 'COMPUTADORA';
        pc.onclick = () => game.showComputer();
        container.appendChild(pc);

        if (game.currentLocation && Array.isArray(game.currentLocation.connections)) {
            game.currentLocation.connections.forEach(connId => {
                const loc = LOCATIONS.find(l => l.id === connId);
                if (!loc) return;
                const b = document.createElement('button');
                b.className = 'loc-action-btn';
                b.innerText = 'VIAJAR → ' + loc.name;
                b.onclick = () => game.travel(connId);
                container.appendChild(b);
            });
        }
    },

    showWitnesses: function (clues) {
        const list = document.getElementById('witnesses-list');
        list.innerHTML = '';
        if (clues.length === 0) {
            list.innerHTML = "<p>No encontraste a nadie.</p>";
            return;
        }
        clues.forEach(clue => {
            const p = document.createElement('p');
            p.innerText = clue;
            p.style.borderBottom = "1px dashed #33ff00";
            p.style.padding = "10px";
            list.appendChild(p);
        });
    },

    showSponsor: function () {
        const sponsorArea = document.getElementById('sponsor-area');
        const nameEl = document.getElementById('sponsor-name');
        const copyEl = document.getElementById('sponsor-copy');
        const imgEl = document.getElementById('sponsor-img');
        if (!sponsorArea || !nameEl || !copyEl) return;

        let s = null;
        if (game && game.currentLocation && typeof game.currentLocation.sponsor === 'number') {
            s = SPONSORS[game.currentLocation.sponsor];
        }
        if (!s) {
            s = SPONSORS[Math.floor(Math.random() * SPONSORS.length)];
        }
        if (!s) return;

        nameEl.innerText = s.name;
        copyEl.innerText = s.text;

        if (imgEl) {
            if (s.image) {
                imgEl.src = s.image;
                imgEl.style.display = '';
            } else {
                imgEl.style.display = 'none';
            }
        }

        sponsorArea.onclick = () => {
            if (s.url && s.url !== '#') {
                try { window.open(s.url, '_blank'); } catch (e) { window.location.href = s.url; }
            }
        };
    }
};

// Event Listeners
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('main-interface').classList.remove('hidden');
    game.init();
});
