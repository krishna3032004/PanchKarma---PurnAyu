// app/dashboard/page.js
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, BarChart3, User, Settings, Bell, ChevronDown, CheckCircle, Clock, Activity, Target, PlusCircle, Edit2 } from 'lucide-react';

// Animation Variants
const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay } },
});

// Main Dashboard Component
export default function PatientDashboard() {
  return (
    <div className="bg-gray-50 min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <UpcomingAppointment />
            <TreatmentTimeline />
          </div>
          <div className="space-y-8">
            <TherapyProgress />
            <HealthMetricsChart />
          </div>
        </main>
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar() {
    return (
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="w-64 bg-white shadow-lg flex-col hidden lg:flex"
      >
        <div className="flex items-center justify-center h-20 border-b">
          <h1 className="text-2xl font-bold font-serif text-brand-green-darkest">PurnAyu</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg">
            <LayoutDashboard className="h-5 w-5 mr-3" /> Home
          </Link>
          <Link href="#" className="flex items-center px-4 py-3 text-brand-text bg-brand-green-light rounded-lg">
            <LayoutDashboard className="h-5 w-5 mr-3" /> Dashboard
          </Link>
          <Link href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Calendar className="h-5 w-5 mr-3" /> Appointments
          </Link>
          <Link href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg">
            <BarChart3 className="h-5 w-5 mr-3" /> Progress
          </Link>
          <Link href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg">
            <User className="h-5 w-5 mr-3" /> Profile
          </Link>
        </nav>
        <div className="px-4 py-6 border-t">
          <Link href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Settings className="h-5 w-5 mr-3" /> Settings
          </Link>
        </div>
      </motion.aside>
    );
}

// Header Component
function Header() {
    return (
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-brand-text">Welcome Back, Patient!</h2>
          <p className="text-gray-500 mt-1">Here is your health summary for today.</p>
        </div>
        <div className="flex items-center space-x-6">
          <Bell className="text-gray-500 hover:text-brand-green cursor-pointer" />
          <div className="flex items-center space-x-3">
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80" alt="Patient" className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p className="font-semibold">Johanna W.</p>
              <p className="text-sm text-gray-500">Patient</p>
            </div>
            <ChevronDown className="text-gray-500" />
          </div>
        </div>
      </motion.header>
    );
}
  
// Upcoming Appointment Card
function UpcomingAppointment() {
    return (
      <motion.div variants={fadeIn(0.2)} className="bg-brand-green-darkest text-white p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-brand-green-light">Upcoming Session</p>
                <h3 className="text-3xl font-bold mt-2">Shirodhara Therapy</h3>
                <p className="mt-4 text-brand-green-light flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Today, September 13, 2025</span>
                </p>
                <p className="mt-2 text-brand-green-light flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>3:00 PM - 4:00 PM</span>
                </p>
            </div>
            <div className="text-center">
                <p className="text-5xl font-bold">13</p>
                <p className="text-brand-green-light">September</p>
            </div>
        </div>
        {/* <motion.button whileHover={{scale: 1.05}} className="mt-6 bg-white text-brand-green-darkest font-semibold py-3 px-6 rounded-lg">
          Join Session
        </motion.button> */}
      </motion.div>
    );
}

// UPDATED Treatment Timeline Card
function TreatmentTimeline() {
    const initialTimeline = [
        { name: 'Vamana', status: 'completed', date: '02 Sep', duration: '1 Day' },
        { name: 'Virechana', status: 'completed', date: '05 Sep', duration: '1 Day' },
        { name: 'Basti', status: 'completed', date: '08 Sep', duration: '3 Days' },
        { name: 'Shirodhara', status: 'upcoming', date: '13 Sep', duration: '5 Days' },
        { name: 'Nasya', status: 'upcoming', date: '18 Sep', duration: '5 Days' },
    ];
    
    const [timeline, setTimeline] = useState(initialTimeline);

    const handleDateChange = (index) => {
        const newDate = prompt("Enter new date (e.g., 20 Sep):");
        if (newDate) {
            const updatedTimeline = [...timeline];
            updatedTimeline[index].date = newDate;
            setTimeline(updatedTimeline);
        }
    };

    return (
        <motion.div variants={fadeIn(0.3)} className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-brand-text mb-6">Your Treatment Timeline</h3>
            <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 border-l-2 border-dotted"></div>
                
                {timeline.map((item, index) => (
                    <div key={index} className="flex items-center mb-6">
                        <div className={`z-10 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${item.status === 'completed' ? 'bg-brand-green' : 'bg-gray-300'}`}>
                            {item.status === 'completed' ? <CheckCircle className="h-5 w-5 text-white" /> : <Clock className="h-5 w-5 text-white" />}
                        </div>
                        <div className="ml-6 flex-1 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{item.name} <span className="text-sm font-normal text-gray-500">({item.duration})</span></p>
                                <p className="text-sm text-gray-500">{item.date}, 2025</p>
                            </div>
                            {item.status === 'upcoming' && (
                                <motion.button 
                                    onClick={() => handleDateChange(index)}
                                    whileHover={{ scale: 1.1 }}
                                    className="text-sm text-brand-green font-semibold flex items-center"
                                >
                                    <Edit2 className="h-4 w-4 mr-1" /> Change
                                </motion.button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// Therapy Progress Card
function TherapyProgress() {
    return (
        <motion.div variants={fadeIn(0.4)} className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-brand-text">Therapy Progress</h3>
            <div className="relative my-6">
                <svg className="h-40 w-40 transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-brand-green-light)" strokeWidth="12" />
                    <motion.circle 
                        cx="60" cy="60" r="54" fill="none" 
                        stroke="var(--color-brand-green)" strokeWidth="12"
                        strokeDasharray="339.292"
                        strokeDashoffset={339.292 * (1 - 0.6)} // 60% progress
                        initial={{ strokeDashoffset: 339.292 }}
                        animate={{ strokeDashoffset: 339.292 * (1 - 0.6) }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-brand-green">60%</span>
                    <span className="text-gray-500">Completed</span>
                </div>
            </div>
            <p className="text-gray-500">You are doing great! 3 out of 5 main therapies completed.</p>
        </motion.div>
    );
}
  
// Health Metrics Chart Card
function HealthMetricsChart() {
    return (
        <motion.div variants={fadeIn(0.5)} className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-brand-text mb-4">Health Metrics</h3>
            <p className="text-sm text-gray-500 mb-6">Your progress over the last 7 days.</p>
            <div className="h-48 flex items-end space-x-2">
                <motion.div initial={{height: 0}} animate={{height: '40%'}} transition={{delay: 0.6}} className="bg-brand-green-light w-full rounded-t-lg"></motion.div>
                <motion.div initial={{height: 0}} animate={{height: '60%'}} transition={{delay: 0.7}} className="bg-brand-green-light w-full rounded-t-lg"></motion.div>
                <motion.div initial={{height: 0}} animate={{height: '50%'}} transition={{delay: 0.8}} className="bg-brand-green-light w-full rounded-t-lg"></motion.div>
                <motion.div initial={{height: 0}} animate={{height: '75%'}} transition={{delay: 0.9}} className="bg-brand-green w-full rounded-t-lg"></motion.div>
                <motion.div initial={{height: 0}} animate={{height: '65%'}} transition={{delay: 1.0}} className="bg-brand-green-light w-full rounded-t-lg"></motion.div>
                <motion.div initial={{height: 0}} animate={{height: '80%'}} transition={{delay: 1.1}} className="bg-brand-green-light w-full rounded-t-lg"></motion.div>
                <motion.div initial={{height: 0}} animate={{height: '90%'}} transition={{delay: 1.2}} className="bg-brand-green w-full rounded-t-lg"></motion.div>
            </div>
        </motion.div>
    );
}