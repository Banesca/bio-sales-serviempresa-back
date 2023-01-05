import { useEffect, useState } from 'react';
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
				backgroundColor: '#000',
				opacity: 0.4,
				position: 'absolute',
				display: 'flex',
				width: '100%',
				height: '100%',
				top: 0,
				left: 0,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<LoadingOutlined style={{ fontSize: '4rem', color: 'white' }} />
		</div>
	);
};

Loading.propTypes = {
	isLoading: PropTypes.bool.isRequired,
};

export default Loading;
