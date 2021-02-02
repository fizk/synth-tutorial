window.customElements.define('sine-wave', class extends HTMLElement {
    constructor() {
        super();

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
                    polyline {
                        stroke-width: var(--screen-line-width, 1px);
                        stroke: var(--screen-line-color, #faebd7);
                        fill: none;
                        stroke-dasharray: var(--resolution, 0);
                    }
                    line {
                        stroke-width: var(--screen-marker-line-width, 1px);
                        stroke: var(--screen-marker-line-color, #faebd7);
                        stroke-dasharray: 2;
                    }
            </style>
            <svg  viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" width="400" height="100">
                <line />
                <g data-wave-container>
                    <polyline />
                </g>
            </svg>
        `;
    }

    static get observedAttributes() { return ['width', 'height', 'phase', 'amplitude', 'frequency', 'points']; }

    connectedCallback() {
        !this.hasAttribute('width') && this.setAttribute('width', '400');
        !this.hasAttribute('height') && this.setAttribute('height', '100');
        !this.hasAttribute('amplitude') && this.setAttribute('amplitude', '40');
        !this.hasAttribute('frequency') && this.setAttribute('frequency', '440');
        !this.hasAttribute('phase') && this.setAttribute('phase', '0');

        const svg = this.shadowRoot.querySelector('svg');
        svg.setAttributeNS(null, 'viewBox', `0 0 ${this.getAttribute('width')} ${this.getAttribute('height')}`)
        svg.setAttributeNS(null, 'height', this.getAttribute('height'));
        svg.setAttributeNS(null, 'width', this.getAttribute('width'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'phase':
            case 'amplitude':
            case 'frequency':
            case 'width':
            case 'height':
                const w = this.getAttribute('width') || 100;
                const h = this.getAttribute('height') || 100;
                const canvasElement = this.shadowRoot.querySelector('svg');
                const lineElement = this.shadowRoot.querySelector('line');
                const waveContainerElement = this.shadowRoot.querySelector('[data-wave-container]');
                waveContainerElement.setAttributeNS(null, 'transform', `translate(0, ${Number(h / 2)})`)
                const polylineElement = this.shadowRoot.querySelector('polyline');
                const points = this.calculateSineCurve(
                    this.getAttribute('frequency'),
                    this.getAttribute('amplitude'),
                    this.getAttribute('phase'),
                    canvasElement.getAttributeNS(null, 'width')
                ).map((point, index) => ({ x: index, y: point }))
                    .reduce((previous, current) => previous + `${current.x}, ${current.y} `, '');
                polylineElement.setAttributeNS(null, 'points', points);
                lineElement.setAttributeNS(null, 'x1', '0');
                lineElement.setAttributeNS(null, 'y1', String(Number(h / 2)));
                lineElement.setAttributeNS(null, 'x2', w);
                lineElement.setAttributeNS(null, 'y2', String(Number(h / 2)));
                break;
            case 'points':
                this.shadowRoot.querySelector('polyline').setAttributeNS(null, 'points', newValue);
                break;

        }
    }

    calculateSineCurve(frequency, amplitude, offset = 0, sampleCount = 650, sampleRate = 44100) {
        return Array.from({ length: sampleCount })
            .map((_, sampleNumber) => this.calculateSample(frequency, amplitude, sampleNumber - offset, sampleRate));
    }

    calculateSample(frequency, amplitude, sampleNumber, sampleRate) {
        // How many radians per second does the oscillator go?
        const angularFrequency = frequency * 2 * Math.PI;
        // What's the "time" of this sample in our curves?
        const sampleTime = sampleNumber / sampleRate;
        // What's the angle of the oscillator at this time?
        const sampleAngle = sampleTime * angularFrequency;
        // What's the value of the sinusoid for this angle?
        return amplitude * Math.sin(sampleAngle);
    }
});
