window.customElements.define('elements-oscilloscope', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                svg {
                    background-color: var(--oscilloscope-background, transparent);
                }
                polyline {
                    fill: none;
                    stroke: var(--oscilloscope-stroke, black);
                    stroke-width: var(--oscilloscope-width, 1px);
                }
                line {
                    stroke-width: var(--oscilloscope-marker-width, 1px);
                    stroke: var(--oscilloscope-marker-stroke, #faebd7);
                    stroke-dasharray: var(--oscilloscope-marker-dash, 2);
                }
            </style>
            <svg  viewBox="0 0 300 50" xmlns="http://www.w3.org/2000/svg" width="300" height="50">
                <line x1="0" y1="25" x2="300" y2="25" />
                <g transform="translate(0 0)">
                    <polyline />
                </g>
            </svg>
        `;
    }

    set data(data) {
        const pointsString = this.dataToPoints(data);
        this.setAttribute('points', pointsString);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'points':
                this.shadowRoot.querySelector('polyline').setAttribute('points', newValue);
                break;
        }
    }

    static get observedAttributes() { return ['points']; }

    dataToPoints(data) {
        const svg = this.shadowRoot.querySelector('svg');
        const canvasWidth = svg.getAttribute('width');
        const canvasHeight = svg.getAttribute('height');

        const sliceWidth = canvasWidth * 1.0 / data.length;
        let x = 0;
        let points = '';

        for (var i = 0; i < data.length; i++) {
            var v = data[i] / 128.0;
            var y = v * canvasHeight / 2;
            points += `${x}, ${y} `;
            x += sliceWidth;
        }

        return points;
    }
});