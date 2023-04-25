import { Empty, Image } from 'antd';
import EmptySvg from '../../../public/assets/empty.svg';

export const CustomizeRenderEmpty = () => (
	<Empty
		image={<Image src={EmptySvg} alt="" />}
		style={{
			textAlign: 'center',
			marginBottom: '30px',
		}}
		description={<span>Sin datos</span>}
	/>
);
