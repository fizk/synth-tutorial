window.customElements.define('element-article', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                article {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-areas:
                        "header header"
                        "main aside"
                        "footer aside";
                    grid-gap: 2rem;
                    max-width: 960px;
                }
                header{
                    grid-area: header;
                }
                main{
                    grid-area: main;
                }
                aside{
                    grid-area: aside;
                }
                footer{
                    padding: 2rem 0;
                    grid-area: footer;
                    text-align: end;
                }

                ::slotted(a[rel=prev]) {
                    display: inline-block;
                    color: #bdb8b8;
                    text-decoration: none;
                    margin: 1rem;
                }

                ::slotted(a[rel=next]) {
                    display: inline-block;
                    color: inherit;
                    font-weight: 600;
                    text-decoration: none;
                    border: 2px solid var(--link-color, blue);
                    margin: 1rem;
                    padding: .5rem 1rem;
                    border-radius: .5rem;
                }
            </style>
            <article>
                <header>
                    <slot name="header"></slot>
                </header>
                <main>
                    <slot></slot>
                </main>
                <aside>
                    <slot name="aside"></slot>
                </aside>
                <footer>
                    <slot name="footer"></slot>
                </footer>
            </article>
        `;
    }
});