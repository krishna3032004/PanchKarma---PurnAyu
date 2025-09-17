// app/dashboard/page.js
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, BarChart3, User, Settings, Bell, CheckCircle, Clock, PlusCircle, ArrowRight, Download, Phone, X, Menu, HomeIcon } from 'lucide-react';

// --- FAKE DATA ---
const patientData = {
  name: 'Johanna W.',
  email: 'johanna.w@example.com',
  memberSince: '12.11.2014',
  assignedDoctor: {
    name: 'Dr. Anjali Verma',
    specialty: 'Panchkarma Specialist',
    phone: '+91 12345 67890',
    email: 'anjali.verma@purnayu.com'
  }
};

const appointmentsData = {
  upcoming: [
    { id: 1, name: 'Nasya Therapy', date: 'Today, 3:00 PM', doctor: 'Dr. Anjali Verma' },
    { id: 2, name: 'Raktamokshana Therapy', date: 'Sep 19, 2025, 11:00 AM', doctor: 'Dr. Anjali Verma' },
    { id: 3, name: 'Diet Plan Review', date: 'Sep 22, 2025, 4:00 PM', doctor: 'Dr. Rohan Sharma' },
  ],
  past: [
    { id: 4, name: 'Basti', date: 'Sep 10, 2025', status: 'Completed' },
    { id: 5, name: 'Virechana', date: 'Sep 08, 2025', status: 'Completed' },
    { id: 6, name: 'Vamana', date: 'Sep 05, 2025', status: 'Completed' },
  ]
};

const progressData = {
  overallCompletion: 60,
  metrics: [
    { name: 'Stress Level', value: 'Low', change: -25, tip: 'Practice daily meditation and try Ashwagandha tea before bed.' },
    { name: 'Sleep Quality', value: 'Good', change: +40, tip: 'Avoid screens 1 hour before sleep and maintain a consistent sleep schedule.' },
    { name: 'Energy Level', value: 'High', change: +35, tip: 'A light, balanced diet and regular morning walks are boosting your vitality.' },
  ]
};

const reportsData = [
  { id: 1, name: 'Initial Consultation Report', date: 'Aug 28, 2025' },
  { id: 2, name: 'Blood Test Results', date: 'Sep 01, 2025' },
  { id: 3, name: 'Vamana Post-Therapy Analysis', date: 'Sep 11, 2025' },
];


// --- MAIN COMPONENT ---
export default function PatientDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeView, setActiveView] = useState('overview');
  const [showContactModal, setShowContactModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasAppointments, setHasAppointments] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status === 'loading') return <LoadingScreen />;

  if (status === 'authenticated') {
    return (
      <div className="flex min-h-screen bg-[#F8FAF9] text-[#1C1917]">
        <Sidebar activeView={activeView} setActiveView={setActiveView} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <Header session={session} setIsSidebarOpen={setIsSidebarOpen} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={activeView} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                {activeView === 'overview' && (hasAppointments ? <OverviewDashboard setActiveView={setActiveView} setShowContactModal={setShowContactModal} /> : <EmptyDashboard />)}
                {activeView === 'appointments' && <AppointmentsView />}
                {activeView === 'progress' && <ProgressView />}
                {activeView === 'profile' && <ProfileView />}
                {activeView === 'reports' && <ReportsView />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <AnimatePresence>
          {showContactModal && <ContactDoctorModal setShowContactModal={setShowContactModal} />}
        </AnimatePresence>
      </div>
    );
  }

  return null;
}


// --- UI COMPONENTS ---

function LoadingScreen() {
  return <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-12 w-12 border-4 border-t-[#16A34A] border-gray-200 rounded-full" /></div>;
}

function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-200px)]">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Calendar className="h-16 w-16 md:h-20 md:w-20 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl md:text-2xl font-bold">No Appointments Yet</h2>
        <p className="text-[#6B7280] mt-2 max-w-sm text-sm md:text-base">It looks like you haven&apos;t scheduled any therapies. Start your wellness journey today!</p>
        <Link href="/book"><motion.button whileHover={{ scale: 1.05 }} className="mt-6 bg-[#16A34A] text-white font-semibold py-2 px-5 md:py-3 md:px-6 rounded-full flex items-center mx-auto shadow-lg hover:bg-[#15803D]"><PlusCircle className="h-5 w-5 mr-2" /> Book Your First Session</motion.button></Link>
      </motion.div>
    </div>
  );
}

function Sidebar({ activeView, setActiveView, isSidebarOpen, setIsSidebarOpen }) {
  const navItems = [
    // { name: 'Home', icon: Home, view: 'overview' },
    { name: 'Overview', icon: LayoutDashboard, view: 'overview' },
    { name: 'Appointments', icon: Calendar, view: 'appointments' },
    { name: 'Progress', icon: BarChart3, view: 'progress' },
    { name: 'Profile', icon: User, view: 'profile' },
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between h-20 border-b px-6">
        <Link href={"/"}><h1 className="md:text-2xl text-xl font-bold font-serif text-[#15803D]">PurnAyu</h1></Link>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden cursor-pointer text-[#6B7280]"><X /></button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link href={"/"}><button  
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer            text-[#6B7280] hover:bg-gray-100`}>
          <HomeIcon className="h-5 w-5 mr-3" /> Home
        </button></Link>
        {navItems.map(item => (
          <button key={item.name} onClick={() => { setActiveView(item.view); setIsSidebarOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeView === item.view ? 'bg-[#D1FAE5] text-[#15803D] font-semibold' : 'text-[#6B7280] hover:bg-gray-100'}`}>
            <item.icon className="h-5 w-5 mr-3" /> {item.name}
          </button>
        ))}
      </nav>
      <div className="px-4 py-6 border-t"><button className="w-full flex items-center px-4 py-3 text-[#6B7280] hover:bg-gray-100 rounded-lg"><Settings className="h-5 w-5 mr-3" /> Settings</button></div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex-col hidden lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50  z-30 lg:hidden" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed  top-0 left-0 h-full w-64 bg-white shadow-lg flex flex-col z-40 lg:hidden">
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Header({ session, setIsSidebarOpen }) {
  return (
    <header className="flex justify-between items-center p-4 md:p-4 border-b bg-white">
      <button onClick={() => setIsSidebarOpen(true)} className="cursor-pointer lg:hidden text-[#1C1917]"><Menu /></button>
      <h2 className="text-lg md:text-2xl font-bold text-[#1C1917]">Dashboard</h2>
      <div className="flex items-center space-x-4 md:space-x-6">
        <Bell className="text-[#6B7280]  hover:text-[#16A34A] cursor-pointer" />
        <img src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`} alt="Patient" className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover" />
      </div>
    </header>
  );
}

// --- DASHBOARD VIEWS ---

function OverviewDashboard({ setActiveView, setShowContactModal }) {
  return (
    <motion.div className="grid grid-cols-12 gap-6" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="col-span-12"><WelcomeCard name={patientData.name} /></motion.div>
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="col-span-12 md:col-span-6 lg:col-span-4"><NextAppointmentCard /></motion.div>
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="col-span-12 md:col-span-6 lg:col-span-4"><ProgressCard /></motion.div>
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="col-span-12 lg:col-span-4"><QuickActionsCard setActiveView={setActiveView} setShowContactModal={setShowContactModal} /></motion.div>
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="col-span-12"><RecentActivityCard /></motion.div>
    </motion.div>
  );
}

function AppointmentsView() {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-6">All Appointments</h2>
      <h3 className="text-lg font-semibold text-[#15803D] mb-4">Upcoming</h3>
      <div className="space-y-4 mb-8">
        {appointmentsData.upcoming.map(app => <div key={app.id} className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center"><span className="font-semibold">{app.name}</span><span className="text-sm text-gray-600 sm:font-semibold">{app.date}</span></div>)}
      </div>
      <h3 className="text-lg font-semibold text-[#15803D] mb-4">Past</h3>
      <div className="space-y-4">
        {appointmentsData.past.map(app => <div key={app.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">{app.name}<span className="text-gray-500">{app.date}</span></div>)}
      </div>
    </div>
  );
}

function ProgressView() {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Your Wellness Journey</h2>
      <div className="grid md:grid-cols-3 gap-6 text-center">
        {progressData.metrics.map(metric => (
          <div key={metric.name} className="bg-gray-50 p-6 rounded-lg">
            <p className="text-sm text-[#6B7280]">{metric.name}</p>
            <p className="text-2xl md:text-3xl font-bold my-2">{metric.value}</p>
            <p className={`font-semibold text-sm ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>{metric.change > 0 ? '+' : ''}{metric.change}% Change</p>
            <p className="text-xs text-gray-400 mt-4 text-left border-t pt-2">{metric.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileView() {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Your Profile</h2>
      <div className="space-y-4 text-sm md:text-base">
        <div className="flex justify-between py-2 border-b"><span className="font-semibold text-[#6B7280]">Full Name:</span><span>{patientData.name}</span></div>
        <div className="flex justify-between py-2 border-b"><span className="font-semibold text-[#6B7280]">Email:</span><span>{patientData.email}</span></div>
        <div className="flex justify-between py-2 border-b"><span className="font-semibold text-[#6B7280]">Member Since:</span><span>{patientData.memberSince}</span></div>
        <div className="flex justify-between py-2"><span className="font-semibold text-[#6B7280]">Assigned Doctor:</span><span>{patientData.assignedDoctor.name}</span></div>
      </div>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Your Past Reports</h2>
      <ul className="space-y-3">
        {reportsData.map(report => (
          <li key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-sm md:text-base">{report.name}</p>
              <p className="text-xs md:text-sm text-[#6B7280]">{report.date}</p>
            </div>
            <button className="flex items-center text-sm font-semibold text-[#16A34A]"><Download className="h-4 w-4 mr-2" /> Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactDoctorModal({ setShowContactModal }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowContactModal(false)}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <button onClick={() => setShowContactModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
        <h2 className="text-xl md:text-2xl font-bold mb-4">Contact Your Doctor</h2>
        <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80" alt="Doctor" className="h-24 w-24 rounded-full object-cover mx-auto my-4" />
        <p className="font-bold text-lg">{patientData.assignedDoctor.name}</p>
        <p className="text-[#6B7280] text-sm">{patientData.assignedDoctor.specialty}</p>
        <div className="mt-6 text-left space-y-3 text-sm">
          <p className="flex items-center"><Phone className="h-5 w-5 mr-3 text-[#16A34A]" /> {patientData.assignedDoctor.phone}</p>
          <p className="flex items-center"><User className="h-5 w-5 mr-3 text-[#16A34A]" /> {patientData.assignedDoctor.email}</p>
        </div>
      </motion.div>
    </div>
  );
}

// --- CARD COMPONENTS ---

function WelcomeCard({ name }) { return <div className="bg-gradient-to-br from-[#16A34A] to-[#15803D] text-white p-6 md:p-8 rounded-2xl shadow-xl flex justify-between items-center"><div><h3 className="text-xl md:text-2xl font-bold">Hello, {name.split(' ')[0]}!</h3><p className="mt-2 text-white/80 max-w-lg text-sm md:text-base">Ready to continue your journey to wellness?</p></div><Link href="/book" className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-full hidden sm:block text-sm">New Booking</Link></div> }
function NextAppointmentCard() { return <div className="bg-white p-6 rounded-2xl shadow-lg h-full"><h3 className="text-lg font-bold text-[#1C1917]">Next Appointment</h3><div className="mt-4 bg-[#D1FAE5] p-4 rounded-lg"><p className="font-bold text-[#15803D] text-sm">Nasya Therapy</p><p className="text-xs text-[#6B7280] mt-1 flex items-center"><Calendar className="h-4 w-4 mr-2" /> Today, 3:00 PM</p></div></div> }
function ProgressCard() { const progress = progressData.overallCompletion; return <div className="bg-white p-6 rounded-2xl shadow-lg h-full"><h3 className="text-lg font-bold text-[#1C1917] mb-4">Treatment Progress</h3><div className="flex items-center justify-between text-sm text-[#6B7280] mb-2"><span>Overall Completion</span><span className="font-semibold text-[#15803D]">{progress}%</span></div><div className="w-full bg-gray-200 rounded-full h-2 mb-2"><motion.div className="bg-[#16A34A] h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: 0.5 }} /></div><p className="text-xs text-center text-[#6B7280]">3 of 5 main therapies completed.</p></div> }
function QuickActionsCard({ setActiveView, setShowContactModal }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-full">
      <h3 className="text-lg font-bold text-[#1C1917] mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button onClick={() => setActiveView('appointments')} className="w-full text-sm text-left font-semibold text-[#1C1917] hover:text-[#16A34A] flex items-center transition-colors"><ArrowRight className="h-4 w-4 mr-2" /> View Full Schedule</button>
        <button onClick={() => setShowContactModal(true)} className="w-full text-sm text-left font-semibold text-[#1C1917] hover:text-[#16A34A] flex items-center transition-colors"><ArrowRight className="h-4 w-4 mr-2" /> Contact Your Doctor</button>
        <button onClick={() => setActiveView('reports')} className="w-full text-sm text-left font-semibold text-[#1C1917] hover:text-[#16A34A] flex items-center transition-colors"><ArrowRight className="h-4 w-4 mr-2" /> View Past Reports</button>
      </div>
    </div>
  );
}
function RecentActivityCard() {
  const activities = appointmentsData.past;
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-bold text-[#1C1917] mb-4">Completed Therapies</h3>
      <ul className="space-y-4">
        {activities.map(act => (
          <li key={act.id} className="flex items-center text-sm">
            <CheckCircle className="h-5 w-5 text-[#16A34A] mr-4" />
            <p className="text-[#6B7280]"><span className="font-semibold text-[#1C1917]">{act.name}</span> was successfully completed.</p>
            <p className="ml-auto text-sm text-[#6B7280]">{act.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}