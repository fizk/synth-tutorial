class XRouter extends HTMLElement {
    constructor(routes = new Map()) {
        super();
        this.routes = routes;
        this.current = undefined;
        this.onPopState = this.onPopState.bind(this);
    }

    async onPopState() {
        const path = `/${window.location.hash.substring(1)}`;
        for (const [regex, fun] of this.routes) {
            if (path.match(regex)) {
                const child = await fun(path, this.current);
                this.current
                    ? this.replaceChild(child, this.current)
                    : this.appendChild(child);
                this.dispatchEvent(new CustomEvent('x-route-change', {
                    bubbles: true,
                    cancelable: false,
                    composed: true,
                    detail: {
                        path: path,
                        previous: this.current,
                        current: child,
                        location: window.location,
                    }
                }));
                this.current = child;
                break;
            }
        }
    }

    connectedCallback() {
        this.onPopState();
        window.onpopstate = this.onPopState;
    }
}

const componentName = 'x-router';
window.customElements.define(componentName, XRouter);

export default XRouter;
export {componentName as name};