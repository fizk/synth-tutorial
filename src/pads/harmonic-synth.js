import '../elements/workstation.js';
import '../elements/sine-wave.js';
import '../machines/master.js';
import '../machines/keyboard.js';
import '../machines/toggle.js';

window.customElements.define('pad-harmonic-synth', class extends HTMLElement {
    constructor() {
        super();
        this.masterElement;
        this.masterContext
        this.masterAnalyze;
        this.masterMachines;
        this.masterGain;

        this.amplitudeFunctions = {
            // In a pure sine wave we only play the fundamental frequency.
            sine: (index) => index === 0 ? 1 : 0,
            // In a sawtooth wave we play all frequencies with descending amplitudes.
            saw: (index) => 1 / (index + 1),
            // In a square wave we only play odd harmonics with descending amplitudes.
            // (Here we check if the number is even, not odd, because 0 is the fundamental.)
            square: (index) => index % 2 === 0 ? 1 / (index + 1) : 0,
            // 1/Harmonic Number Squared
            //The ratio 1/harmonic number squared means that the first harmonic has an amplitude of 1/1,
            // or 1; that the third harmonic will have an amplitude of 1/9 (one ninth the strength of the fundamental);
            // the fifth harmonic will have an amplitude of 1/25 (one twenty-fifth the strength of the fundamental), and so on.
            tri: (index) => (index % 2 === 0) ? 1 / Math.pow(2, index) : 0,
        }
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-workstation>
                <machine-toggle></machine-toggle>
                <ul>
                    <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
                    <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
                    <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
                    <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
                    <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
                    <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
                    <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
                    <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
                    <li><input type="range" min="0" step=".001" max="1" /><span></span></li>
                </ul>
                <machine-master></machine-master>
            </element-workstation>
        `;

        this.animation = this.animation.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.togglePreset = this.togglePreset.bind(this);
    }

    static get observedAttributes() { return ['type']; }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'type':
                ['sine', 'saw', 'square', 'tri'].indexOf(newValue) >= 0 && this.togglePreset(newValue);
                break;
        }
    }

    connectedCallback() {
        this.shadowRoot.querySelector('machine-toggle').addEventListener('toggle', this.handleToggle);
    }

    disconnectedCallback() {
        cancelAnimationFrame(this.animationFrame);
        this.masterMachines && this.masterMachines.forEach(item => {
            item.osc.stop(this.masterContext.currentTime);
        });
    }

    togglePreset(type) {
        const workstationElement = this.shadowRoot.querySelector('element-workstation');
        const listElements = workstationElement.querySelectorAll('li');
        this.masterMachines && this.masterMachines.forEach((item, i) => {
            const amplitude = this.amplitudeFunctions[type](i);
            listElements[i].querySelector('input').value = amplitude
            listElements[i].querySelector('span').innerHTML = amplitude.toFixed(2);
            item.gain.gain.value = amplitude;
        });
    }

    handleToggle(event) {
        if (event.detail) {
            const workstationElement = this.shadowRoot.querySelector('element-workstation');
            const listElements = workstationElement.querySelectorAll('li');

            this.masterContext = new AudioContext();
            this.masterMachines = Array.from({ length: 9 }).map((_, i) => {
                const osc = this.masterContext.createOscillator();
                osc.frequency.value = 440 * (1 + i)
                const gain = this.masterContext.createGain();
                gain.gain.value = i === 0 ? 1 : 0;
                listElements[i].querySelector('input').value = i === 0 ? 1 : 0;
                listElements[i].querySelector('span').innerHTML = i === 0 ? 1 : 0;


                listElements[i].querySelector('input').addEventListener('input', (event) => {
                    gain.gain.value = Number(event.target.value);
                    this.dispatchEvent(new CustomEvent('change', {
                        composed: true,
                        detail: {
                            value: Number(event.target.value),
                            position: i,
                        },
                    }));
                })

                osc.connect(gain);
                return {
                    osc,
                    gain,
                }
            });
            const gain = this.masterContext.createGain();
            gain.gain.value = .5;
            this.masterAnalyze = this.masterContext.createAnalyser();
            this.masterMachines.forEach(item => {
                item.gain.connect(gain);
            });
            gain.connect(this.masterAnalyze);
            this.masterAnalyze.connect(this.masterContext.destination)
            this.masterMachines.forEach(item => {
                item.osc.start(this.masterContext.currentTime);
            });

            this.masterElement = this.shadowRoot.querySelector('machine-master');
            this.animation();
        } else {
            cancelAnimationFrame(this.animationFrame);
            this.masterMachines.forEach(item => {
                item.osc.stop(this.masterContext.currentTime);
            });
        }
    }

    animation() {
        this.masterAnalyze.fftSize = 2048;
        const masterMonitorDataArray = new Uint8Array(this.masterAnalyze.frequencyBinCount);
        this.masterAnalyze.getByteTimeDomainData(masterMonitorDataArray);

        this.masterAnalyze.fftSize = 512;
        this.masterAnalyze.minDecibels = -140;
        this.masterAnalyze.maxDecibels = 0;
        const amMasterMonitorByteArray = new Uint8Array(this.masterAnalyze.frequencyBinCount);
        this.masterAnalyze.getByteFrequencyData(amMasterMonitorByteArray);

        this.masterElement.frequencyData = masterMonitorDataArray;
        this.masterElement.byteData = amMasterMonitorByteArray;

        this.animationFrame = requestAnimationFrame(this.animation);
    }

    transposeNote(noteOffset, baseFrequency = 440) {
        return baseFrequency * Math.pow(2, noteOffset / 12);
    }

});