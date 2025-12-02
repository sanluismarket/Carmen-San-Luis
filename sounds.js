// Sistema de Sonidos Retro para Carmen San Luis
// Usa Web Audio API para generar sonidos estilo años 80

const SoundManager = {
    audioContext: null,
    enabled: true,

    init: function () {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API no soportada');
            this.enabled = false;
        }
    },

    // Sonido de pasos/caminar
    playWalk: function () {
        if (!this.enabled) return;
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 100;
        osc.type = 'square';

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    },

    // Sonido de viajar (más largo)
    playTravel: function () {
        if (!this.enabled) return;
        const ctx = this.audioContext;

        // Crear una secuencia de tonos ascendentes
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.value = 200 + (i * 100);
                osc.type = 'square';

                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.2);
            }, i * 100);
        }
    },

    // Sonido de investigar
    playInvestigate: function () {
        if (!this.enabled) return;
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 400;
        osc.type = 'sine';

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    },

    // Sonido de encontrar pista
    playClue: function () {
        if (!this.enabled) return;
        const ctx = this.audioContext;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.frequency.value = 600;
        osc2.frequency.value = 800;
        osc1.type = 'sine';
        osc2.type = 'sine';

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.4);
        osc2.stop(ctx.currentTime + 0.4);
    },

    // Sonido de computadora/typing
    playComputer: function () {
        if (!this.enabled) return;
        const ctx = this.audioContext;

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.value = 800 + Math.random() * 200;
                osc.type = 'square';

                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.05);
            }, i * 50);
        }
    },

    // Sonido de éxito/victoria
    playSuccess: function () {
        if (!this.enabled) return;
        const ctx = this.audioContext;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.value = freq;
                osc.type = 'square';

                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            }, i * 150);
        });
    },

    // Sonido de error/fallo
    playError: function () {
        if (!this.enabled) return;
        const ctx = this.audioContext;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
        osc.type = 'sawtooth';

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    },

    // Sonido de emitir orden
    playWarrant: function () {
        if (!this.enabled) return;
        const ctx = this.audioContext;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 300;
        osc.type = 'triangle';

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
    },

    // Sonido ambiente/inicio
    playStart: function () {
        if (!this.enabled) return;
        const ctx = this.audioContext;

        const notes = [261.63, 329.63, 392.00]; // C, E, G
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.value = freq;
                osc.type = 'sine';

                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.4);
            }, i * 200);
        });
    }
};

// Inicializar al cargar
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        SoundManager.init();
    });
}
