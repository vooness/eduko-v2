/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Tohle pravidlo zachytí všechny .ts soubory v adresáři public/ekonomika1/story_content
    config.module.rules.push({
      test: /\.ts$/,
      include: /public\/ekonomika1\/story_content/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name][ext]",
      },
    });
    return config;
  },
};

module.exports = nextConfig;
