import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // reactCompiler требует установки babel-plugin-react-compiler
  // reactCompiler: true,

  // Игнорируем bundling для server-side модулей
  serverExternalPackages: ['pdfkit', 'nodemailer', 'openai'],

  webpack: (config, { isServer }) => {
    // Добавляем алиас @ для корня проекта
    config.resolve.alias['@'] = path.resolve(__dirname);

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
