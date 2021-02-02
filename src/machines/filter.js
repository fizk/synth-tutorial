window.customElements.define('machine-filter', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    background-color: var(--machine-color);
                    padding: 1rem;

                    --machine-color: #BCAAA4;
                }
                h4 {
                    margin: 0;
                }
                svg {
                    background-color: var(--screen-background-color);
                }
                polyline {
                    stroke: var(--machine-color);
                    stroke-width: var(--screen-line-width);
                    fill: none;
                }

                line {
                    stroke: var(--machine-color);
                    stroke-width: var(--screen-marker-line-width);
                    fill: none;
                }
                text {
                    fill: var(--machine-color);
                    font: 10px sans-serif;
                }

                ul {
                    padding: 0;
                    list-style: none;
                }
            </style>
            <h4>Filter</h4>
            <div>
                <ul>
                    <li>
                        <label>type</label>
                        <select data-type>
                            <option value="lowpass">lowpass</option>
                            <option value="highpass">highpass</option>
                            <option value="bandpass">bandpass</option>
                        </select>
                    </li>
                    <li>
                        <label>frequency</label>
                        <input type="range" data-frequency-range min="10" max="2000" />
                        <output data-frequency-value></output>
                    </li>
                    <li>
                        <label>q</label>
                        <input type="range" data-q-range min="0.0001" max="50" />
                        <output data-q-value></output>
                    </li>
                </ul>
            </div>
            <svg  viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" width="300" height="100">
                <g></g>
                <polyline />
            </svg>
        `;
    }

    static get observedAttributes() { return ['frequency', 'type', 'q']; }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'frequency':
                this.shadowRoot.querySelector('[data-frequency-range]').value = newValue;
                this.shadowRoot.querySelector('[data-frequency-value]').innerHTML = newValue;
                break;
            case 'q':
                this.shadowRoot.querySelector('[data-q-range]').value = newValue;
                this.shadowRoot.querySelector('[data-q-value]').innerHTML = newValue;
                break;
            case 'type':
                this.shadowRoot.querySelector('[data-type]').value = newValue;
                break;
        }
    }

    connectedCallback() {
        //Frequency
        // if (!this.hasAttribute('frequency') ) {
        //     this.setAttribute('frequency', '440');
        // }

        const namespace = 'http://www.w3.org/2000/svg';
        const svgElement = this.shadowRoot.querySelector('svg');
        const groupElement = this.shadowRoot.querySelector('g');
        const svgElementHeight = Number(svgElement.getAttributeNS(null, 'height'));
        const svgElementWidth = Number(svgElement.getAttributeNS(null, 'width'));

        this.shadowRoot.querySelector('[data-frequency-range]').addEventListener('input', (event) => {
            this.dispatchEvent(new CustomEvent('frequency-change', {
                detail: Number(event.target.value)
            }));
            this.setAttribute('frequency', event.target.value);
        });
        this.shadowRoot.querySelector('[data-q-range]').addEventListener('input', (event) => {
            this.dispatchEvent(new CustomEvent('q-change', {
                detail: Number(event.target.value)
            }));
            this.setAttribute('q', event.target.value);
        });

        this.shadowRoot.querySelector('[data-type]').addEventListener('change', (event) => {
            this.dispatchEvent(new CustomEvent('type-change', {
                detail: event.target.value
            }));
            this.setAttribute('type', event.target.value);
        });
        const oct = 10;
        var scale = 60;
        const sampleRate = 44100;

        // Frequency lines and text
        for (var f = 10; f < sampleRate / 2; f *= 10) {
            for (var n = 1; n < 10; n++) {
                var x = f * n;
                var i = Math.round(
                    ((Math.log(x / sampleRate) + Math.log(2) * oct + Math.log(2)) * svgElementWidth) / (Math.log(2) * oct)
                );


                if (
                    x == 1e2 ||
                    x == 2e2 ||
                    x == 4e2 ||
                    x == 1e3 ||
                    x == 2e3 ||
                    x == 4e3 ||
                    x == 1e4
                ) {

                    const lineElement = document.createElementNS(namespace, 'line');
                    lineElement.setAttributeNS(null, 'x1', i);
                    lineElement.setAttributeNS(null, 'y1', 0);
                    lineElement.setAttributeNS(null, 'x2', i);
                    lineElement.setAttributeNS(null, 'y2', svgElementHeight);

                    groupElement.appendChild(lineElement);

                    const textElement = document.createElementNS(namespace, 'text');
                    textElement.innerHTML = `${x}`;
                    textElement.setAttributeNS(null, 'x', i);
                    textElement.setAttributeNS(null, 'y', svgElementHeight - 10);
                    groupElement.appendChild(textElement);
                    // ctx.fillText(x + "Hz", i, canvas.height - 10);
                }
            }
        }

        // volume lines and text;
        for (var db = -100; db < 60; db += 20) {
            var y = ((svgElementHeight * scale) - (db * svgElementHeight)) / (3 * scale);

            const lineElement = document.createElementNS(namespace, 'line');
            lineElement.setAttributeNS(null, 'x1', 0);
            lineElement.setAttributeNS(null, 'y1', y);
            lineElement.setAttributeNS(null, 'x2', svgElementWidth);
            lineElement.setAttributeNS(null, 'y2', y);
            groupElement.appendChild(lineElement);

            const textElement = document.createElementNS(namespace, 'text');
            textElement.appendChild(document.createTextNode(`${db}dB`))
            textElement.setAttributeNS(null, 'x', 0);
            textElement.setAttributeNS(null, 'y', y);
            groupElement.appendChild(textElement);
        }
    }


    set frequencyData(data) {

        var scale = 60;
        const svgElement = this.shadowRoot.querySelector('svg');
        const height = Number(svgElement.getAttributeNS(null, 'height'));
        const width = Number(svgElement.getAttributeNS(null, 'width'));
        const polylineElement = this.shadowRoot.querySelector('polyline');

        const pointArray = [];
        for (let i = 0; i < width; i++) {
            let db = 20 * Math.log(data[i]) / Math.LN10; // no warnings
            pointArray.push({
                x: i,
                y: ((height * scale) - (db * height)) / (3 * scale)
            });
        }

        const points = pointArray.reduce((previous, current) => {
            return previous + `${current.x}, ${current.y} `;
        }, '');

        polylineElement.setAttributeNS(null, 'points', points);









        // // ctx.beginPath();
        // // ctx.fillStyle = "#660000";
        // // for (var db = -100; db < 60; db += 20) {
        // //     var y = ((canvas.height * scale) - (db * canvas.height)) / (3 * scale);
        // //     ctx.moveTo(0, y);
        // //     ctx.lineTo(width, y);
        // //     ctx.fillText(db + "dB", 0, y);
        // // }
        // // ctx.stroke();

        // const svgElement = this.shadowRoot.querySelector('svg');
        // const polylineElement = this.shadowRoot.querySelector('polyline');

        // const pointArray = [];

        // ctx.beginPath();
        // ctx.strokeStyle = "#990000";
        // ctx.lineWidth = 2;
        // ctx.moveTo(0, canvas.height);
        // for (var i = 0; i < width; i++) {
        //     var db = 20 * Math.log(magResponse[i]) / Math.LN10; // no warnings

        //     pointArray.push({
        //         x: i,
        //         y: ((canvas.height * scale) - (db * canvas.height)) / (3 * scale)
        //     });

        //     if (i === 0 ) {
        //         ctx.moveTo(i, ((canvas.height * scale) - (db * canvas.height)) / (3 * scale));
        //     } else {
        //         ctx.lineTo(i, ((canvas.height * scale) - (db * canvas.height)) / (3 * scale));
        //     }

        // }

        // const points = pointArray.reduce((previous, current) => {
        //     return previous + `${current.x}, ${current.y} `;
        // }, '');

        // polylineElement.setAttributeNS(null, 'points', points);
        // ctx.stroke();


        // // ctx.beginPath();
        // // ctx.fillStyle = "#006600";
        // // for (var deg = -270; deg <= 270; deg += 90) {
        // //     var y = (deg + 360) * canvas.height / (360 * 2); // no warnings
        // //     //			ctx.moveTo(0, y);
        // //     //			ctx.lineTo(width, y);
        // //     ctx.fillText(deg + "Â°", width - 100, y);
        // // }
        // // ctx.stroke();

        // // ctx.strokeStyle = "#009900";
        // // ctx.beginPath();
        // // ctx.moveTo(0, canvas.height);
        // // for (var i = 0; i < width; i++) {
        // //     var phase = phaseResponse[i] + Math.PI;
        // //     var degree = phaseResponse[i] * (180 / Math.PI);
        // //     ctx.lineTo(i, (degree + 360) * canvas.height / (360 * 2));
        // // }
        // // ctx.stroke();
    }
});