window.customElements.define('machine-toggle', class extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <button>On</button>
        `;
    }

    static get observedAttributes() {
        return ['toggle'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'toggle':
                this.shadowRoot.querySelector('button').innerHTML = newValue === 'off' ? 'On' : 'Off';
                break;
        }
    }

    connectedCallback() {
        this.shadowRoot.querySelector('button').addEventListener('click', event => {
            this.dispatchEvent(new CustomEvent('toggle', {
                detail: !(this.hasAttribute('toggle') && this.getAttribute('toggle') === 'on'),
                composed: true,
            }));
            this.setAttribute(
                'toggle',
                this.hasAttribute('toggle') && this.getAttribute('toggle') === 'on' ? 'off' : 'on'
            );
        });
    }

});
