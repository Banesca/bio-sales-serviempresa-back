import { LoadingOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const Loading = ({ isLoading }) => {
	if (!isLoading) {
		return;
	}
	return (
		<div
			style={{
				zIndex: 100,
				backgroundColor: 'white',
				opacity: 0.5,
				position: 'fixed',
				display: 'flex',
				width: '100%',
				height: '100%',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'scroll',
			}}
		>
			<LoadingOutlined style={{ fontSize: '6rem', color: '#0984e3' }} />
		</div>
	);
};

Loading.propTypes = {
	isLoading: PropTypes.bool.isRequired,
};

export default Loading;
