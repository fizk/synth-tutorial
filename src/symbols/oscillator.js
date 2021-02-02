import '../elements/envelope.js';

window.customElements.define('symbol-oscillator', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    padding: .5rem;
                    background-color: var(--machine-color);

                    --machine-color: #1DE9B6
                }
            </style>
            <div></div>
        `;
    }
    static get observedAttributes() {
        return ['frequency'];
    }

    connectedCallback() {
        !this.hasAttribute('frequency') && this.setAttribute('frequency', '0');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const envelopeDisplayElement = this.shadowRoot.querySelector('div');
        switch (name) {
            case 'frequency':
                envelopeDisplayElement.innerHTML = `${Number(newValue).toFixed(2)} Hz`;
        }
    }
});