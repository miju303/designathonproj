import React, { useState, useEffect } from 'react';
import { calendarApi, assignmentApi } from '../services/api';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        eventName: '',
        eventDate: '',
        eventType: 'Event',
        description: '',
        reminderDaysBefore: 1
    });

    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [eRes, aRes] = await Promise.all([
                calendarApi.getEvents(),
                userRole === 'faculty' ? assignmentApi.getFacultyAssignments(userId) : Promise.resolve({ data: [] })
            ]);
            setEvents(eRes.data);
            setAssignments(aRes.data);
        } catch (error) {
            console.error("Error fetching calendar data:", error);
        }
    };

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderHeader = () => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CalendarIcon /> {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} style={btnStyle}><ChevronLeft size={20}/></button>
                    <button onClick={() => setCurrentDate(new Date())} style={btnStyle}>Today</button>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} style={btnStyle}><ChevronRight size={20}/></button>
                    {(userRole === 'admin' || userRole === 'hod') && (
                        <button onClick={() => setShowAddModal(true)} style={{ ...btnStyle, background: '#3b82f6', color: 'white' }}>
                            <Plus size={20}/> Add Event
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const numDays = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} style={cellStyle}></div>);
        }

        for (let d = 1; d <= numDays; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.eventDate === dateStr);
            const dayAssignments = assignments.filter(a => a.submissionDate === dateStr);

            days.push(
                <div key={d} style={{ ...cellStyle, border: '1px solid #e2e8f0' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{d}</span>
                    <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {dayEvents.map(e => (
                            <div key={e.id} style={{ 
                                fontSize: '10px', 
                                padding: '2px 4px', 
                                borderRadius: '3px',
                                background: getEventColor(e.eventType),
                                color: 'white',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }} title={e.eventName}>
                                {e.eventName}
                            </div>
                        ))}
                        {dayAssignments.map(a => (
                            <div key={a.id} style={{ 
                                fontSize: '10px', 
                                padding: '2px 4px', 
                                borderRadius: '3px',
                                background: '#facc15', // Yellow for assignments
                                color: '#854d0e',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }} title={a.title}>
                                {a.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>{days}</div>;
    };

    const getEventColor = (type) => {
        switch(type?.toLowerCase()) {
            case 'exam': return '#ef4444'; // Red
            case 'meeting': return '#3b82f6'; // Blue
            case 'event': return '#22c55e'; // Green
            case 'assignment': return '#facc15'; // Yellow
            default: return '#64748b';
        }
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            await calendarApi.createEvent(newEvent);
            setShowAddModal(false);
            fetchData();
            setNewEvent({ eventName: '', eventDate: '', eventType: 'Event', description: '', reminderDaysBefore: 1 });
        } catch (error) {
            alert("Failed to add event");
        }
    };

    return (
        <div className="dashboard-card" style={{ background: 'white', padding: '30px' }}>
            {renderHeader()}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', marginBottom: '10px' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontWeight: 'bold', color: '#64748b', fontSize: '14px' }}>{d}</div>
                ))}
            </div>
            {renderDays()}

            {showAddModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalStyle}>
                        <h3 style={{ marginBottom: '20px' }}>Add Academic Event</h3>
                        <form onSubmit={handleAddEvent}>
                            <div style={inputGroupStyle}>
                                <label>Event Name</label>
                                <input type="text" required value={newEvent.eventName} onChange={e => setNewEvent({...newEvent, eventName: e.target.value})} style={inputStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label>Date</label>
                                <input type="date" required value={newEvent.eventDate} onChange={e => setNewEvent({...newEvent, eventDate: e.target.value})} style={inputStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label>Type</label>
                                <select value={newEvent.eventType} onChange={e => setNewEvent({...newEvent, eventType: e.target.value})} style={inputStyle}>
                                    <option value="Event">Event (Green)</option>
                                    <option value="Exam">Exam (Red)</option>
                                    <option value="Meeting">Meeting (Blue)</option>
                                </select>
                            </div>
                            <div style={inputGroupStyle}>
                                <label>Reminder (Days Before)</label>
                                <input type="number" value={newEvent.reminderDaysBefore} onChange={e => setNewEvent({...newEvent, reminderDaysBefore: parseInt(e.target.value)})} style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" style={{ ...btnStyle, background: '#3b82f6', color: 'white', flex: 1 }}>Add</button>
                                <button type="button" onClick={() => setShowAddModal(false)} style={{ ...btnStyle, flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const btnStyle = { padding: '8px 15px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' };
const cellStyle = { height: '100px', padding: '5px', background: '#f8fafc', borderRadius: '8px', overflowY: 'auto' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { background: 'white', padding: '30px', borderRadius: '15px', width: '400px' };
const inputGroupStyle = { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' };
const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' };

export default Calendar;
