/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    // Find the rule that handles CSS files
    const cssRule = config.module.rules.find(
      rule => rule.test && rule.test.toString().includes('css')
    );
    
    if (cssRule) {
      // Replace it with our custom rule
      cssRule.use = [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                'tailwindcss',
                'postcss-nested',
                'autoprefixer',
              ],
            },
          },
        },
      ];
    } else {
      // If we can't find the CSS rule, add our own
      config.module.rules.push({
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'tailwindcss',
                  'postcss-nested',
                  'autoprefixer',
                ],
              },
            },
          },
        ],
      });
    }
    
    return config;
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.API_URL || "http://localhost:8000"
        }/api/:path*`,
      },
      {
        source: "/docs",
        destination: `${process.env.API_URL || "http://localhost:8000"}/docs`,
      },
      {
        source: "/openapi.json",
        destination: `${
          process.env.API_URL || "http://localhost:8000"
        }/openapi.json`,
      },
    ];
  },
};

module.exports = nextConfig;
