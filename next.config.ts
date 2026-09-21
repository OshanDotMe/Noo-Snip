/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@xenova/transformers', 'onnxruntime-node'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/onnxruntime-node/bin/napi-v6/linux/**'],
  },
};

module.exports = nextConfig;