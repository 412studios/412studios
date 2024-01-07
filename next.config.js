/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

// In next.config.js (if necessary)
module.exports = {
    webpack(config, options) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack']
        });

        return config;
    },
};
