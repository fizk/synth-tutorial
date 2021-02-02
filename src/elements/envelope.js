window.customElements.define('element-envelope', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                svg {
                    background-color: var(--envelope-background, #0e0e1d);
                }
                path {
                    stroke-width: var(--envelope-stroke-width, 1px);
                    stroke: var(--envelope-stroke, #faebd7);
                    fill: none;
                }
                line {
                    stroke-width: var(--envelope-marker-stroke-width, 1px);
                    stroke: var(--envelope-marker-stroke, #faebd7);
                    fill: none;
                    stroke-dasharray: var(--envelope-marker-dash, 2);
                }
            </style>
            <svg  viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" width="400" height="100">
                <path />
                <line />
            </svg>
        `;

        this.updatePath = this.updatePath.bind(this);
    }

    connectedCallback() {
        !this.hasAttribute('a') && this.setAttribute('a', '100');
        !this.hasAttribute('d') && this.setAttribute('d', '100');
        !this.hasAttribute('s') && this.setAttribute('s', '50');
        !this.hasAttribute('r') && this.setAttribute('r', '50');
        !this.hasAttribute('cursor') && this.setAttribute('cursor', '0');
        !this.hasAttribute('width') && this.setAttribute('width', '400');
        !this.hasAttribute('height') && this.setAttribute('height', '100');

        const canvas = this.shadowRoot.querySelector('svg');
        canvas.setAttributeNS(null, 'viewBox', `0 0 ${this.getAttribute('width')} ${this.getAttribute('height')}`);
        canvas.setAttributeNS(null, 'height', this.getAttribute('height'));
        canvas.setAttributeNS(null, 'width', this.getAttribute('width'));

        this.updatePath();
    }

    static get observedAttributes() {
        return ['a', 'd', 's', 'r', 'cursor', 'width', 'height'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const canvas = this.shadowRoot.querySelector('svg');

        switch (name) {
            case 'a':
            case 'd':
            case 's':
            case 'r':
            case 'cursor':
                if (newValue > 100 || newValue < 0) {
                    return false;
                }
                break;
            case 'width':
                canvas.setAttributeNS(null, 'viewBox', `0 0 ${newValue} ${this.getAttribute('height') || '100'}`);
                canvas.setAttributeNS(null, 'width', newValue);
                break;
            case 'height':
                canvas.setAttributeNS(null, 'viewBox', `0 0 ${this.getAttribute('width') || '400'} ${newValue}`);
                canvas.setAttributeNS(null, 'height', newValue);
                break;
        }
        this.updatePath();
    }

    updatePath() {
        const a = Number(this.getAttribute('a'));
        const d = Number(this.getAttribute('d'));
        const s = Number(this.getAttribute('s'));
        const r = Number(this.getAttribute('r'));
        const cursor = Number(this.getAttribute('cursor'));
        const width = Number(this.getAttribute('width'));
        const height = Number(this.getAttribute('height'));
        const space = width / 4;
        const aRatio = space * (a / 100);
        const dRatio = space * (d / 100);
        const sRatio = height - ((height / 100) * s);
        const rRatio = space * (r / 100);

        const pathElement = this.shadowRoot.querySelector('path');
        const cursorElement = this.shadowRoot.querySelector('line');

        pathElement.setAttributeNS(null, 'd', `
        M 0,${height}
        L ${aRatio}, 0
        L ${aRatio + dRatio}, ${sRatio}
        L ${width - rRatio}, ${sRatio}
        L ${width}, ${height}
    `);

        const position = (width / 100) * cursor;
        cursorElement.setAttributeNS(null, 'x1', position);
        cursorElement.setAttributeNS(null, 'y1', '0');
        cursorElement.setAttributeNS(null, 'x2', position);
        cursorElement.setAttributeNS(null, 'y2', height);
    }
});
