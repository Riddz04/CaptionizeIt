/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(ttf|otf|woff|woff2|eot|svg)$/i, // Match font file types
        type: 'asset/resource', // Use asset/resource to handle fonts
        generator: {
          filename: 'static/fonts/[name][ext]', // Output path for fonts
        },
      });
      return config;
    },
  };
  
  export default nextConfig;
  