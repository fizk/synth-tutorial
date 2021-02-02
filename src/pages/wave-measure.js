import '../elements/sine-wave.js';
import '../elements/article.js';
import validator, { record } from '../database/db.js';

class PageWaveMeasure extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="styles/figure.css" />
            <style>
                :host {
                    --screen-background-color: var(--color-indigo-1);
                    --screen-line-color: var(--color-gray-3);
                }

                table {
                    margin: auto;
                }
                thead th {
                    font-weight: 600;
                    text-align: center;
                    vertical-align: bottom;
                }
                td {
                    text-align: right;
                }
                th {
                    text-align: left;
                    font-weight: 300;
                }
                th, td {
                    padding: 0.41rem 0.64rem;
                }
                th span {
                    font-size: 0.8rem;
                    vertical-align: super;
                    margin-left: -2px;
                }
            </style>
            <element-article>
                <h2 slot="header">Measure the wave</h2>
                <p>
                    <strong>Hertz</strong> (Hz) is defined as one cycle per second. Or how frequently per second the
                    unit circle repeats itself. It is therefor said that something has a high or low <strong>frequency</strong>.
                </p>
                <p>
                    Hertz comply to the metric system so one kilo-hertz is a thousand hertz and so on. Audible frequencies for
                    the human ear range from 20Hz - 20kHz. Radio waves have frequencies as high as 300 GHz, or 30000000000Hz.
                </p>
                <figure class="left">
                    <sine-wave frequency="880"></sine-wave>
                    <figcaption>
                        Wave of 880Hz produces hight pitch sound, and is of hight frequency.
                    </figcaption>
                </figure>
                <p>
                    In the context of sound, different frequencies have different pitch. High frequencies have high pitch and
                    low frequencies have low pitch.
                </p>
               <figure class="right">
                    <sine-wave frequency="220"></sine-wave>
                    <figcaption>
                        Wave of 220Hz produces low pitch sound, and is of low frequency.
                    </figcaption>
                </figure>
                <p>
                    In the western music system, middle <strong>A</strong> is measured at 440Hz. The <strong>A</strong> above it,
                    which is an octave higher registers at 880Hz, while the <strong>A</strong> below registers at 220Hz.
                    The frequency therefor doubles at an exponential rate:
                    <code>a<sub>oct</sub> = a<sub>1</sub><sup>2</sup></code> or, an octave of a note is its fundamental to
                    the power of two.
                </p>

                <p slot="aside">
                    This is sometimes referred to as the "just scale", "harmonic tuning" or "Helmholtz's scale". If we were to tune a
                    piano or a guitar using this formula, the notes would spread out unevenly, resulting in one scale sounding good
                    on an instrument, let's say C major, while another, D major for example would sound out of tune.
                </p>
                <p slot="aside">
                    To counteract this, the "equal tempered scale" was developed. It uses a constant frequency multiple between the
                    notes of the chromatic scale. Hence, playing in any key sounds equally good.<sup><a href="https://pages.mtu.edu/~suits/scales.html" target="_blank">[2]</a></sup>
                </p>
                <figure slot="aside">
                    <table>
                        <thead>
                        <tr>
                            <th>Note</th>
                            <th>Just<br />Scale</th>
                            <th>Equal<br />Temperament</th>
                            <th>Difference</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>C</th> <td>261.63</td> <td>261.63</td>
                            <td>0.00</td>
                        </tr>
                        <tr>
                            <th>C<span>♯</span></th> <td>272.54</td>  <td>277.18</td>
                            <td>+4.64</td>
                        </tr>
                        <tr>
                            <th>D</th> <td>294.33</td> <td>293.66</td>
                            <td>-0.67</td>
                        </tr>
                        <tr>
                            <th>E<span>♭</span></th> <td>313.96</td> <td>311.13</td>
                            <td>-2.84</td>
                        </tr>
                        <tr>
                            <th>E</th> <td>327.03</td> <td>329.63</td>
                            <td>+2.60</td>
                        </tr>
                        <tr>
                            <th>F</th> <td>348.83</td> <td>349.23</td>
                            <td>+0.40</td>
                        </tr>
                        <tr>
                            <th>F<span>♯</span></th> <td>367.92</td> <td>369.99</td>
                            <td>+2.07</td>
                        </tr>
                        <tr>
                            <th>G</th> <td>392.44</td> <td>392.00</td>
                            <td>-0.44</td>
                        </tr>
                        <tr>
                            <th>A<span>♭</span></th> <td>418.60</td> <td>415.30</td>
                            <td>-3.30</td>
                        </tr>
                        <tr>
                            <th>A</th> <td>436.05</td> <td>440.00</td>
                            <td>+3.94</td>
                        </tr>
                        <tr>
                            <th>B<span>♭</span></th> <td>470.93</td> <td>466.16</td>
                            <td>-4.77</td>
                        </tr>
                        <tr>
                            <th>B</th> <td>490.55</td> <td>493.88</td>
                            <td>+3.33</td>
                        </tr>
                        <tr>
                            <th>C</th> <td>523.25</td> <td>523.25</td>
                            <td>0.00</td>
                        </tr>
                    </tbody></table>
                    <figcaption>

                    </figcaption>
                </figure>
                <p slot="aside">
                    We will be using both scale types in this tutorial, so while similar, they
                    are not the same thing. One occurs naturally in nature, the other is man-made.
                </p>

                <a href="#wave/sequence-of-numbers" rel="prev" slot="footer">Sequence of numbers</a>
                <a href="#wave/gain-and-amplitude" rel="next" slot="footer">Gain and Amplitude</a>
            </element-article>
        `;
    }

    onAfterEnter(location) {
        this.properties = {
            from: Date.now(),
            path: location.pathname,
            relm: location.pathname.split('/').filter(Boolean)[0],
            object: {},
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

window.customElements.define('page-wave-measure', PageWaveMeasure);
export default PageWaveMeasure;