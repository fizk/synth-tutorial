import '../elements/envelope.js';

window.customElements.define('symbol-adsr', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    padding: .5rem;
                    background-color: var(--machine-color);

                    --machine-color: #9FA8DA;

                    --envelope-background: var(--screen-background-color);
                    --envelope-stroke-width: 2px;
                    --envelope-stroke: var(--machine-color);
                    --envelope-marker-stroke-width: var(--screen-marker-line-width);
                    --envelope-marker-stroke: var(--machine-color);
                    --envelope-marker-dash: 2;
                }
            </style>
            <element-envelope data-envelope width="100" height="25"></element-envelope>
        `;
    }
    static get observedAttributes() {
        return ['a', 'd', 's', 'r', 'width', 'height'];
    }

    connectedCallback() {
        !this.hasAttribute('a') && this.setAttribute('a', '100');
        !this.hasAttribute('d') && this.setAttribute('d', '100');
        !this.hasAttribute('s') && this.setAttribute('s', '50');
        !this.hasAttribute('r') && this.setAttribute('r', '100');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const envelopeDisplayElement = this.shadowRoot.querySelector('[data-envelope]');
        switch (name) {
            case 'a':
                envelopeDisplayElement.setAttribute('a', newValue);
                break;
            case 'd':
                envelopeDisplayElement.setAttribute('d', newValue);
                break;
            case 's':
                envelopeDisplayElement.setAttribute('s', newValue);
                break;
            case 'r':
                envelopeDisplayElement.setAttribute('r', newValue);
                break;
            case 'width':
                envelopeDisplayElement.setAttribute('width', newValue);
                break;
            case 'height':
                envelopeDisplayElement.setAttribute('height', newValue);
                break;
        }
    }
});