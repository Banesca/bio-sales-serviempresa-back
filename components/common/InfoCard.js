import { RightOutlined } from '@ant-design/icons';
import React from 'react';
import { FaUsers } from 'react-icons/fa';

const InfoCard = ({ title, icon }) => {
	const Icon = icon;

	console.log(title);
	return (
		<div style={{width: '33vw', height: 'fit-content', backgroundColor: '#fff', marginTop: '25px', marginBottom: '25px', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '.5px .5px 5px 1px #e6e6e6'}}>
			<header style={{display: 'flex', justifyContent: 'space-between', margin: '25px'}}>
				<section>
					<span style={{color: '#012258', fontSize: '2rem', fontWeight: 'bolder'}}>10</span>
					<h1 style={{marginTop: '0px', fontSize: '1rem'}}>{title} por realizar</h1>
				</section>
				<section style={{display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#012258', fontSize: '2rem', border: '2px solid', padding: '15px', borderRadius: '50%', width: 'fit-contents', height: 'fit-content'}}>
					<Icon style={{width: '40px', height: '40px', display: 'flex', justifyContent: 'center'}}/>
				</section>
			</header>
			<footer style={{background: '#f2f7fccc', color: '#012258', width: '100%', marginBottom: '0px', padding: '6px', borderRadius: '8px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
				<h1 style={{margin: '0px auto 0px 20px', width: 'fit-content', position: 'relative'}}>
								Ver {title} pendientes 
				</h1>
				<a className='footer-icon'>
					<RightOutlined/>
				</a>
			</footer>
		</div>
	);
};

export default InfoCard;
