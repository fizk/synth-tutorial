import '../elements/workstation.js';
import '../machines/master.js';
import '../machines/theremin.js';
import '../elements/article.js';

window.customElements.define('pad-theremin', class extends HTMLElement {
    constructor() {
        super();
        this.context;
        this.osc;
        this.gain;
        this.analyzer;
        this.masterGain;
        this.animationFrame;
        this.handleStart = this.handleStart.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.animate = this.animate.bind(this);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-workstation slot="aside">
                <machine-theremin></machine-theremin>
                <machine-master></machine-master>
            </element-workstation>
        `;
    }

    connectedCallback() {
        const theremin = this.shadowRoot.querySelector('machine-theremin');
        theremin.addEventListener('start', this.handleStart);
        theremin.addEventListener('stop', this.handleStop);
        theremin.addEventListener('move', this.handlePlay);
    }

    disconnectedCallback() {
        cancelAnimationFrame(this.animationFrame);
    }

    handleStart(event) {
        this.context = this.context || new AudioContext();
        this.osc = this.context.createOscillator();
        this.osc.frequency.setValueAtTime(0, this.context.currentTime);
        this.osc.frequency.linearRampToValueAtTime(event.detail.frequency, this.context.currentTime + .1);
        this.gain = this.context.createGain();
        this.gain.gain.value = event.detail.amplitude;

        this.analyzer = this.context.createAnalyser();
        this.masterGain = this.context.createGain();
        this.masterGain.gain.setValueAtTime(0, this.context.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.5, this.context.currentTime + .1);

        this.osc.connect(this.gain)
            .connect(this.masterGain)
            .connect(this.analyzer)
            .connect(this.context.destination);
        this.osc.start(this.context.currentTime);

        this.animate();

        this.dispatchEvent(new CustomEvent('interact-toggle', {
            bubbles: true,
            composed: true,
        }));
    }

    handleStop() {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.context.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.03);
        this.osc.stop(this.context.currentTime + .03);

        cancelAnimationFrame(this.animationFrame);
    }

    handlePlay(event) {
        this.gain.gain.cancelAndHoldAtTime(this.context.currentTime)
        this.osc.frequency.value = event.detail.frequency;
        this.gain.gain.exponentialRampToValueAtTime(event.detail.amplitude, this.context.currentTime + 0.03);
    }

    animate() {
        // master monitor
        this.analyzer.fftSize = 2048;
        const amMasterMonitorDataArray = new Uint8Array(this.analyzer.frequencyBinCount);
        this.analyzer.getByteTimeDomainData(amMasterMonitorDataArray);

        this.analyzer.fftSize = 512;
        this.analyzer.minDecibels = -140;
        this.analyzer.maxDecibels = 0;
        const amMasterMonitorByteArray = new Uint8Array(this.analyzer.frequencyBinCount);
        this.analyzer.getByteFrequencyData(amMasterMonitorByteArray);

        const masterElement = this.shadowRoot.querySelector('machine-master');

        masterElement.frequencyData = amMasterMonitorDataArray;
        masterElement.byteData = amMasterMonitorByteArray;

        this.animationFrame = requestAnimationFrame(this.animate);
    }

});