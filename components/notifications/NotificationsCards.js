import { WarningTwoTone } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react';

const NotificationsCards = ({ notification }) => {
	return (
		<div className="flex gap-4 flex-col">
			{notification?.length > 0 &&
				notification?.map((not, index) => {
					return (
						<Card className="w-full shadow-md" key={index}>
							<div className="flex flex-row gap-5">
								<div className="flex justify-center items-center">
									<WarningTwoTone className="text-4xl" />
								</div>
								<div>
									<h1 className="text-xl font-medium">{not.title}</h1>
									<p>{not.descripcion}</p>
								</div>
							</div>
						</Card>
					);
				})}
		</div>
	);
};

export default NotificationsCards;
