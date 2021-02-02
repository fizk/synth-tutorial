import '../elements/envelope.js';
import '../machines/keyboard.js';
import '../elements/envelope-controlls.js';
import '../elements/workstation.js';
import '../symbols/gain.js';
import '../machines/adsr.js';
// function lerp(min, max, fraction) {  return (max — min) * fraction + min;}

window.customElements.define('pad-envelope-synth', class extends HTMLElement {
    constructor() {
        super();
        this.isKeyDown = false;
        this.animationFrame;
        this.animationTime;

        this.oscillator;
        this.gain;
        this.audioContext;
        this.masterGain;
        this.attackAnimation = this.attackAnimation.bind(this);
        this.releaseAnimation = this.releaseAnimation.bind(this);
        this.startKeyboardNote = this.startKeyboardNote.bind(this);
        this.stopKeyboardNote = this.stopKeyboardNote.bind(this);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-workstation slot="aside">
                <machine-keyboard keys></machine-keyboard>
                <symbol-gain></symbol-gain>
                <machine-adsr></machine-adsr>
            </element-workstation>
        `;
    }

    static get observedAttributes() { return ['a', 'd', 's', 'r']; }

    attributeChangedCallback(name, oldValue, newValue) {
        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');

        switch (name) {
            case 'a':
                envelopeElement.setAttribute('a', newValue);
                break;
            case 'd':
                envelopeElement.setAttribute('d', newValue);
                break;
            case 's':
                envelopeElement.setAttribute('s', newValue);
                break;
            case 'r':
                envelopeElement.setAttribute('r', newValue);
                break;
        }
    }

    connectedCallback() {
        this.addEventListener('start', this.startKeyboardNote);
        this.addEventListener('stop', this.stopKeyboardNote);
    }

    disconnectedCallback() {
        this.oscillator && this.oscillator.stop(this.audioContext.currentTime);
        cancelAnimationFrame(this.animationFrame);
    }

    attackAnimation(time) {
        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');

        if (!this.animationTime) {
            this.animationTime = time
        };
        const progress = time - this.animationTime;
        const a = Number(envelopeElement.getAttribute('a'));
        const d = Number(envelopeElement.getAttribute('d'));
        const sumTime = (a + d) * 10;

        const linearInterpolation = (((a + d) / 4)) * ((1 / sumTime) * progress);

        if (progress < sumTime) {
            envelopeElement.setAttribute('cursor', Number(linearInterpolation));
            this.animationFrame = requestAnimationFrame(this.attackAnimation)
        }
    }

    releaseAnimation(time) {
        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');

        if (!this.animationTime) {
            this.animationTime = time
        };
        const progress = time - this.animationTime;
        const r = Number(envelopeElement.getAttribute('r'));
        const max = 100;
        const min = max - (r / 4);

        const linearInterpolation = (max - min) * ((1 / (r * 10)) * progress) + min;

        if (progress < (r * 100)) {
            envelopeElement.setAttribute('cursor', Number(linearInterpolation));
            this.animationFrame = requestAnimationFrame(this.releaseAnimation)
        } else {
            cancelAnimationFrame(this.animationFrame);
            this.animationTime = undefined;
        }
    }

    startKeyboardNote(event) {
        const envelopeElement = this.shadowRoot.querySelector('machine-adsr');

        this.audioContext = new AudioContext();
        this.oscillator = this.audioContext.createOscillator();
        this.gain = this.audioContext.createGain();
        this.masterGain = this.audioContext.createGain();
        this.oscillator.frequency.value = event.detail;

        this.oscillator.connect(this.gain)
            .connect(this.masterGain)
            .connect(this.audioContext.destination);

        const a = Number(envelopeElement.getAttribute('a')) / 100;
        const d = Number(envelopeElement.getAttribute('d')) / 100;
        const s = Number(envelopeElement.getAttribute('s')) / 100;

        this.gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.gain.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + a);
        this.gain.gain.linearRampToValueAtTime(s, this.audioContext.currentTime + a + d);

        this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + .01);

        this.oscillator.start(this.audioContext.currentTime);

        cancelAnimationFrame(this.animationFrame);
        this.animationTime = undefined;
        this.attackAnimation(0);
    }

    stopKeyboardNote() {
        if (this.oscillator) {
            const envelopeElement = this.shadowRoot.querySelector('machine-adsr');
            const r = Number(envelopeElement.getAttribute('r')) / 100;

            this.gain.gain.cancelScheduledValues(this.audioContext.currentTime);
            this.gain.gain.linearRampToValueAtTime(this.gain.gain.value, this.audioContext.currentTime);
            this.gain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + r);

            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, (this.audioContext.currentTime + r) - 0.1);
            this.masterGain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + r);

            this.oscillator.stop(this.audioContext.currentTime + r);

            cancelAnimationFrame(this.animationFrame);
            this.animationTime = undefined;
            this.releaseAnimation(0);
        }
    }

});