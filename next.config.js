/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
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
		domains: ['api.menusoftware.info'],
	},
};

module.exports = nextConfig;
