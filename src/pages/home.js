import '../elements/article.js'

class PageHome extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                #synth {
                    animation: hover 2.4s infinite ease-in-out;
                    animation-direction: alternate;
                }
                @keyframes hover {
                    0% {
                        transform: translate(0, 0);
                    }
                    100% {
                        transform: translate(0, .5rem);
                    }
                }
                #shadow {
                    animation: strech 2.4s infinite ease-out;
                    animation-direction: alternate;
                    transform-origin: center;
                }
                @keyframes strech {
                    0% {
                        transform: scaleX(1.0);
                    }
                    100% {
                        transform: scaleX(0.9);
                    }
                }
            </style>
            <element-article>
                <h2 slot="header">Welcome</h2>

                <p>
                    This is an interactive exploration into the building blocks of <strong>audio synthesis</strong>.
                </p>
                <p>
                    So put on your headphones and adjust your volume. Don't be afraid to tweak sliders and push buttons, they are there
                    to demonstrate concepts and explain ideas.
                </p>
                <p>
                    Fist up, the basic of the basic... the Wave.
                </p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 327.41 265.5" slot="aside">
                    <defs>
                        <style>.cls-1{fill:#ed6262;}.cls-2{fill:#e0dede;}.cls-3{fill:#302f2f;}.cls-4{fill:#070606;}.cls-5{fill:#423f3f;}.cls-6{fill:#3f3d3d;}.cls-7{fill:#3a3939;}.cls-8{fill:#2b2a2a;}.cls-9{fill:#1c1b1b;}.cls-10{fill:#fff;}.cls-11{fill:#848181;}.cls-12{fill:#444343;}.cls-13{fill:#232222;}.cls-14{fill:#666565;}.cls-15{fill:#2d2825;}.cls-16{fill:#2d2c2c;}.cls-17{fill:#fffefd;}.cls-18{fill:#d8d7d6;}.cls-19{fill:#545352;}.cls-20{fill:#d39b5e;}.cls-21{fill:#d6e27a;}.cls-22{fill:#b57764;}.cls-23{fill:#ceaa9d;}.cls-24{fill:#5d76a3;}.cls-25{fill:#9ea4cc;}.cls-26{fill:#b29664;}.cls-27{fill:#efeda5;}</style>
                    </defs>

                    <g id="shadow">
                        <ellipse class="cls-2" cx="160.18" cy="236.77" rx="73.77" ry="14.92"/>
                    </g>
                    <g id="synth">
                        <g id="Layer_2">
                            <polygon class="cls-3" points="54.13 184.87 38.65 202.14 35.49 177.7 52.25 118.05 54.13 184.87"/>
                            <polygon class="cls-4" points="286.67 179.82 282.8 204.81 268.44 167.08 274.07 132.17 286.67 179.82"/>
                            <polygon class="cls-5" points="35.49 177.7 33.27 177.5 47.49 130.97 48.97 129.5 35.49 177.7"/>
                            <polygon class="cls-6" points="288.71 179.82 286.67 179.82 274.07 132.17 273.86 119.71 288.71 179.82"/>
                            <polygon class="cls-7" points="275.34 145.26 45.84 144.76 47.7 53.47 276.18 53.9 275.34 145.26"/>
                            <polygon class="cls-8" points="40.1 188.34 282.52 190.03 283.64 194.25 37.85 192 40.1 188.34"/>
                            <polygon class="cls-9" points="282.8 203.83 38.98 201.14 37.85 192 283.64 194.25 282.8 203.83"/>
                            <polygon class="cls-2" points="282.52 190.03 40.1 188.34 38.83 180.74 283.79 182.15 282.52 190.03"/>
                            <polygon class="cls-10" points="283.79 182.15 38.83 180.74 47.84 143.29 275.34 145.26 283.79 182.15"/>
                            <polygon class="cls-9" points="38.64 202.14 36.67 201.95 33.27 177.5 35.49 177.7 38.64 202.14"/>
                            <polygon class="cls-9" points="284.89 204.74 282.8 204.81 286.67 179.82 288.71 179.82 284.89 204.74"/>
                            <polygon class="cls-11" points="275.76 56.63 47.99 56.26 47.99 53.72 275.67 54.51 275.76 56.63"/>
                        </g>
                        <g id="Layer_3">
                            <polygon class="cls-12" points="64.38 142.09 57.98 141.88 53.33 157.51 59.17 157.72 64.38 142.09"/>
                            <polygon class="cls-13" points="59.17 157.72 53.33 157.51 53.19 165.32 59.59 165.5 59.17 157.72"/>
                            <polygon class="cls-14" points="64.38 142.09 65.05 145.33 59.59 165.5 59.17 157.72 64.38 142.09"/>
                            <polygon class="cls-12" points="82.05 142.12 75.9 142.21 71.8 157.53 77.64 157.74 82.05 142.12"/>
                            <polygon class="cls-13" points="77.64 157.74 71.8 157.53 71.72 165.53 78.06 165.52 77.64 157.74"/>
                            <polygon class="cls-14" points="82.05 142.12 82.99 145.26 78.06 165.52 77.64 157.74 82.05 142.12"/>
                            <polygon class="cls-12" points="108.89 142.54 102.88 142.45 99.77 157.6 106.08 157.85 108.89 142.54"/>
                            <polygon class="cls-13" points="106.08 157.85 99.77 157.6 99.69 165.6 106.03 165.59 106.08 157.85"/>
                            <polygon class="cls-14" points="108.89 142.54 109.31 145.54 106.03 165.59 106.08 157.85 108.89 142.54"/>
                            <polygon class="cls-12" points="125.94 142.66 119.71 142.62 117.3 157.91 123.6 158.17 125.94 142.66"/>
                            <polygon class="cls-13" points="123.6 158.17 117.3 157.91 117.22 165.92 124 165.89 123.6 158.17"/>
                            <polygon class="cls-14" points="125.94 142.66 126.84 145.86 124 165.89 123.6 158.17 125.94 142.66"/>
                            <polyline class="cls-12" points="136.86 142.59 135.18 157.91 141.48 158.17 142.68 142.54"/>
                            <polygon class="cls-13" points="141.48 158.17 135.18 157.91 135.09 166.27 141.87 166.23 141.48 158.17"/>
                            <polyline class="cls-14" points="143.47 145.92 141.88 165.89 141.48 158.17 142.68 142.54"/>
                            <polyline class="cls-12" points="164.36 143.01 163.86 158.39 170.17 158.65 170.46 142.96"/>
                            <polygon class="cls-13" points="170.17 158.65 163.86 158.39 163.78 166.75 170.56 166.71 170.17 158.65"/>
                            <polyline class="cls-12" points="182.19 143.15 182.35 158.75 188.66 159 188.24 143.25"/>
                            <polygon class="cls-13" points="188.66 159 182.35 158.75 182.27 167.1 189.05 167.07 188.66 159"/>
                            <polyline class="cls-12" points="209.35 143.29 210.9 158.32 216.99 158.46 215.23 143.33"/>
                            <polygon class="cls-13" points="216.99 158.46 210.9 158.32 210.83 166.84 217.39 166.95 216.99 158.46"/>
                            <polyline class="cls-14" points="209.35 143.29 210.9 158.32 210.83 166.84 208.68 147.94"/>
                            <polyline class="cls-12" points="226.59 143.57 229 158.69 235.08 158.84 232.65 143.54"/>
                            <polygon class="cls-13" points="235.08 158.84 229 158.69 228.92 167.21 235.49 167.32 235.08 158.84"/>
                            <polyline class="cls-14" points="226.59 143.57 229 158.69 228.92 167.21 226.24 148.25"/>
                            <polyline class="cls-12" points="243.94 143.89 247 158.99 253.09 159.13 250 143.82"/>
                            <polygon class="cls-13" points="253.09 159.13 247 158.99 247.01 167.15 253.84 167.4 253.09 159.13"/>
                            <polyline class="cls-14" points="243.94 143.89 247 158.99 246.93 167.51 243.7 150.05"/>
                        </g>
                        <g id="Layer_6">
                            <ellipse class="cls-15" cx="415.97" cy="364.27" rx="5.48" ry="7.58" transform="translate(-317.61 -249.13) rotate(-4.2)"/>
                            <circle class="cls-16" cx="123.69" cy="78.55" r="7.22"/>
                            <circle class="cls-17" cx="123.76" cy="78.55" r="5.38"/>
                            <path class="cls-18" d="M416.27,359l3.62-3.37a5.28,5.28,0,0,0-6.84-1.12l2.76,4.59-4.07,3.49a5.29,5.29,0,0,0,7.48.65Z" transform="translate(-292.07 -280.54)"/>
                            <rect class="cls-15" x="442.22" y="345.8" width="5.48" height="28.32" transform="translate(-291.19 -281.63) rotate(0.14)"/>
                            <rect class="cls-19" x="443.58" y="348.56" width="3.81" height="24.63" transform="translate(-291.19 -281.63) rotate(0.14)"/>
                            <rect class="cls-20" x="443.16" y="349.16" width="3.75" height="8.64" transform="translate(-291.21 -281.63) rotate(0.14)"/>
                            <rect class="cls-21" x="443.78" y="350.7" width="2.82" height="6.74" transform="translate(-291.21 -281.63) rotate(0.14)"/>
                            <rect class="cls-14" x="511.51" y="391.48" width="9.36" height="13.86" transform="matrix(1, 0, 0, 1, -291, -281.94)"/>
                            <rect class="cls-22" x="511.52" y="390.13" width="9.36" height="13.86" transform="matrix(1, 0, 0, 1, -291, -281.94)"/>
                            <rect class="cls-23" x="511.85" y="390.86" width="8.5" height="12.73" transform="translate(-291 -281.94) rotate(0.15)"/>
                            <ellipse class="cls-15" cx="394.72" cy="364.27" rx="5.48" ry="7.58" transform="translate(-323.5 -243.22) rotate(-5.21)"/>
                            <circle class="cls-16" cx="102.43" cy="78.55" r="7.22"/>
                            <circle class="cls-17" cx="102.5" cy="78.55" r="5.38"/>
                            <path class="cls-18" d="M395,359l3.63-3.37a5.29,5.29,0,0,0-6.85-1.12l2.76,4.59-4.07,3.49a5.29,5.29,0,0,0,7.48.65Z" transform="translate(-292.07 -280.54)"/>
                            <ellipse class="cls-15" cx="417.11" cy="396.99" rx="5.48" ry="7.58" transform="translate(-321.54 -247.08) rotate(-4.44)"/>
                            <circle class="cls-16" cx="123.83" cy="111.27" r="7.22"/>
                            <circle class="cls-17" cx="123.9" cy="111.27" r="5.38"/>
                            <path class="cls-18" d="M416.41,391.67,420,388.3a5.28,5.28,0,0,0-6.84-1.12l2.76,4.59-4.07,3.49a5.29,5.29,0,0,0,7.48.65Z" transform="translate(-292.07 -280.54)"/>
                            <ellipse class="cls-15" cx="395.86" cy="396.99" rx="5.48" ry="7.58" transform="translate(-352.45 -209.37) rotate(-9.55)"/>
                            <circle class="cls-16" cx="102.57" cy="111.27" r="7.22"/>
                            <circle class="cls-17" cx="102.64" cy="111.27" r="5.38"/>
                            <path class="cls-18" d="M395.15,391.67l3.63-3.37a5.29,5.29,0,0,0-6.85-1.12l2.76,4.59-4.07,3.49a5.29,5.29,0,0,0,7.48.65Z" transform="translate(-292.07 -280.54)"/>
                            <rect class="cls-15" x="456.6" y="345.8" width="5.48" height="28.32" transform="translate(-291.19 -281.66) rotate(0.14)"/>
                            <rect class="cls-19" x="457.95" y="348.56" width="3.81" height="24.63" transform="matrix(1, 0, 0, 1, -291.19, -281.67)"/>
                            <rect class="cls-20" x="457.54" y="361.16" width="3.75" height="8.64" transform="translate(-291.18 -281.67) rotate(0.14)"/>
                            <rect class="cls-21" x="458.15" y="362.7" width="2.82" height="6.74" transform="translate(-291.18 -281.67) rotate(0.14)"/>
                            <rect class="cls-15" x="471.05" y="345.8" width="5.48" height="28.32" transform="translate(-291.19 -281.7) rotate(0.14)"/>
                            <rect class="cls-19" x="472.41" y="348.56" width="3.81" height="24.63" transform="matrix(1, 0, 0, 1, -291.19, -281.7)"/>
                            <rect class="cls-20" x="471.99" y="354.16" width="3.75" height="8.64" transform="translate(-291.2 -281.7) rotate(0.14)"/>
                            <rect class="cls-21" x="472.61" y="355.7" width="2.82" height="6.74" transform="translate(-291.19 -281.7) rotate(0.14)"/>
                            <rect class="cls-15" x="485.03" y="345.8" width="5.48" height="28.32" transform="translate(-291.19 -281.73) rotate(0.14)"/>
                            <rect class="cls-19" x="486.39" y="348.56" width="3.81" height="24.63" transform="matrix(1, 0, 0, 1, -291.19, -281.74)"/>
                            <rect class="cls-20" x="485.97" y="363.16" width="3.75" height="8.64" transform="translate(-291.17 -281.73) rotate(0.14)"/>
                            <rect class="cls-21" x="486.59" y="364.7" width="2.82" height="6.74" transform="translate(-291.17 -281.74) rotate(0.14)"/>
                            <rect class="cls-15" x="442.79" y="380.39" width="5.48" height="28.32" transform="translate(-291.11 -281.63) rotate(0.14)"/>
                            <rect class="cls-19" x="444.15" y="383.15" width="3.81" height="24.63" transform="matrix(1, 0, 0, 1, -291.11, -281.63)"/>
                            <rect class="cls-20" x="443.73" y="391.74" width="3.75" height="8.64" transform="translate(-291.1 -281.63) rotate(0.14)"/>
                            <rect class="cls-21" x="444.35" y="393.29" width="2.82" height="6.74" transform="translate(-291.1 -281.63) rotate(0.14)"/>
                            <rect class="cls-15" x="457.17" y="380.39" width="5.48" height="28.32" transform="translate(-291.11 -281.67) rotate(0.14)"/>
                            <rect class="cls-19" x="458.52" y="383.15" width="3.81" height="24.63" transform="matrix(1, 0, 0, 1, -291.11, -281.67)"/>
                            <rect class="cls-20" x="458.11" y="386.74" width="3.75" height="8.64" transform="translate(-291.12 -281.67) rotate(0.14)"/>
                            <rect class="cls-21" x="458.72" y="388.29" width="2.82" height="6.74" transform="translate(-291.11 -281.67) rotate(0.14)"/>
                            <rect class="cls-15" x="471.62" y="380.39" width="5.48" height="28.32" transform="translate(-291.11 -281.7) rotate(0.14)"/>
                            <rect class="cls-19" x="472.98" y="383.15" width="3.81" height="24.63" transform="matrix(1, 0, 0, 1, -291.11, -281.7)"/>
                            <rect class="cls-20" x="472.56" y="391.74" width="3.75" height="8.64" transform="translate(-291.1 -281.7) rotate(0.14)"/>
                            <rect class="cls-21" x="473.18" y="393.29" width="2.82" height="6.74" transform="translate(-291.1 -281.7) rotate(0.14)"/>
                            <rect class="cls-15" x="485.6" y="380.39" width="5.48" height="28.32" transform="translate(-291.11 -281.74) rotate(0.14)"/>
                            <rect class="cls-19" x="486.96" y="383.15" width="3.81" height="24.63" transform="matrix(1, 0, 0, 1, -291.11, -281.74)"/>
                            <rect class="cls-20" x="486.54" y="391.74" width="3.75" height="8.64" transform="translate(-291.1 -281.74) rotate(0.14)"/>
                            <rect class="cls-21" x="487.16" y="393.29" width="2.82" height="6.74" transform="translate(-291.1 -281.74) rotate(0.14)"/>
                            <ellipse class="cls-15" cx="543.25" cy="364.27" rx="7.58" ry="5.48" transform="translate(-254.74 498.3) rotate(-73.18)"/>
                            <circle class="cls-16" cx="251.97" cy="78.55" r="7.22"/>
                            <circle class="cls-17" cx="252.04" cy="78.55" r="5.38"/>
                            <path class="cls-18" d="M544.55,359l3.62-3.37a5.29,5.29,0,0,0-6.85-1.12l2.77,4.59L540,362.54a5.29,5.29,0,0,0,7.48.65Z" transform="translate(-292.07 -280.54)"/>
                            <ellipse class="cls-15" cx="521.99" cy="364.27" rx="7.58" ry="5.48" transform="translate(-269.84 477.95) rotate(-73.18)"/>
                            <circle class="cls-16" cx="230.71" cy="78.55" r="7.22"/>
                            <circle class="cls-17" cx="230.78" cy="78.55" r="5.38"/>
                            <path class="cls-18" d="M523.29,359l3.62-3.37a5.28,5.28,0,0,0-6.84-1.12l2.76,4.59-4.07,3.49a5.29,5.29,0,0,0,7.48.65Z" transform="translate(-292.07 -280.54)"/>
                            <rect class="cls-14" x="528.66" y="391.51" width="9.36" height="13.86" transform="matrix(1, 0, 0, 1, -291, -281.98)"/>
                            <rect class="cls-22" x="528.67" y="390.16" width="9.36" height="13.86" transform="matrix(1, 0, 0, 1, -291, -281.98)"/>
                            <rect class="cls-23" x="529" y="390.89" width="8.5" height="12.73" transform="translate(-291 -281.98) rotate(0.15)"/>
                            <rect class="cls-14" x="545.56" y="391.51" width="9.36" height="13.86" transform="matrix(1, 0, 0, 1, -290.99, -282.03)"/>
                            <rect class="cls-24" x="545.56" y="390.16" width="9.36" height="13.86" transform="matrix(1, 0, 0, 1, -291, -282.03)"/>
                            <rect class="cls-25" x="545.9" y="390.89" width="8.5" height="12.73" transform="translate(-291 -282.03) rotate(0.15)"/>
                            <rect class="cls-14" x="353.09" y="394.6" width="9.36" height="13.86" transform="matrix(1, 0, 0, 1, -290.99, -281.51)"/>
                            <rect class="cls-26" x="353.09" y="393.25" width="9.36" height="13.86" transform="matrix(1, 0, 0, 1, -290.99, -281.51)"/>
                            <rect class="cls-27" x="353.43" y="393.97" width="8.5" height="12.73" transform="translate(-290.99 -281.51) rotate(0.15)"/>
                        </g>
                    </g>
                </svg>
                <a href="#wave" slot="footer" rel="next">Wave</a>
            </element-article>
        `;
    }
}

window.customElements.define('page-home', PageHome);
export default PageHome;