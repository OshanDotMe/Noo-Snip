/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@xenova/transformers', 'onnxruntime-node'],
};

module.exports = nextConfig;