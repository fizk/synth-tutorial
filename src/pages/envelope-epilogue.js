import '../elements/article.js';
import validator, { conclude } from '../database/db.js';

class PageEnvelopeEpilogue extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="styles/figure.css" />
            <link rel="stylesheet" href="styles/resources.css" />
            <style>
                .diagram {
                    background-color: var(--screen-background-color);
                }
                .diagram__selection {
                    fill: var(--screen-selection);
                    stroke: none;
                }
                .diagram__path {
                    fill: none;
                    stroke-width: var(--screen-line-width);
                    stroke: var(--screen-line-color);
                }
                .diagram__text {
                    fill: var(--screen-line-color);
                    stroke: none;
                }
            </style>
            <element-article>
                <h2 slot="header">Envelope's Epilogue</h2>
                <p>
                    Often ADSR envelopes are explained in the context of bowed instruments like cellos, violins etc... and are
                    connected to a Gain module to replicate the movement of a bow going across strings. That is indeed what we did
                    in the previous example. This is however far from the only use-case for an ADSR, not only can we control
                    volume and pitch but we can also control filters and many other modules using ADSR. Any time we want control
                    of any type of source over time, the ADSR is a good candidate for that.
                </p>
                <p>
                    Not only that, but there are many types of Envelopes. The famous
                    <a href="https://www.yamaha.com/en/about/design/synapses/id_009/" target="_blank">Yamaha DX7</a> has a five step Envelope: an
                    A D<sub>1</sub> D<sub>2</sub> S R. The <a href="http://www.vintagesynth.com/casio/cz1.php" target="_blank">Casio CZ-1</a>
                    has an eight step Envelope, three for decay and three for release plus the attack and the sustain.
                </p>
                <p>
                    Building an ADSR in an analogue synth is usually implemented with transistors and series of circuits all depending
                    on which type of Envelope is required<a href="https://www.schmitzbits.de/adsr.html" target="_blank"><sup>[2]</sup></a>
                </p>
                <figure slot="aside">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400.77 101.15" class="diagram">
                        <rect class="diagram__selection" x="200.34" width="100.09" height="100.61"></rect>
                        <path class="diagram__path" d="M2,103,102,3l22.55,36,32.29,9.77,22.9,34.91L202,34H302l20.39,35.4,34.92-34.16L402,103" transform="translate(-1.65 -2.2)"></path>
                        <text class="diagram__text" transform="translate(29.43 56.69)">1</text>
                        <text class="diagram__text" transform="translate(121.31 23.29)">2</text>
                        <text class="diagram__text" transform="translate(131.33 60.58)">3</text>
                        <text class="diagram__text" transform="translate(152.1 72.22)">4</text>
                        <text class="diagram__text" transform="translate(175.38 57.96)">5</text>
                        <text class="diagram__text" transform="translate(312.27 46.32)">6</text>
                        <text class="diagram__text" transform="translate(341.18 65.84)">7</text>
                        <text class="diagram__text" transform="translate(377.97 59.46)">8</text>
                        <text class="diagram__text" transform="translate(227.02 28.65)">sustain</text>
                    </svg>
                    <figcaption>
                        The Casio CZ-1 Envelope's eight stages.
                    </figcaption>
                </figure>

                <h4 slot="aside">Resources</h4>
                <ol class="resources" slot="aside">
                    <li><a href="https://en.wikipedia.org/wiki/Envelope_(music)" target="_blank">Envelope</a></li>
                    <li><a href="https://www.schmitzbits.de/adsr.html" target="_blank">Discrete ADSR</a></li>
                </ol>
                <a href="#envelope/adsr" slot="footer" rel="prev">ADSR</a>
                <a href="#modulation" slot="footer" rel="next">Modulation</a>
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

window.customElements.define('page-envelope-epilogue', PageEnvelopeEpilogue);
export default PageEnvelopeEpilogue;