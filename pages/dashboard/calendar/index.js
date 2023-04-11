import { useContext, useEffect, useState } from 'react';
import { Button, List } from 'antd';
import DashboardLayout from '../../../components/shared/layout';
import Loading from '../../../components/shared/loading';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const UserDetail = () => {

	const { loading, setLoading } = useLoadingContext();


	const [events, setEvents] = useState([
		{
		  title: 'Mi evento 1',
		  start: '2023-04-15T10:00:00',
		  end: '2023-04-15T12:00:00',
		},
		{
		  title: 'Mi evento 2',
		  start: '2023-04-16T14:00:00',
		  end: '2023-04-16T16:00:00',
		},
	  ]);


	return (
		<>
			<DashboardLayout>
				<div
					style={{
						margin: '1rem',
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					<List
						style={{
							width: '96%',
							borderRadius: '15px',
							marginTop: '2rem',
							marginBottom: '1rem',
							backgroundColor: 'white',
							boxShadow: '4px 3px 8px 2px #9c9c9c5d'

						}}
					>
						<List.Item style={{display: 'flex', justifyContent: 'center'}} >
							<h1
								style={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									textAlign: 'center',
									fontSize: '3rem',
									gap: '20px',
									margin: '20px',
								}}
							>
									CALENDARIO
							</h1>
						</List.Item>

						<List.Item style={{display: 'flex', flexDirection: 'column', padding: '15px 40px', fontSize: '18px', justifyContent: 'center', alignItems: 'flex-start'}}>

							{/* Calendar */}
						
							<div style={{height: '100%'}}>
								<FullCalendar
									plugins={[dayGridPlugin, timeGridPlugin]}
									initialView="timeGridWeek"
									events={events}
									editable={true}
									selectable={true}
									selectMirror={true}
									dayMaxEvents={true}
									headerToolbar={{
										left: 'prev,next today',
										center: 'title',
										right: 'dayGridMonth,timeGridWeek,timeGridDay',
									}}
									select={(info) => {
										const title = prompt('Ingrese el título del evento:');
										if (title) {
											setEvents([
												...events,
												{ title, start: info.startStr, end: info.endStr },
											]);
										}
									}}
									eventContent={(eventInfo) => {
										return (
											<>
												<b>{eventInfo.timeText}</b>
												<p>{eventInfo.event.title}</p>
											</>
										);
									}}
								/>
							</div>

							<Button type='success' style={{margin: '20px'}}>
								Agregar Evento
							</Button>
							
						</List.Item>
					</List>
					<div style={{width: '89%'}}>
						
					</div>
				</div>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
};

export default UserDetail;