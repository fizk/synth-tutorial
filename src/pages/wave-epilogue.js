import '../machines/master.js';
import '../elements/article.js';
import validator, { conclude } from '../database/db.js';

class PageWaveEpilogue extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="styles/resources.css" >
            <element-article>
                <h2 slot="header">Wave's Epilogue</h2>
                <p>
                    In this first section, we have seen the wave.
                    It got stretched left and right to produce different frequencies. It also got
                	stretched up and down with the help of the Gain unit to increasing or decreasing its
                	amplitude
                </p>
                <p>
                    In an analogue synthesizer, the <strong>Gain</strong> is implemented with a
                    <strong>V</strong>oltage <strong>C</strong>ontrolled <strong>A</strong>mplifier (VCA)
                    <a href="http://synthesizeracademy.com/voltage-controlled-amplifier-vca/" target="_blank"><sup>[3]</sup></a>,
                    a three-terminal device
            		that takes in a source and a control voltage. It then returns through its output
            		terminal, the a modified voltage. The principal remain the same for both
            		implementations: an input, an output and a modifier.
                </p>
                <p>
                	Through out his series, this device will be refereed to as <strong>The Gain</strong>
                	and the modifier's value will be <strong>the amount</strong>.
                </p>
                <p>
                    Now that we have some control over the wave, we can start looking at practical applications
                    for it. In the next section, we will log at the Oscillator.
                </p>

                <h4 slot="aside">Resources</h4>
                <ol slot="aside" class="resources">
                    <li>
                        <a href="https://www.mathopenref.com/triggraphsine.html" target="_blank">Graph of the sine (sin) function</a>.
                    </li>
                    <li>
                        <a href="https://pages.mtu.edu/~suits/scales.html">Scales: Just vs Equal Temperament</a>
                    </li>
                    <li>
                        <a href="http://synthesizeracademy.com/voltage-controlled-amplifier-vca/" target="_blank">Voltage-Controlled Amplifier (VCA)</a>
                    </li>
                </ol>

                <a href="#wave/gain-and-amplitude" slot="footer" rel="prev">Gain and Amplitude</a>
                <a href="#oscillator" slot="footer" rel="next">Oscillator</a>
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

window.customElements.define('page-wave-epilogue', PageWaveEpilogue);
export default PageWaveEpilogue;
