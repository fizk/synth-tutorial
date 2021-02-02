import '../elements/workstation.js';
import '../machines/gain.js';
import '../machines/undefined.js';
import '../machines/master.js';
import '../machines/keyboard.js';
import '../machines/adsr.js';

window.customElements.define('pad-frequency-synth', class extends HTMLElement {
    constructor() {
        super();
        this.context;
        this.animationFrame;
        this.adsrTime = 1;
        this.sustainValue = .5;
        this.handleNoteOn = this.handleNoteOn.bind(this);
        this.handleNoteOff = this.handleNoteOff.bind(this);
        this.animation = this.animation.bind(this);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-workstation>
                <machine-keyboard keys></machine-keyboard>
                <machine-undefined data-lfo-fm ></machine-undefined>
                <machine-adsr data-lfo-adsr a="10" r="20"></machine-adsr>
                <machine-gain data-gain-fm amount="0.3"></machine-gain>
                <machine-adsr data-carrier-adsr a="1" r="2"></machine-adsr>
                <machine-master data-master-fm></machine-master>
            </element-workstation>
        `;
    }

    static get observedAttributes() {
        return [
            'carrier-a', 'carrier-d', 'carrier-s', 'carrier-r',
            'modulator-a', 'modulator-d', 'modulator-s', 'modulator-r',
            'index', 'amplitude',
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const adsrElement = this.shadowRoot.querySelector('[data-carrier-adsr]');
        const carrierEnvelopeElement = this.shadowRoot.querySelector('[data-lfo-adsr]');

        switch (name) {
            case 'carrier-a':
                adsrElement.setAttribute('a', newValue);
                break;
            case 'carrier-d':
                adsrElement.setAttribute('d', newValue);
                break;
            case 'carrier-s':
                adsrElement.setAttribute('s', newValue);
                break;
            case 'carrier-r':
                adsrElement.setAttribute('r', newValue);
                break;
            case 'modulator-a':
                carrierEnvelopeElement.setAttribute('a', newValue);
                break;
            case 'modulator-d':
                carrierEnvelopeElement.setAttribute('d', newValue);
                break;
            case 'modulator-s':
                carrierEnvelopeElement.setAttribute('s', newValue);
                break;
            case 'modulator-r':
                carrierEnvelopeElement.setAttribute('r', newValue);
                break;
            case 'index':
                break;
        }
    }

    connectedCallback() {
        !this.hasAttribute('index') && this.setAttribute('index', '1');
        !this.hasAttribute('amplitude') && this.setAttribute('amplitude', '300');
        const keyboardElement = this.shadowRoot.querySelector('machine-keyboard');
        keyboardElement.addEventListener('start', this.handleNoteOn);
        keyboardElement.addEventListener('stop', this.handleNoteOff);
    }

    handleNoteOn(event) {
        const adsrElement = this.shadowRoot.querySelector('[data-carrier-adsr]');
        const carrierEnvelopeElement = this.shadowRoot.querySelector('[data-lfo-adsr]');

        this.context = this.context || new AudioContext();

        this.carrierOsc = new OscillatorNode(this.context);
        this.carrierOsc.frequency.value = event.detail;
        this.lfoOsc = new OscillatorNode(this.context);
        this.lfoOsc.frequency.value = event.detail * Number(this.getAttribute('index'));

        this.lfoGain = new GainNode(this.context);

        //ADSR
        const sustain = Number(this.getAttribute('amplitude'));
        const _a = Number(carrierEnvelopeElement.getAttribute('a')) / 100;
        const _d = Number(carrierEnvelopeElement.getAttribute('d')) / 100;
        const _s = Number(carrierEnvelopeElement.getAttribute('s')) / 100;
        const _r = Number(carrierEnvelopeElement.getAttribute('r')) / 100;

        const _aTime = this.adsrTime * _a;
        const _dTime = this.adsrTime * _d;
        const _sValue = sustain * _s;
        const _rTime = this.adsrTime * _r;

        this.lfoGain.gain.setValueAtTime(0, this.context.currentTime);
        this.lfoGain.gain.linearRampToValueAtTime(sustain, this.context.currentTime + _aTime);
        this.lfoGain.gain.linearRampToValueAtTime(_sValue, this.context.currentTime + _aTime + _dTime);

        // this.lfoGain.gain.value = Number(this.getAttribute('index'));

        // end adsr

        this.lfoAnalyzer = new AnalyserNode(this.context);
        this.masterGain = new GainNode(this.context);
        this.masterGain.gain.value = .5;
        this.masterAnalyzer = new AnalyserNode(this.context);

        this.lfoOsc.connect(this.lfoGain)
            .connect(this.lfoAnalyzer)
            .connect(this.carrierOsc.frequency);

        this.carrierOsc.connect(this.masterGain)
            .connect(this.masterAnalyzer)
            .connect(this.context.destination);

        this.carrierOsc.start(this.context.currentTime);
        this.lfoOsc.start(this.context.currentTime);

        //ADSR
        const a = Number(adsrElement.getAttribute('a')) / 100;
        const d = Number(adsrElement.getAttribute('d')) / 100;
        const s = Number(adsrElement.getAttribute('s')) / 100;

        const aTime = this.adsrTime * a;
        const dTime = this.adsrTime * d;
        const sValue = this.sustainValue * s;

        this.masterGain.gain.setValueAtTime(0, this.context.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.sustainValue, this.context.currentTime + aTime);
        this.masterGain.gain.linearRampToValueAtTime(sValue, this.context.currentTime + aTime + dTime);


        cancelAnimationFrame(this.animationFrame);
        this.animation();
    }

    handleNoteOff() {
        const adsrElement = this.shadowRoot.querySelector('[data-carrier-adsr]');
        const r = Number(adsrElement.getAttribute('r')) / 100;
        const rTime = this.adsrTime * r;

        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.context.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, this.context.currentTime + rTime);

        this.carrierOsc.stop(this.context.currentTime + rTime);
        this.lfoOsc.stop(this.context.currentTime + rTime);
    }

    animation() {
        // master monitor
        this.masterAnalyzer.fftSize = 2048;
        const amMasterMonitorDataArray = new Uint8Array(this.masterAnalyzer.frequencyBinCount);
        this.masterAnalyzer.getByteTimeDomainData(amMasterMonitorDataArray);

        this.masterAnalyzer.fftSize = 1024;
        this.masterAnalyzer.minDecibels = -140;
        this.masterAnalyzer.maxDecibels = 0;
        const amMasterMonitorByteArray = new Uint8Array(this.masterAnalyzer.frequencyBinCount);
        this.masterAnalyzer.getByteFrequencyData(amMasterMonitorByteArray);

        // lfo monitor
        this.lfoAnalyzer.fftSize = 2048;
        const amLFOMonitorDataArray = new Uint8Array(this.lfoAnalyzer.frequencyBinCount);
        this.lfoAnalyzer.getByteTimeDomainData(amLFOMonitorDataArray);

        this.shadowRoot.querySelector('machine-undefined').frequencyData = amLFOMonitorDataArray;
        this.shadowRoot.querySelector('machine-master').frequencyData = amMasterMonitorDataArray;
        this.shadowRoot.querySelector('machine-master').byteData = amMasterMonitorByteArray;

        this.animationFrame = requestAnimationFrame(this.animation);
    }
});
