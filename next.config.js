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
		domains: ['api.menusoftware.info']
	},
	/* images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'api.menusoftware.info',
				port: '7002',
				pathname: '/product/**'
			}
		]
	}, */
};

module.exports = nextConfig;
