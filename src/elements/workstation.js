window.customElements.define('element-workstation', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: #e8e8e8;
                    box-shadow: inset 0 0 8px -2px rgba(0,0,0,.3);
                    border-radius: 1rem;
                }

                div {
                    padding: 1rem;
                    position: relative;
                }
            </style>

            <div>
                <slot></slot>
            </div>
        `;
    }
});
