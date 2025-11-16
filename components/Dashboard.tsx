
import React from 'react';
import { User, Role } from '../types';
import { MOCK_COURSES, MOCK_ASSIGNMENTS } from '../constants';

interface DashboardProps {
  user: User;
}

const WelcomeBanner: React.FC<{ name: string, role: Role }> = ({ name, role }) => (
  <div className="bg-primary-light p-6 rounded-xl shadow-sm mb-8">
    <h1 className="text-2xl md:text-3xl font-bold text-primary-dark">Welcome back, {name}!</h1>
    <p className="text-gray-600 mt-1">Here's your overview as a {role}.</p>
  </div>
);

const InfoCard: React.FC<{ title: string; value: string; icon: string }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
        <div className="text-3xl mr-4">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    const upcomingAssignments = MOCK_ASSIGNMENTS.filter(a => !a.submitted).length;

    const renderStudentDashboard = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard title="Enrolled Courses" value={String(MOCK_COURSES.length)} icon="📚" />
            <InfoCard title="Upcoming Assignments" value={String(upcomingAssignments)} icon="📝" />
            <InfoCard title="Recent Grade" value="A-" icon="🏅" />
        </div>
    );

    const renderParentDashboard = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard title="Child's Attendance" value="95%" icon="📅" />
            <InfoCard title="Unpaid Fees" value="$500" icon="💵" />
            <InfoCard title="Recent Announcements" value="2" icon="📢" />
        </div>
    );

    const renderTeacherDashboard = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard title="Your Classes" value="4" icon="🏫" />
            <InfoCard title="Submissions to Grade" value="12" icon="✍️" />
            <InfoCard title="Upcoming Lessons" value="3" icon="🗓️" />
        </div>
    );

    const renderAdminDashboard = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard title="Total Students" value="450" icon="🎓" />
            <InfoCard title="Total Teachers" value="25" icon="🧑‍🏫" />
            <InfoCard title="Total Courses" value="30" icon="📚" />
            <InfoCard title="Overall Attendance" value="97%" icon="📈" />
        </div>
    );

  return (
    <div>
      <WelcomeBanner name={user.name} role={user.role} />
      <div>
        {user.role === Role.Student && renderStudentDashboard()}
        {user.role === Role.Parent && renderParentDashboard()}
        {user.role === Role.Teacher && renderTeacherDashboard()}
        {user.role === Role.Admin && renderAdminDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
