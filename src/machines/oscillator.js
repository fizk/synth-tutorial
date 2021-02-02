import '../elements/oscilloscope.js';

window.customElements.define('machine-oscillator', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    background-color: var(--machine-color);
                    padding: 1rem;

                    --machine-color: #1DE9B6;

                    --oscilloscope-background: var(--screen-background-color);
                    --oscilloscope-stroke: var(--machine-color);
                    --oscilloscope-width: var(--screen-line-width);

                    --oscilloscope-marker-width: var(--screen-marker-line-width);
                    --oscilloscope-marker-stroke: var(--machine-color);
                    --oscilloscope-marker-dash: 2;
                }
                h4 {
                    margin: 0;
                }
                ul {
                    padding: 0;
                    list-style: none;
                }
            </style>
            <h4>Oscillator</h4>
            <ul>
                <li data-waves-container>
                    <lable>type</label>
                    <select data-type>
                        <option value="sine">sine</option>
                        <option value="square">square</option>
                        <option value="sawtooth">sawtooth</option>
                        <option value="triangle">triangle</option>
                    </select>
                </li>
                <li>
                    <label>frequency</label>
                    <input type="range" data-frequency-range min="0" max="880" />
                    <output data-frequency-value></output>
                </li>
            </ul>
            <elements-oscilloscope></elements-oscilloscope>
        `;
    }

    static get observedAttributes() { return ['frequency', 'wave']; }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'frequency':
                this.shadowRoot.querySelector('[data-frequency-range]').value = newValue;
                this.shadowRoot.querySelector('[data-frequency-value]').innerHTML = newValue;
                break;
            case 'wave':
                this.shadowRoot.querySelector('[data-type]').value = newValue;
                this.shadowRoot.querySelector('[data-waves-container]').style.display =
                    (newValue === null || newValue === 'none') ? 'none' : 'block';
                break;
        }
    }

    connectedCallback() {
        !this.hasAttribute('frequency') && this.setAttribute('frequency', '440');

        this.shadowRoot.querySelector('[data-frequency-range]').addEventListener('input', (event) => {
            this.dispatchEvent(new CustomEvent('frequency-change', {
                detail: Number(event.target.value),
                composed: true,
            }));
            this.setAttribute('frequency', event.target.value);
        });

        // Wave type
        this.setAttribute('wave', this.hasAttribute('wave') ? this.getAttribute('wave') : 'none');
        this.shadowRoot.querySelector('[data-type]').addEventListener('change', (event) => {
            this.dispatchEvent(new CustomEvent('type-change', {
                detail: event.target.value,
                composed: true,
            }));
            this.setAttribute('wave', event.target.value);
        });
    }

    set frequencyData(data) {
        this.shadowRoot.querySelector('elements-oscilloscope').data = data;
    }
});