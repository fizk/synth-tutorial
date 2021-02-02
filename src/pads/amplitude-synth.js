import '../elements/workstation.js';
import '../machines/gain.js';
import '../machines/undefined.js';
import '../machines/oscillator.js';
import '../machines/master.js';
import '../machines/keyboard.js';
import '../symbols/gain.js';
import gainToAudioWorklet from '../worklets/gain-to-audio-worklet.js'


window.customElements.define('pad-amplitude-synth', class extends HTMLElement {
    constructor() {
        super();
        this.context;
        this.carrierOsc;
        this.lfoOsc;
        this.lfoGain;
        this.carrierGain;
        this.masterGain;
        this.lfoAnalyser;
        this.masterAnalyser;
        this.animationFrame
        this.handleNoteOn = this.handleNoteOn.bind(this);
        this.handleNoteOff = this.handleNoteOff.bind(this);
        this.animation = this.animation.bind(this);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
             <element-workstation >
                <machine-keyboard keys></machine-keyboard>
                <machine-undefined min="0.1" max="4" min-index="0" max-index="4"></machine-undefined>
                <symbol-gain amount="0.5"></symbol-gain>
                <machine-master></machine-master>
            </element-workstation>
        `;
    }

    static get observedAttributes() { return ['index', 'amount']; }

    attributeChangedCallback(name, oldValue, newValue) {
        const undefinedElement = this.shadowRoot.querySelector('machine-undefined');
        switch (name) {
            case 'index':
                undefinedElement.setAttribute('index', newValue);
                break;
            case 'amount':
                undefinedElement.setAttribute('amount', newValue);
                break;
        }
    }

    async connectedCallback() {
        !this.hasAttribute('index') && this.setAttribute('index', '0.8');
        !this.hasAttribute('amount') && this.setAttribute('amount', '1');

        const keyboardElement = this.shadowRoot.querySelector('machine-keyboard');
        keyboardElement.addEventListener('start', this.handleNoteOn);
        keyboardElement.addEventListener('stop', this.handleNoteOff);

        this.context = new AudioContext();
        await gainToAudioWorklet(this.context)
    }

    handleNoteOn(event) {
        const undefinedElement = this.shadowRoot.querySelector('machine-undefined');

        this.carrierOsc = new OscillatorNode(this.context);
        this.lfoOsc = new OscillatorNode(this.context);
        this.lfoGain = new GainNode(this.context);
        this.carrierGain = new GainNode(this.context);
        this.masterGain = new GainNode(this.context);

        this.lfoProcessor = new AudioWorkletNode(this.context, 'gain-to-audio-worklet')

        this.lfoAnalyser = new AnalyserNode(this.context);
        this.masterAnalyser = new AnalyserNode(this.context);

        this.lfoOsc.connect(this.lfoGain)
            .connect(this.lfoAnalyser)
            .connect(this.carrierGain.gain);

        this.carrierOsc.connect(this.carrierGain)
            .connect(this.masterGain)
            .connect(this.masterAnalyser)
            .connect(this.context.destination);

        this.carrierOsc.frequency.value = event.detail;
        this.lfoOsc.frequency.value = event.detail * Number(undefinedElement.getAttribute('index'));

        this.lfoGain.gain.value = Number(undefinedElement.getAttribute('amount'));

        this.masterGain.gain.setValueAtTime(0, this.context.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.5, this.context.currentTime + 0.01);

        this.carrierOsc.start(this.context.currentTime);
        this.lfoOsc.start(this.context.currentTime);

        cancelAnimationFrame(this.animationFrame);
        this.animation();
    }

    handleNoteOff() {
        this.masterGain.gain.setValueAtTime(0.5, this.context.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.001, this.context.currentTime + 0.01);

        this.carrierOsc.stop(this.context.currentTime + 0.01);
        this.lfoOsc.stop(this.context.currentTime + 0.01);
    }

    animation() {
        // master monitor
        this.masterAnalyser.fftSize = 2048;
        const amMasterMonitorDataArray = new Uint8Array(this.masterAnalyser.frequencyBinCount);
        this.masterAnalyser.getByteTimeDomainData(amMasterMonitorDataArray);

        this.masterAnalyser.fftSize = 512;
        this.masterAnalyser.minDecibels = -140;
        this.masterAnalyser.maxDecibels = 0;
        const amMasterMonitorByteArray = new Uint8Array(this.masterAnalyser.frequencyBinCount);
        this.masterAnalyser.getByteFrequencyData(amMasterMonitorByteArray);

        // lfo monitor
        this.lfoAnalyser.fftSize = 2048;
        const amLFOMonitorDataArray = new Uint8Array(this.lfoAnalyser.frequencyBinCount);
        this.lfoAnalyser.getByteTimeDomainData(amLFOMonitorDataArray);

        this.shadowRoot.querySelector('machine-undefined').frequencyData = amLFOMonitorDataArray;
        this.shadowRoot.querySelector('machine-master').frequencyData = amMasterMonitorDataArray;
        this.shadowRoot.querySelector('machine-master').byteData = amMasterMonitorByteArray;


        this.animationFrame = requestAnimationFrame(this.animation);
    }
});
