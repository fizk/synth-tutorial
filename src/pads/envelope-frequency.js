import '../elements/workstation.js';
import '../machines/trigger.js';
import '../machines/adsr.js';

window.customElements.define('pad-envelope-frequency', class extends HTMLElement {
    constructor() {
        super();

        this.context;
        this.osc;
        this.gain;
        this.animationFrame;
        this.animationTime;
        this.handleStart = this.handleStart.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.attackAnimation = this.attackAnimation.bind(this);
        this.releaseAnimation = this.releaseAnimation.bind(this);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-workstation slot="aside">
                <machine-trigger></machine-trigger>
                <machine-adsr width="400" height="100"></machine-adsr>
            </element-workstation>
        `;
    }

    connectedCallback() {
        this.addEventListener('start', this.handleStart);
        this.addEventListener('stop', this.handleStop);
    }

    disconnectedCallback() {
        cancelAnimationFrame(this.animationFrame);
    }

    handleStart() {
        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');
        const a = Number(envelopeElement.getAttribute('a')) / 100;
        const d = Number(envelopeElement.getAttribute('d')) / 100;
        const s = Number(envelopeElement.getAttribute('s')) / 100;
        const sustainFrequency = (880 - 220) * s + 220;

        this.context = new AudioContext();
        this.osc = this.context.createOscillator();
        this.osc.frequency.value = 220;
        this.osc.frequency.linearRampToValueAtTime(880, this.context.currentTime + a);
        this.osc.frequency.linearRampToValueAtTime(sustainFrequency, this.context.currentTime + a + d);

        const analyser = this.context.createAnalyser();
        this.gain = this.context.createGain();
        this.gain.gain.setValueAtTime(0, this.context.currentTime);
        this.gain.gain.linearRampToValueAtTime(0.5, this.context.currentTime + .01);

        this.osc.connect(this.gain)
        this.gain.connect(analyser);
        analyser.connect(this.context.destination);

        this.osc.start(this.context.currentTime);

        cancelAnimationFrame(this.animationFrame);
        this.animationTime = undefined;
        this.attackAnimation(0);
    }

    handleStop() {
        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');
        const r = Number(envelopeElement.getAttribute('r')) / 100;
        const s = Number(envelopeElement.getAttribute('s')) / 100;
        const sustainFrequency = (880 - 220) * s + 220;

        this.osc.frequency.cancelAndHoldAtTime(this.context.currentTime);
        this.osc.frequency.linearRampToValueAtTime(sustainFrequency, this.context.currentTime);
        this.osc.frequency.linearRampToValueAtTime(220, this.context.currentTime + r);
        this.osc.stop(this.context.currentTime + r);

        this.gain.gain.setValueAtTime(0.5, (this.context.currentTime + r) - .01);
        this.gain.gain.linearRampToValueAtTime(0.01, this.context.currentTime + r);

        cancelAnimationFrame(this.animationFrame);
        this.animationTime = undefined;
        this.releaseAnimation(0);
    }

    disconnectedCallback() {
        this.osc && this.osc.stop(this.context.currentTime);
        cancelAnimationFrame(this.animationFrame);
    }

    attackAnimation(time) {
        if (!this.animationTime) {
            this.animationTime = time
        };
        const progress = time - this.animationTime;

        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');

        const a = Number(envelopeElement.getAttribute('a'));
        const d = Number(envelopeElement.getAttribute('d'));
        const sumTime = (a + d) * 10;

        const larp = (((a + d) / 4) - 0) * ((1 / sumTime) * progress) + 0;

        if (progress < sumTime) {
            envelopeElement.setAttribute('cursor', Number(larp));
            this.animationFrame = requestAnimationFrame(this.attackAnimation)
        }
    }

    releaseAnimation(time) {
        if (!this.animationTime) {
            this.animationTime = time
        };
        const progress = time - this.animationTime;

        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');
        const r = Number(envelopeElement.getAttribute('r'));
        const max = 100;
        const min = max - (r / 4);

        const larp = (max - min) * ((1 / (r * 10)) * progress) + min;

        if (progress < (r * 100)) {
            envelopeElement.setAttribute('cursor', Number(larp));
            this.animationFrame = requestAnimationFrame(this.releaseAnimation)
        } else {
            cancelAnimationFrame(this.animationFrame);
            this.animationTime = undefined;
        }
    }
});