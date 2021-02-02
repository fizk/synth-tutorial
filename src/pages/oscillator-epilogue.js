import '../elements/article.js';
import validator, { conclude } from '../database/db.js';

class PageOscillatorEpilogue extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="styles/resources.css" />
            <element-article>
                <h2 slot="header">Oscillator's Epilogue</h2>
                <p>
                    In this part we connected some modules together and generated sound. An important component is
                    <strong>The Master</strong>, it is representing the final destination for the waves we generate
                    and it displays some very useful information. We will explore them in little more details later.
                    The focus still was on the <strong>The Oscillator</strong>.
                </p>
                <p>
                    In analogue synthesizers, this is implemented with many types of
                    oscillators<sup><a href="https://www.elprocus.com/different-types-of-oscillators-circuits/" target="_blank">[2]</a></sup>.
                    One of them is the <strong>V</strong>oltage <strong>C</strong>ontroller <strong>O</strong>scillator (VCO)
                    <sup><a href="https://www.allaboutcircuits.com/projects/diy-synth-series-vco/" target="_blank">[3]</a></sup>.
                    An electronic circuit that generates a periodic, oscillating electronic signals.
                </p>

                <h4 slot="aside" >Resources</h4>
                <ol slot="aside" class="resources">
                    <li>
                        <a href="https://en.wikipedia.org/wiki/Theremin" target="_blank">Theremin</a>
                    </li>
                    <li>
                        <a href="https://www.elprocus.com/different-types-of-oscillators-circuits/" target="_blank">Different Types of Oscillators Circuits</a>
                    </li>
                    <li>
                        <a href="https://www.allaboutcircuits.com/projects/diy-synth-series-vco/" target="_blank">The Exponential VCO</a>
                    </li>
                </ol>
                <a href="#oscillator/theremin" slot="footer" rel="prev">Theremin</a>
                <a href="#envelope" slot="footer" rel="next">Envelope</a>
            </element-article>
        `;
    }

    async onAfterEnter(location, commands, router) {
        this.properties = {
            from: Date.now(),
            path: location.pathname,
            relm: location.pathname.split('/').filter(Boolean)[0],
        };
        try {
            const result = await conclude(
                validator(location.route.parent.children.length - 1),
                this.properties.relm
            );

            if (result) {
                this.dispatchEvent(new CustomEvent('update-score', {
                    composed: true,
                    detail: result,
                }));
            }

        } catch (e) {
            console.warn(e);
        }
    }
}

window.customElements.define('page-oscillator-epilogue', PageOscillatorEpilogue);
export default PageOscillatorEpilogue;