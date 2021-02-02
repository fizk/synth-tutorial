window.customElements.define('element-sine-wave-sequence', class extends HTMLElement {
    constructor() {
        super();
        this.animationTime;
        this.i = 0;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                svg {
                    width: 100%;
                    height: auto;
                    background-color: var(--screen-background-color, #0e0e1d);
                }
                circle {
                    stroke-width: var(--line-width, 1px);
                    stroke: var(--line-color, #faebd7);
                    fill: none;
                }
                polyline {
                    stroke-width: var(--line-width, 1px);
                    stroke: var(--line-color, #faebd7);
                    fill: none;
                }
                [data-hand] {
                    stroke-dasharray: none;
                    stroke-width: var(--line-width, 1px);
                }
                line {
                    stroke-width: 1px; /*var(--line-width, 1px)*/
                    stroke: var(--line-color, #faebd7);
                    stroke-dasharray: 2;
                }
            </style>
            <svg  viewBox="0 0 500 100" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="50" x2="500" y2="50" />
                    <line x1="50" y1="0" x2="50" y2="100" />
                    <g data-wave-container transform="translate(100, 50)">
                        <polyline />
                    </g>
                    <g data-circle-container transform="translate(50, 50)">
                        <line data-hand x1="0" y1="0" x2="0" y2="0" />
                        <line data-bar x1="0" y1="0" x2="0" y2="0" />
                        <circle cx="0" cy="0" r="40"/>
                    </g>
                </svg>
            `;

        this.animation = this.animation.bind(this);
    }

    static get observedAttributes() { return ['phase', 'amplitude', 'frequency']; }

    connectedCallback() {
        !this.hasAttribute('amplitude') && this.setAttribute('amplitude', '40');
        !this.hasAttribute('frequency') && this.setAttribute('frequency', '400');
        !this.hasAttribute('phase') && this.setAttribute('phase', '0');

        this.calculateCircle();
        this.calculateWave();
        this.animation();
    }

    disconnectedCallback() {
        cancelAnimationFrame(this.animationTime);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.calculateCircle();
        this.calculateWave();
    }

    calculateSineCurve(frequency, amplitude, offset = 0, sampleCount = 650, sampleRate = 44100) {
        return Array.from({ length: sampleCount })
            .map((_, sampleNumber) => (
                this.calculateSample(frequency, amplitude, sampleNumber - offset, sampleRate
                )));
    }

    calculateSample(frequency, amplitude, sampleNumber, sampleRate) {
        const angularFrequency = frequency * 2 * Math.PI;
        const sampleTime = sampleNumber / sampleRate;
        const sampleAngle = sampleTime * angularFrequency;
        return amplitude * Math.sin(sampleAngle);
    }

    calculateCos(frequency, amplitude, sampleNumber, sampleRate) {
        // How many radians per second does the oscillator go?
        const angularFrequency = frequency * 2 * Math.PI;
        // What's the "time" of this sample in our curves?
        const sampleTime = sampleNumber / sampleRate;
        // What's the angle of the oscillator at this time?
        const sampleAngle = sampleTime * angularFrequency;
        // What's the value of the sinusoid for this angle?
        return amplitude * Math.cos(sampleAngle);
    }

    calculateCircle() {
        const phase = Number(this.getAttribute('phase'));
        const y = -1 * this.calculateSample(
            Number(this.getAttribute('frequency')),
            Number(this.getAttribute('amplitude')),
            phase,
            44100
        );
        const x = this.calculateCos(
            Number(this.getAttribute('frequency')),
            Number(this.getAttribute('amplitude')),
            0 - phase,
            44100
        );

        const handElement = this.shadowRoot.querySelector('[data-hand]');
        handElement.setAttributeNS(null, 'x1', 0);
        handElement.setAttributeNS(null, 'y1', 0);
        handElement.setAttributeNS(null, 'x2', x);
        handElement.setAttributeNS(null, 'y2', y);

        const barElement = this.shadowRoot.querySelector('[data-bar]');
        barElement.setAttributeNS(null, 'x1', x);
        barElement.setAttributeNS(null, 'y1', y);
        barElement.setAttributeNS(null, 'x2', '50');
        barElement.setAttributeNS(null, 'y2', y);
    }

    calculateWave() {
        const polylineElement = this.shadowRoot.querySelector('polyline');
        const points = this.calculateSineCurve(
            this.getAttribute('frequency'),
            this.getAttribute('amplitude'),
            this.getAttribute('phase'),
            400
        ).map((point, index) => ({ x: index, y: point }))
            .reduce((previous, current) => previous + `${current.x}, ${current.y} `, '');
        polylineElement.setAttributeNS(null, 'points', points);
    }

    animation() {
        this.animationTime = requestAnimationFrame(this.animation);
        this.setAttribute('phase', this.i);
        this.i++
    }
});