/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	redirects: async () => {
		return [
			{
				source: '/',
				destination: '/login',
				permanent: true,
			},
		];
	},
	images: {
		domains: ['tumenudelivery.com']
	},
};

module.exports = nextConfig;
