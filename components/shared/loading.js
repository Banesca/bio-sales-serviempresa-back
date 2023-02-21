import { LoadingOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const Loading = ({ isLoading }) => {
	if (!isLoading) {
		return;
	}
	return (
		<div
			style={{
				zIndex: 1000,
				backgroundColor: '#fff',
				opacity: 0.6,
				position: 'absolute',
				display: 'flex',
				width: '100%',
				height: '100vh',
				top: 0,
				left: 0,
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'scroll'
			}}
		>
			<LoadingOutlined style={{ fontSize: '4rem', color: '#0984e3' }} />
		</div>
	);
};

Loading.propTypes = {
	isLoading: PropTypes.bool.isRequired,
};

export default Loading;
