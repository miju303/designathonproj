import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // Allow cookies for session-based auth
});

// Note: Axios withCredentials is set to true for session-based auth
export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    me: () => api.get('/user/me'),      // Full user profile (faculty-aware)
    authMe: () => api.get('/auth/me'),  // Lightweight session check
    logout: () => api.post('/auth/logout'),
};

export const facultyApi = {
    getProfile: (id) => api.get(`/faculty/${id}`),
    updateProfile: (id, data) => api.put(`/faculty/update/${id}`, data),
    updateProfileV2: (data) => api.post('/profile/update', data),
    uploadFile: (id, type, file, name) => {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('type', type);
        formData.append('file', file);
        if (name) formData.append('name', name);
        return api.post('/faculty/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export const hodApi = {
    getDashboard: (dept) => api.get(`/hod/dashboard/${dept}`),
    getFaculties: (dept) => api.get(`/hod/faculties/${dept}`),
    sendReminder: (id, message) => api.post(`/hod/send-reminder`, null, { params: { id, message } }),
};

export const adminApi = {
    getAnalytics: () => api.get('/admin/analytics'),
    getFaculties: () => api.get('/admin/faculty'),
    addFaculty: (data) => api.post('/admin/add-faculty', data),
    updateFaculty: (id, data) => api.put(`/admin/edit-faculty/${id}`, data),
    deleteFaculty: (id) => api.delete(`/admin/delete-faculty/${id}`),
    resetPassword: (id, password) => api.post(`/admin/reset-password/${id}`, { password }),
    assignDepartment: (id, department) => api.post(`/admin/assign-department/${id}`, { department }),
    getNaacReport: () => api.get('/admin/naac-report'),
    getLogs: () => api.get('/admin/logs'),
    clearLogs: () => api.post('/admin/clear-logs'),
};

export const reportApi = {
    downloadNaacPdf: () => api.get('/reports/naac-pdf', { responseType: 'blob' }),
};

export const notificationApi = {
    getNotifications: (facultyId) => api.get(`/notifications/${facultyId}`),
    getUnreadCount: (facultyId) => api.get(`/notifications/${facultyId}/unread-count`),
    markRead: (id) => api.post(`/notifications/${id}/read`),
    markAllRead: (facultyId) => api.post(`/notifications/${facultyId}/read-all`),
};

export const calendarApi = {
    getEvents: () => api.get('/calendar'),
    createEvent: (data) => api.post('/calendar', data),
};

export const assignmentApi = {
    getFacultyAssignments: (id) => api.get(`/assignments/faculty/${id}`),
    assignTask: (data) => api.post('/assignments/assign', data),
    updateStatus: (id, status) => api.put(`/assignments/update-status/${id}`, null, { params: { status } }),
};

export const activityApi = {
    getFacultyActivities: (id) => api.get(`/activities/faculty/${id}`),
    updateActivity: (data) => api.post('/activities/update', data),
    getAllActivities: () => api.get('/activities/all'),
};

export const achievementApi = {
    getFacultyAchievements: (id) => api.get(`/achievements/faculty/${id}`),
    uploadAchievement: (data) => api.post('/achievements/upload', data),
};

export const attendanceApi = {
    getAttendance: (id, start, end) => api.get(`/attendance/faculty/${id}`, { params: { startDate: start, endDate: end } }),
    markAttendance: (data) => api.post('/attendance/mark', data),
};

export const fileApi = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    getFileUrl: (id) => `http://localhost:8080/api/files/${id}`,
};

export default api;
