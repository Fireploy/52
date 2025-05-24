/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['storage.googleapis.com']
	},
	basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
};

export default nextConfig;


