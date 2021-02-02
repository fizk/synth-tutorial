import '../elements/workstation.js';
import '../machines/master.js';
import '../machines/theremin.js';
import '../elements/article.js';
import '../pads/theremin.js'
import validator, { record } from '../database/db.js';

class PageOscillatorTheremin extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="styles/figure.css" />
            <style>
                :host {
                    --theremin-background: var(--screen-background-color);
                    --theremin-object: var(--screen-line-color);
                }
                blockquote {
                    font-style: italic;
                }

                figure {
                    float: left;
                    width: 50%;
                    margin: 1rem 2rem 1rem 0;
                }
                figure img {
                    width: 100%;
                    height: auto;
                }

            </style>
            <element-article>
                <h2 slot="header">Theremin</h2>
                <figure>
                    <img src="https://www.createdigital.org.au/wp-content/uploads/2019/11/theremin-1140x783.jpg" width="257" height="176" />
                    <figcaption>
                    Alexandra Stepanoff playing the theremin on NBC Radio, 1930 (Wikimedia Commons)
                    </figcaption>
                </figure>

                <p>
                    Arguable one of the first electronic instrument was the
                    <strong>Theremin</strong>. At its core it
                    plays with the two controls we have been discussing: frequency and amplitude.
                </p>
                <blockquote>
                    The instrument's controlling section usually consists of two metal antennas that sense
                    the relative position of the thereminist's hands and control oscillators for frequency
                    with one hand, and amplitude (volume) with the other. The electric signals from the theremin
                    are amplified and sent to a loudspeaker.
                    <sup><a href="https://en.wikipedia.org/wiki/Theremin" target="_blank">[1]</a></sup>
                </blockquote>
                <p>
                    Grab the ball on the right and move it up and down for pitch and left and right
                    for volume.
                </p>

                <pad-theremin slot="aside"></pad-theremin>

                <a href="#oscillator" slot="footer" rel="prev">Oscillator</a>
                <a href="#oscillator/epilogue" slot="footer" rel="next">Epilogue</a>
            </element-article>
        `;
    }

    connectedCallback() {
        this.addEventListener('start', () => this.properties.object.toggle = true);
    }

    onAfterEnter(location) {
        this.properties = {
            from: Date.now(),
            path: location.pathname,
            relm: location.pathname.split('/').filter(Boolean)[0],
            object: { toggle: false },
        };
    }

    async onBeforeLeave(location, commands, router) {
        try {
            const result = await record({
                ...this.properties,
                to: Date.now(),
            }, validator(location.route.parent.children.length - 1));

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

window.customElements.define('page-oscillator-theremin', PageOscillatorTheremin);
export default PageOscillatorTheremin;