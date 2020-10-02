export const formatCssProperties = (styles, duration) => {
    let formatted = Object.keys(styles)
        .map(style => {
            const formattedName = style
                .split('')
                .map((letter, index) => {
                    // Vendor prefixes
                    const webkit = style.split('webkit')[0] === '';
                    const moz = style.split('moz')[0] === '';
                    const ms = style.split('ms')[0] === '';

                    if (letter === '-') return letter;
                    if ((webkit || moz || ms) && index === 0) return `-${letter.toLowerCase()}`;
                    if (letter === letter.toUpperCase()) return `-${letter.toLowerCase()}`;
                    else return letter;
                })
                .join('');
            return `${formattedName}: ${styles[style]};`;
        })
        .join('');

    // Calculate -0.15s from the end of duration for animating out
    let animation = `animation: dk__toast-in 0.15s, dk__toast-in 0.15s ${duration / 1000 -
        0.15}s reverse forwards;`;

    return (formatted += animation);
};

export const appendStylesheet = options => {
    let properties;

    // Format style properties/values
    if (options.styles) properties = formatCssProperties(options.styles, options.duration);

    // Stylesheet content
    let styles = `
            .dk__toast-container {
                display: flex;
                flex-direction: column;
                position: fixed;
                ${options.positionY}: 40px;
                ${options.positionX}: 60px;
                z-index: 100;
            }
            .dk__toast {
                margin: 5px 0;
                padding: 5px 20px;
                min-width: 125px;
                font: clamp(0.9rem, 1.5vw, 1.2rem) Avenir, sans-serif;
                text-align: center;
                border-radius: 5px;
                background: #fff;
                box-shadow: 0 1px 3px #000;
                ${properties || ''}
            }
            @keyframes dk__toast-in {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @media only screen and (max-width: 450px) {
                .dk__toast-container {
                    right: 0;
                    left: 0;
                    bottom: 10px;
                    margin: 0 auto;
                    width: 90%;
                }
            }
        `;

    // Create stylesheet
    const stylesheet = document.createElement('style');

    // Set stylesheet content
    stylesheet.innerHTML = styles;

    // Append
    document.head.appendChild(stylesheet);
};