/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	output: 'export',
	/*distDir: 'dist', */
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
		unoptimized:true
	},
};

module.exports = nextConfig;
