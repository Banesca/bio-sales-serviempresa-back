import { Empty, Image } from 'antd';

export const CustomizeRenderEmpty = () => (
	<Empty
		image={<Image src={'/assets/empty.svg'} alt="" />}
		style={{
			textAlign: 'center',
			marginBottom: '30px',
		}}
		description={<span>Sin datos</span>}
	/>
);
