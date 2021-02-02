import '../elements/oscilloscope.js';

window.customElements.define('machine-lfo', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    padding: 1rem;
                    background-color: var(--machine-color);

                    --machine-color: #F48FB1;

                    --oscilloscope-background: var(--screen-background-color);
                    --oscilloscope-stroke: var(--machine-color);
                    --oscilloscope-width: var(--screen-line-width);
                }
                h4 {
                    margin: 0;
                }
                ul {
                    padding: 0;
                    list-style: none;
                }
            </style>
            <h4>LFO</h4>
            <ul>
                <li data-waves-container>
                    <lable>type</label>
                    <select data-type>
                        <option value="sine">sine</option>
                        <option value="square">square</option>
                        <option value="sawtooth">sawtooth</option>
                        <option value="triangle">triangle</option>
                        <option value="noice">noice</option>
                    </select>
                </li>
                <li>
                    <label>rate</label>
                    <input data-frequency-range type="range" min="0" max="20" />
                    <output data-frequency-value></output>
                </li>
                <li>
                    <label>amount</label>
                    <input data-amount-range type="range" min="0" step=".1" max="1" />
                    <output data-amount-value></output>
                </li>
            </ul>
            <elements-oscilloscope></elements-oscilloscope>
        `;
    }

    static get observedAttributes() { return ['frequency', 'wave', 'amount', 'min', 'max']; }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'frequency':
                this.shadowRoot.querySelector('[data-frequency-range]').value = newValue;
                this.shadowRoot.querySelector('[data-frequency-value]').innerHTML = newValue;
                break;
            case 'amount':
                this.shadowRoot.querySelector('[data-amount-range]').value = newValue;
                this.shadowRoot.querySelector('[data-amount-value]').innerHTML = newValue;
                break;
            case 'wave':
                this.shadowRoot.querySelector('[data-type]').value = newValue;
                this.shadowRoot.querySelector('[data-waves-container]').style.display =
                    (newValue === null || newValue === 'none') ? 'none' : 'block';
                break;
            case 'min':
                this.shadowRoot.querySelector('[data-amount-range]').setAttribute('min', newValue);
                break;
            case 'max':
                this.shadowRoot.querySelector('[data-amount-range]').setAttribute('max', newValue);
                break;
        }
    }

    connectedCallback() {
        !this.hasAttribute('frequency') && this.setAttribute('frequency', '10');

        this.shadowRoot.querySelector('[data-frequency-range]').addEventListener('input', (event) => {
            this.dispatchEvent(new CustomEvent('frequency-change', {
                detail: Number(event.target.value),
                composed: true
            }));
            this.setAttribute('frequency', event.target.value);
        });

        //min max
        if (!this.hasAttribute('min')) {
            this.setAttribute('min', '0');
        }
        if (!this.hasAttribute('max')) {
            this.setAttribute('max', '1');
        }

        //Abount
        if (!this.hasAttribute('amount')) {
            this.setAttribute('amount', '0.5');
        }
        this.shadowRoot.querySelector('[data-amount-range]').addEventListener('input', (event) => {
            this.dispatchEvent(new CustomEvent('amount-change', {
                detail: Number(event.target.value),
                composed: true,
            }));
            this.setAttribute('amount', event.target.value);
        });

        // Wave type
        this.setAttribute('wave', this.hasAttribute('wave') ? this.getAttribute('wave') : 'none');
        this.shadowRoot.querySelector('[data-type]').addEventListener('change', (event) => {
            this.dispatchEvent(new CustomEvent('type-change', {
                detail: event.target.value,
                composed: true
            }));
            this.setAttribute('wave', event.target.value);
        });
    }

    set frequencyData(data) {
        this.shadowRoot.querySelector('elements-oscilloscope').data = data;
    }
});