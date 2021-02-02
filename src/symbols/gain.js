window.customElements.define('symbol-gain', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    padding: .5rem;
                    background-color: var(--machine-color);

                    --machine-color: #FFAB91
                }
            </style>
            <div></div>
        `;
    }
    static get observedAttributes() {
        return ['amount'];
    }

    connectedCallback() {
        !this.hasAttribute('amount') && this.setAttribute('amount', '0');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const envelopeDisplayElement = this.shadowRoot.querySelector('div');
        switch (name) {
            case 'amount':
                envelopeDisplayElement.innerHTML = `${Number(newValue).toFixed(2)}`;
        }
    }
});