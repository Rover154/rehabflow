import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactCompiler требует установки babel-plugin-react-compiler
  // reactCompiler: true,
  
  // Игнорируем bundling для server-side модулей
  serverExternalPackages: ['pdfkit', 'nodemailer', 'openai'],
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Разрешаем динамические require для server-side модулей
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'pdfkit',
        'nodemailer',
      ];
    }
    return config;
  },
};

export default nextConfig;
