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
    // Projdeme všechna pravidla pro .ts soubory a přidáme naši cestu do "exclude",
    // aby tyto soubory nebyly zpracovávány standardním TS loaderem.
    config.module.rules.forEach((rule) => {
      if (
        rule.test &&
        rule.test.toString().includes("ts")
      ) {
        rule.exclude = rule.exclude ? [].concat(rule.exclude) : [];
        rule.exclude.push(/public\/ekonomika1\/story_content/);
      }
    });

    // Přidáme nové pravidlo pro .ts soubory v public/ekonomika1/story_content,
    // aby byly zpracovány jako statické assety bez parsování
    config.module.rules.push({
      test: /\.ts$/,
      include: /public\/ekonomika1\/story_content/,
      type: "javascript/auto",
      use: [
        {
          loader: "file-loader",
          options: {
            name: "static/media/[name].[ext]",
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
