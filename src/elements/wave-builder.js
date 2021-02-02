const template = document.createElement('template');
template.innerHTML = `
    <tr data-partials>
        <td>
            <input type="range" min="0" max="1" step="0.01" /><span></span>
        </td>
        <td>
            <svg  viewBox="0 0 400 50" xmlns="http://www.w3.org/2000/svg" width="400" height="50">
                <line x1="0" y1="25" x2="400" y2="25" />
                <g transform="translate(0, 25)">
                    <polyline fill="none" stroke="black" />
                </g>
            </svg>
        </td>
    </tr>
`;

window.customElements.define('element-wave-builder', class extends HTMLElement {

    constructor() {
        super();
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

        };
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .row{
                    display: grid;
                    grid-template-columns: auto 1fr;
                    grid-gap: 0.8rem;
                }
                .col {}
                .col-control { align-self: center }
                svg {
                    background-color: var(--screen-background-color, black);
                    width: 100%;
                    height: auto;
                }
                line {
                    stroke-width: var(--screen-marker-line-width, 1px);
                    stroke: var(--line-color, #faebd7);
                    stroke-dasharray: 2;
                }
                polyline {
                    stroke-width: var(--line-width, 1px);
                    stroke: var(--line-color, #faebd7);
                    fill: none;
                    stroke-dasharray: var(--resolution, 0);
                }
            </style>

            <table>
                <tr data-sum>
                    <td>master</td>
                    <td>
                        <svg viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" width="400" height="100">
                            <line x1="0" y1="50" x2="400" y2="50" />
                            <g transform="translate(0, 50)">
                                <polyline fill="none" stroke="black" />
                            </g>
                        </svg>
                    </td>
                </tr>
            </table>
        `;
        this.update = this.update.bind(this);
    }

    connectedCallback() {
        // const frequency= 440;
        // const amplitude= 1;
        // // How many samples to visualize in each curve.
        // const sampleNumber= 400;
        // // The "sample rate frequency" used for visualization. Controls how much
        // // of the waves are shown.
        // const sampleRate= 44100;



        const partials = Array.from({ length: 12 }).map((_, a) => {
            const frequency = 220 * (a + 1);
            const amplitude = this.amplitudeFunctions.sine(a)//1 / (a + 2);
            const row = template.content.cloneNode(true);
            const wave = this.createWave(frequency, amplitude);
            row.querySelector('span').innerHTML = amplitude.toFixed(3);
            row.querySelector('input').value = amplitude;

            row.querySelector('input').addEventListener('input', this.update)
            row.querySelector('polyline').setAttributeNS(null, 'points', this.createPoints(wave));
            this.shadowRoot.querySelector('table').appendChild(row);

            return wave;
        });

        const sum = this.combineWaves(partials);
        const points = this.createPoints(sum);

        this.shadowRoot.querySelector('[data-sum] polyline').setAttributeNS(null, 'points', points);
    }

    static get observedAttributes() {
        return ['type'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'type':
                if (['sine', 'saw', 'square', 'tri'].indexOf(newValue) >= 0) {
                    this.preset(this.amplitudeFunctions[newValue]);
                }
                break;
        }
    }

    createWave(frequency, amplitude) {
        // const frequency = 440 * Math.pow(2, a);

        const sampleNumber = 400;
        const sampleRate = 44100;

        return Array.from({ length: sampleNumber }).map((_, i) => {
            // How many radians per second does the oscillator go?
            const angularFrequency = frequency * 2 * Math.PI;
            // What's the "time" of this sample in our curves?
            const sampleTime = /*sampleNumber*/ i / sampleRate;
            // What's the angle of the oscillator at this time?
            const sampleAngle = sampleTime * angularFrequency;
            // What's the value of the sinusoid for this angle?
            return amplitude * Math.sin(sampleAngle);
        });
    }

    combineWaves(partials) {
        return Array.from({ length: partials[0].length }).map((_, i) => {
            return partials.map(partial => partial[i]).reduce((a, b) => a + b);
        });
    }

    createPoints(sum) {
        return sum.reduce((previous, current, index) => {
            return previous + `${index}, ${current * 20} `;
        }, '');
    }

    update() {
        const partials = Array.from(this.shadowRoot.querySelectorAll('[data-partials]')).map((row, a) => {

            const frequency = 440 * (a + 1);
            const amplitude = Number(row.querySelector('input').value);
            const wave = this.createWave(frequency, amplitude);
            row.querySelector('span').innerHTML = amplitude.toFixed(3);
            row.querySelector('polyline').setAttributeNS(null, 'points', this.createPoints(wave));

            return wave;
        });

        const sum = this.combineWaves(partials);
        const points = this.createPoints(sum);

        this.shadowRoot.querySelector('[data-sum] polyline').setAttributeNS(null, 'points', points);

        this.dispatchEvent(new CustomEvent('change', {
            composed: true
        }));
    }

    preset(f) {
        const partials = Array.from(this.shadowRoot.querySelectorAll('[data-partials]')).map((row, a) => {

            const frequency = 440 * (a + 1);
            const amplitude = f(a);
            const wave = this.createWave(frequency, amplitude);
            row.querySelector('input').value = amplitude;
            row.querySelector('span').innerHTML = amplitude.toFixed(3);
            row.querySelector('polyline').setAttributeNS(null, 'points', this.createPoints(wave));

            return wave;
        });
        // const fundimental = this.createWave(220, 1);
        const sum = this.combineWaves(partials);

        const points = this.createPoints(sum);

        this.shadowRoot.querySelector('[data-sum] polyline').setAttributeNS(null, 'points', points);
    }
});