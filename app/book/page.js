// app/book/page.js
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Check } from 'lucide-react';

export default function BookingPage() {
  return (
    // Background ko greenish theme di gayi hai
    <div className="min-h-screen bg-brand-green-light flex flex-col items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        // Mobile ke liye padding kam aur shadow halki, desktop par normal
        className="w-full max-w-2xl bg-white rounded-2xl shadow-lg md:shadow-xl p-6 md:p-10 text-center"
      >
        <div className="flex justify-center mb-6">
            <div className="bg-brand-green p-4 rounded-full text-white shadow-md">
                <Bot size={40} />
            </div>
        </div>

        {/* Mobile par text chhota, desktop par bada */}
        <h1 className="text-xl md:text-2xl font-bold font-serif text-brand-green-darkest">Booking via our AI Assistant</h1>
        <p className="text-brand-text-light mt-4 text-sm md:text-base leading-relaxed">
          To provide you with the best experience, your booking will be handled by our smart AI Assistant on Telegram.
        </p>

        <div className="text-left my-8 p-4 sm:p-6 bg-gray-50 rounded-lg">
            <h2 className="text-md md:text-lg font-semibold text-brand-text mb-4">What to Expect:</h2>
            <ul className="space-y-3">
                <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-green mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm md:text-base">The assistant will ask a few questions about your health needs.</span>
                </li>
                <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-green mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm md:text-base">It will find the best therapist for you based on your location.</span>
                </li>
                <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-green mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm md:text-base">You&apos;ll receive a complete schedule for your therapies.</span>
                </li>
            </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a 
              href="https://t.me/YourTelegramBotUsername" // Yahan apne Telegram bot ka link daalein
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="w-full sm:w-auto flex items-center justify-center py-3 px-8 bg-brand-green text-white font-semibold rounded-full shadow-md hover:bg-brand-green-dark"
            >
              Continue to Telegram
              <ArrowRight className="h-5 w-5 ml-2" />
            </motion.a>
            <Link href="/" className="w-full sm:w-auto flex items-center justify-center py-3 px-8 text-brand-text-light font-semibold hover:text-brand-text">
              Go Back
            </Link>
        </div>
      </motion.div>
    </div>
  );
}