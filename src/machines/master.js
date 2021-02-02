import '../elements/oscilloscope.js';
import '../elements/frequencyscope.js';

window.customElements.define('machine-master', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    background-color: var(--machine-color);
                    padding: 1rem;

                    --machine-color: #90CAF9;

                    --oscilloscope-background: var(--screen-background-color);
                    --oscilloscope-stroke: var(--machine-color);
                    --oscilloscope-width: var(--screen-line-width);

                    --oscilloscope-marker-width: var(--screen-marker-line-width);
                    --oscilloscope-marker-stroke: var(--machine-color);
                    --oscilloscope-marker-dash: 2;

                    --frequencyscope-background: var(--screen-background-color);
                    --frequencyscope-stroke: var(--machine-color);
                }
                h4 {
                    margin: 0;
                }
            </style>
            <h4>Master</h4>
            <elements-oscilloscope></elements-oscilloscope>
            <elements-frequencyscope></elements-frequencyscope>
        `;
    }

    set frequencyData(data) {
        this.shadowRoot.querySelector('elements-oscilloscope').data = data;
    }

    set byteData(data) {
        this.shadowRoot.querySelector('elements-frequencyscope').data = data;
    }
});