import '../elements/oscilloscope.js';

window.customElements.define('machine-undefined', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    padding: 1rem;
                    background-color: var(--machine-color);

                    --machine-color: #CE93D8;

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
            <h4>Undefined</h4>
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
                    <label>index</label>
                    <input data-index-range type="range" min="1" max="24" step=".1" />
                    <output data-index-value></output>
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

    static get observedAttributes() { return ['index', 'wave', 'amount', 'min-index', 'max-index', 'min-amount', 'max-amount']; }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'index':
                this.shadowRoot.querySelector('[data-index-range]').value = newValue;
                this.shadowRoot.querySelector('[data-index-value]').innerHTML = newValue;
                break;
            case 'min-index':
                this.shadowRoot.querySelector('[data-index-range]').setAttribute('min', newValue);
                break;
            case 'max-index':
                this.shadowRoot.querySelector('[data-index-range]').setAttribute('max', newValue);
                break;
            case 'amount':
                this.shadowRoot.querySelector('[data-amount-range]').value = newValue;
                this.shadowRoot.querySelector('[data-amount-value]').innerHTML = newValue;
                break;
            case 'min-amount':
                this.shadowRoot.querySelector('[data-amount-range]').setAttribute('min', newValue);
                break;
            case 'max-amount':
                this.shadowRoot.querySelector('[data-amount-range]').setAttribute('max', newValue);
                break;
            case 'wave':
                this.shadowRoot.querySelector('[data-type]').value = newValue;
                this.shadowRoot.querySelector('[data-waves-container]').style.display =
                    (newValue === null || newValue === 'none') ? 'none' : 'block';
                break;
        }
    }

    connectedCallback() {
        //Frequency
        !this.hasAttribute('index') && this.setAttribute('index', '1');
        !this.hasAttribute('min-index') && this.setAttribute('min-index', '1');
        !this.hasAttribute('max-index') && this.setAttribute('max-index', '10');

        this.shadowRoot.querySelector('[data-index-range]').addEventListener('input', (event) => {
            this.dispatchEvent(new CustomEvent('index-change', {
                detail: Number(event.target.value),
                composed: true,
            }));
            this.setAttribute('index', event.target.value);
        });

        //Abount
        !this.hasAttribute('amount') && this.setAttribute('amount', '0.5');
        !this.hasAttribute('min-amount') && this.setAttribute('min-amount', '0');
        !this.hasAttribute('max-amount') && this.setAttribute('max-amount', '1');

        this.shadowRoot.querySelector('[data-amount-range]').addEventListener('input', (event) => {
            this.dispatchEvent(new CustomEvent('amount-change', {
                detail: Number(event.target.value),
                composed: true
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