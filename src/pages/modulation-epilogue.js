import '../elements/article.js';
import validator, { conclude } from '../database/db.js';

class PageModulationEpilogue extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="styles/resources.css" />
            <element-article>
                <h2 slot="header">Modulation's Epilogue</h2>

                <h3 slot="aside">Resources</h3>
                <ol class="resources" slot="aside">
                    <li>
                        <a href="https://www.soundonsound.com/techniques/amplitude-modulation" target="_blank">soundonsound</a>
                    </li>
                </ol>

                <a href="#modulation/fm-synth" slot="footer" rel="prev">FM Synth</a>
                <a href="#additive-synthesis" slot="footer" rel="next">Additive Synthesis</a>
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

window.customElements.define('page-modulation-epilogue', PageModulationEpilogue);
export default PageModulationEpilogue;