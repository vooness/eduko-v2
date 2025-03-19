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
    // Projdeme všechna pravidla, která pracují s .ts soubory,
    // a přidáme do jejich "exclude" naši cestu – abychom je nekompilovali.
    config.module.rules.forEach((rule) => {
      if (
        rule.test &&
        rule.test.toString().includes('ts') &&
        // Ujistíme se, že se jedná o pravidla, která mají možnost "exclude"
        Array.isArray(rule.exclude) || !rule.exclude
      ) {
        rule.exclude = rule.exclude ? [].concat(rule.exclude) : [];
        rule.exclude.push(/public\/ekonomika1\/story_content/);
      }
    });

    // A zároveň přidáme pravidlo, které říká, že .ts soubory v dané složce mají být
    // zpracovány jako asset/resource (tj. jen zkopírovány a jejich URL vrácena)
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
