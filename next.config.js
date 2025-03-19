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
    // Upravíme existující pravidla pro .ts soubory, aby nepracovala s cestou public/ekonomika1/story_content
    config.module.rules.forEach((rule) => {
      if (
        rule.test &&
        rule.test.toString().includes('ts') &&
        (!rule.exclude || Array.isArray(rule.exclude))
      ) {
        rule.exclude = rule.exclude ? [].concat(rule.exclude) : [];
        rule.exclude.push(/public\/ekonomika1\/story_content/);
      }
    });
    // Přidáme nové pravidlo pro soubory .ts v public/ekonomika1/story_content, aby byly zpracovány jako asset/resource
    config.module.rules.push({
      test: /\.ts$/,
      include: /public\/ekonomika1\/story_content/,
      type: "asset/resource",
      parser: {
        dataUrlCondition: {
          maxSize: 0, // Vynutí, aby se soubor vždy emitoval jako samostatný asset
        },
      },
      generator: {
        filename: "static/media/[name][ext]",
      },
    });
    return config;
  },
};

module.exports = nextConfig;
