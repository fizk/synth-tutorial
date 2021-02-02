import '../elements/envelope.js';
import '../elements/envelope-controlls.js';

window.customElements.define('machine-adsr', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    padding: 1rem;
                    background-color: var(--machine-color);

                    --machine-color: #9FA8DA;

                    --envelope-background: var(--screen-background-color);
                    --envelope-stroke-width: var(--screen-line-width);
                    --envelope-stroke: var(--machine-color);
                    --envelope-marker-stroke-width: var(--screen-marker-line-width);
                    --envelope-marker-stroke: var(--machine-color);
                    --envelope-marker-dash: 2;
                }
                h4 {
                    margin: 0;
                }
            </style>
            <element-envelope data-envelope></element-envelope>
            <elements-envelope-controlls data-envelope-controlls></elements-envelope-controlls>
        `;
    }

    static get observedAttributes() {
        return ['a', 'd', 's', 'r', 'cursor', 'width', 'height'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const envelopeDisplayElement = this.shadowRoot.querySelector('[data-envelope]');
        const envelopeControlElement = this.shadowRoot.querySelector('[data-envelope-controlls]');

        switch (name) {
            case 'a':
                envelopeDisplayElement.setAttribute('a', newValue);
                envelopeControlElement.setAttribute('a', newValue);
                break;
            case 'd':
                envelopeDisplayElement.setAttribute('d', newValue);
                envelopeControlElement.setAttribute('d', newValue);
                break;
            case 's':
                envelopeDisplayElement.setAttribute('s', newValue);
                envelopeControlElement.setAttribute('s', newValue);
                break;
            case 'r':
                envelopeDisplayElement.setAttribute('r', newValue);
                envelopeControlElement.setAttribute('r', newValue);
                break;
            case 'cursor':
                envelopeDisplayElement.setAttribute('cursor', newValue);
                break;
            case 'width':
                envelopeDisplayElement.setAttribute('width', newValue);
                break;
            case 'height':
                envelopeDisplayElement.setAttribute('height', newValue);
                break;
        }
    }

    connectedCallback() {
        !this.hasAttribute('a') && this.setAttribute('a', '100');
        !this.hasAttribute('d') && this.setAttribute('d', '100');
        !this.hasAttribute('s') && this.setAttribute('s', '50');
        !this.hasAttribute('r') && this.setAttribute('r', '100');
        !this.hasAttribute('cursor') && this.setAttribute('cursor', '0');
        !this.hasAttribute('width') && this.setAttribute('width', '200');
        !this.hasAttribute('height') && this.setAttribute('height', '50');

        const envelopeControllsElement = this.shadowRoot.querySelector('[data-envelope-controlls]');
        envelopeControllsElement.addEventListener('a-change', event => this.setAttribute('a', event.detail))
        envelopeControllsElement.addEventListener('d-change', event => this.setAttribute('d', event.detail))
        envelopeControllsElement.addEventListener('s-change', event => this.setAttribute('s', event.detail))
        envelopeControllsElement.addEventListener('r-change', event => this.setAttribute('r', event.detail))
    }
});