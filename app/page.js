// app/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Leaf, Menu, X, User, CheckCircle, Heart, Star, PlayCircle, Stethoscope, BookOpen, ShieldCheck, ArrowRight, Wind, Sun, Droplets } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

// Animation Variants
const fadeIn = (direction = 'up', delay = 0) => ({
  hidden: { opacity: 0, y: direction === 'up' ? 40 : -40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut", delay }
  },
});

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

// Reusable Animated Component
function AnimatedSection({ children, className, id }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  return (
    <motion.section ref={ref} id={id} initial="hidden" animate={controls} variants={staggerContainer} className={className}>
      {children}
    </motion.section>
  );
}

// Main Page Component
export default function HomePage() {
  const { scrollYProgress } = useScroll();
  
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.3, 0.45, 0.55, 0.7, 0.8, 0.95],
    [
      '#FFFFFF',   // Start White
      '#F0FDF4',   // Transition to Light Leaf
      '#F0FDF4',   // Hold Light Leaf for Panchkarma Section
      '#FFFFFF',   // Transition to White for Therapies
      '#FFFFFF',   // Hold White for Doctors
      '#FAFAF9',   // Transition to Light Gray
      '#FAFAF9',   // Hold Light Gray
      '#FFFFFF',   // Transition to White for Why Us
      '#F0FDF4'    // Transition to Light Leaf for Testimonials
    ]
  );

  return (
    <motion.div style={{ backgroundColor }}>
      <Navbar />
      <main>
        <HeroSection />
        <PanchkarmaIntroSection />
        <TherapiesSection />
        <DoctorsSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </motion.div>
  );
}

function Navbar() {
    const { data: session, status } = useSession(); // Login status check karne ke liye
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => { setScrolled(window.scrollY > 50); };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navTextStyle = scrolled ? 'text-brand-text' : 'text-white drop-shadow-lg';

    return (
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 shadow-md' : 'bg-black/0'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className={`${scrolled ? 'text-brand-green-darkest' : 'text-white'} h-8 w-8 transition-colors drop-shadow-lg`} />
            <span className={`text-2xl font-bold font-serif ${scrolled ? 'text-brand-green-darkest' : 'text-white'} transition-colors drop-shadow-lg`}>PurnAyu</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="#therapies" className={`${navTextStyle} hover:text-brand-green transition-colors font-medium`}>Therapies</Link>
            <Link href="#doctors" className={`${navTextStyle} hover:text-brand-green transition-colors font-medium`}>Doctors</Link>
            <Link href="#why-us" className={`${navTextStyle} hover:text-brand-green transition-colors font-medium`}>Why Us</Link>
          </nav>
  
          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'authenticated' ? (
                <>
                    <span className={`${navTextStyle} font-medium`}>Hi, {session.user.name.split(' ')[0]}</span>
                    <Link href="/dashboard" className="bg-brand-green text-white px-5 py-2 rounded-full hover:bg-brand-green-dark shadow-lg">
                      Dashboard
                    </Link>
                    <button onClick={() => signOut()} className={`${navTextStyle} cursor-pointer font-medium`}>Logout</button>
                </>
            ) : (
                <>
                    <Link href="/login" className={`flex items-center space-x-2 ${navTextStyle} hover:text-brand-green transition-colors font-medium`}>
                        <User size={20} /> <span>Login</span>
                    </Link>
                    <motion.a href="/book" whileHover={{ scale: 1.05 }} className="bg-brand-green text-white px-5 py-2 rounded-full hover:bg-brand-green-dark shadow-lg">
                        Book Now
                    </motion.a>
                </>
            )}
          </div>
  
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className={`${navTextStyle}`} /> : <Menu className={`${navTextStyle}`} />}
            </button>
          </div>
        </div>
         
         {/* Mobile Menu (UPDATED) */}
         {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-sm px-6 pb-4 flex flex-col space-y-4"
          >
            <Link href="#therapies" className="block text-brand-text hover:text-brand-green transition-colors">Therapies</Link>
            <Link href="#doctors" className="block text-brand-text hover:text-brand-green transition-colors">Doctors</Link>
            <Link href="#why-us" className="block text-brand-text hover:text-brand-green transition-colors">Why Us</Link>
            <hr/>
            
            {status === 'authenticated' ? (
                <>
                    <Link href="/dashboard" className="bg-brand-green text-white px-5 py-2 rounded-full text-center hover:bg-brand-green-dark">
                      Dashboard
                    </Link>
                    <button onClick={() => signOut()} className="text-brand-text font-medium text-center py-2">Logout</button>
                </>
            ) : (
                <>
                    <Link href="/login" className="flex items-center justify-center space-x-2 text-brand-text hover:text-brand-green transition-colors">
                        <User size={20} />
                        <span>Login</span>
                    </Link>
                    <Link href="/book" className="bg-brand-green text-white px-5 py-2 rounded-full text-center hover:bg-brand-green-dark transition-all duration-300 shadow-lg">
                        Book Now
                    </Link>
                </>
            )}
          </motion.div>
        )}
      </header>
    );
}

// Navbar
// function Navbar() {
//     const [isOpen, setIsOpen] = useState(false);
//     const [scrolled, setScrolled] = useState(false);
  
//     useEffect(() => {
//       const handleScroll = () => { setScrolled(window.scrollY > 50); };
//       window.addEventListener('scroll', handleScroll);
//       return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     const navTextStyle = scrolled ? 'text-brand-text' : 'text-white drop-shadow-lg';

//     return (
//       <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 shadow-md' : 'bg-black/0'} `}>
//         <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//           <Link href="/" className="flex items-center space-x-2">
//             <Leaf className={`${scrolled ? 'text-brand-green-darkest' : 'text-white'} h-8 w-8 transition-colors drop-shadow-lg`} />
//             <span className={`text-2xl font-bold font-serif ${scrolled ? 'text-brand-green-darkest' : 'text-white'} transition-colors drop-shadow-lg`}>PurnAyu</span>
//           </Link>
          
//           <nav className="hidden md:flex space-x-8 items-center">
//             <Link href="#therapies" className={`${navTextStyle} hover:text-brand-green transition-colors font-medium`}>Therapies</Link>
//             <Link href="#doctors" className={`${navTextStyle} hover:text-brand-green transition-colors font-medium`}>Doctors</Link>
//             <Link href="#why-us" className={`${navTextStyle} hover:text-brand-green transition-colors font-medium`}>Why Us</Link>
//           </nav>
  
//           <div className="hidden md:flex items-center space-x-4">
//             <Link href="/login" className={`flex items-center space-x-2 ${navTextStyle} hover:text-brand-green transition-colors font-medium`}>
//               <User size={20} /> <span>Login</span>
//             </Link>
//             <motion.a href="/book" whileHover={{ scale: 1.05 }} className="bg-brand-green text-white px-5 py-2 rounded-full hover:bg-brand-green-dark shadow-lg">
//               Book Now
//             </motion.a>
//           </div>
  
//           <div className="md:hidden">
//             <button onClick={() => setIsOpen(!isOpen)}>
//               {isOpen ? <X className={`${navTextStyle}`} /> : <Menu className={`${navTextStyle}`} />}
//             </button>
//           </div>
//         </div>
         
//          {isOpen && (
//           <motion.div 
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="md:hidden bg-white/95 backdrop-blur-sm px-6 pb-4 flex flex-col space-y-4"
//           >
//             <Link href="#therapies" className="block text-brand-text hover:text-brand-green transition-colors">Therapies</Link>
//             <Link href="#doctors" className="block text-brand-text hover:text-brand-green transition-colors">Doctors</Link>
//             <Link href="#why-us" className="block text-brand-text hover:text-brand-green transition-colors">Why Us</Link>
//             <hr/>
//             <Link href="/login" className="flex items-center space-x-2 text-brand-text hover:text-brand-green transition-colors">
//               <User size={20} />
//               <span>Login</span>
//             </Link>
//             <Link href="/book" className="bg-brand-green text-white px-5 py-2 rounded-full text-center hover:bg-brand-green-dark transition-all duration-300 shadow-lg">
//               Book Now
//             </Link>
//           </motion.div>
//         )}
//       </header>
//     );
// }
  
// Hero Section
function HeroSection() {
    return (
      <section className="relative h-screen flex flex-col items-center justify-center text-white overflow-hidden">
        {/* <img src="/main.jpg" alt="" className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover" /> */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
        >
          <source src="/mainly101.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* <div className="absolute inset-0 bg-brand-green-darkest bg-opacity-60 z-10"></div> */}
        <div className="relative z-20 text-center px-4 flex flex-col items-center">
            <motion.h1 initial={{opacity: 0, y:20}} animate={{opacity:1, y:0}} transition={{duration: 0.8}} className="text-4xl md:text-7xl font-serif font-bold mb-4 leading-tight drop-shadow-lg">Heal Naturally, Live Fully</motion.h1>
            <motion.p initial={{opacity: 0, y:20}} animate={{opacity:1, y:0}} transition={{duration: 0.8, delay: 0.2}} className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md">Discover authentic Ayurveda and Panchkarma therapies for holistic well-being.</motion.p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#F0FDF4] to-transparent z-10"></div>
      </section>
    );
}
  
// Panchkarma Intro Section
function PanchkarmaIntroSection() {
  const stages2 = [
        { name: 'Vamana (Emesis)', desc: 'A controlled, therapeutic vomiting process to eliminate excess Kapha dosha, clearing congestion and respiratory issues.' },
        { name: 'Virechana (Purgation)', desc: 'Medicated cleansing of the bowels to expel excess Pitta dosha, helping with metabolic and skin disorders.' },
        { name: 'Basti (Enema)', desc: 'Herbal oil or decoction enemas to cleanse the colon and balance Vata dosha, the king of all doshas.' },
        { name: 'Nasya (Nasal Therapy)', desc: 'Administration of medicated oils through the nasal passage to cleanse the head and sinus region.' },
        { name: 'Raktamokshana (Bloodletting)', desc: 'A controlled procedure to purify the blood, highly effective for various skin diseases and infections.' },
    ];
    const stages = [
        { 
            icon: Wind,
            name: 'Purvakarma (Preparation)', 
            desc: 'This initial stage prepares your body for deep cleansing. It involves Snehana (oleation) and Swedana (therapeutic sweating) to loosen and guide toxins towards the digestive tract for removal.' 
        },
        { 
            icon: Sun,
            name: 'Pradhanakarma (Main Therapy)', 
            desc: 'The core of Panchkarma, this stage involves the five main purification therapies to eliminate toxins and restore your doshic balance. The parts are detailed below.' 
        },
        { 
            icon: Droplets,
            name: 'Paschatkarma (Rejuvenation)', 
            desc: 'The final stage focuses on restoring the body’s strength and immunity. It includes a specialized diet, lifestyle adjustments, and restorative therapies to nourish your tissues and maximize the benefits.' 
        },
    ];
    return (
        <AnimatedSection className="py-24" id="intro">
            <div className="container mx-auto px-6 text-center">
                <motion.div variants={fadeIn('up')}>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-green-darkest mb-6">The Three Stages of Panchkarma</h2>
                    <p className="text-brand-text-light max-w-3xl mx-auto mb-12 text-lg leading-relaxed">
                        Panchkarma is a systematic, three-stage process of detoxification and rejuvenation. Each stage is crucial for safely and effectively cleansing the body and restoring its natural balance.
                    </p>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-10">
                    {stages.map((stage, index) => (
                        <motion.div key={stage.name} variants={fadeIn('up', index * 0.1)} className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-brand-green-light p-5 rounded-full mb-6 text-brand-green">
                                <stage.icon size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-brand-green-dark mb-4">{stage.name}</h3>
                            <p className="text-brand-text-light leading-relaxed">{stage.desc}</p>
                        </motion.div>
                    ))}
                </div>
                
            </div>
        </AnimatedSection>
    )
}

// UPDATED Therapies Section with Detailed Descriptions
function TherapiesSection() {
    const therapies = [
        { name: 'Vamana', img: '/vamana2.jpg', desc: "A controlled emesis therapy to expel excess Kapha dosha, primarily for respiratory and sinus issues." },
        { name: 'Virechana', img: '/virechana.jpg', desc: "A medicated purgation therapy that cleanses the gastrointestinal tract to eliminate excess Pitta dosha." },
        { name: 'Basti', img: '/basti.jpg', desc: "A medicated enema, considered the mother of all treatments for its power to balance the Vata dosha." },
        { name: 'Nasya', img: '/nasya.jpg', desc: "Nasal administration of herbal oils to cleanse and nourish the head, neck, and shoulder regions." },
        { name: 'Raktamokshana', img: '/raktamokshana.jpg', desc: "A traditional blood purification therapy, effective for various skin disorders and chronic infections." },
    ];
    
  return (
    <AnimatedSection id="therapies" className="py-24">
      <div className="container mx-auto px-6">
        <motion.h2 variants={fadeIn()} className="text-3xl md:text-4xl font-serif font-bold text-brand-green-darkest mb-4 text-center">Experience Pradhanakarma</motion.h2>
        <motion.p variants={fadeIn()} className="text-brand-text-light max-w-3xl mx-auto mb-12 text-center">
          The five core therapies of Panchkarma, chosen by our experts to address your specific needs and restore balance.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {therapies.map((therapy, i) => (
            <motion.div key={i} variants={fadeIn('up', i * 0.1)} className="rounded-lg overflow-hidden shadow-xl group cursor-pointer relative h-80">
                <img src={therapy.img} alt={therapy.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl font-bold font-serif text-white">{therapy.name}</h3>
                  <p className="text-gray-200">{therapy.desc}</p>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// Doctors Section
function DoctorsSection() {
    const doctors = [
        { name: 'Dr. Anjali Verma', specialty: 'Panchkarma Specialist', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80' },
        { name: 'Dr. Rohan Sharma', specialty: 'Kayachikitsa', img: '/Dr2.png' },
        { name: 'Dr. Priya Desai', specialty: 'Pulse Diagnosis', img: '/dr3.jpg' },
        { name: 'Dr. Vikram Singh', specialty: 'Herbal Medicine', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },
    ];
  return (
    <AnimatedSection id="doctors" className="py-24">
      <div className="container mx-auto px-6 text-center">
        <motion.h2 variants={fadeIn()} className="text-3xl md:text-4xl font-serif font-bold text-brand-green-darkest mb-4">Consult Top Ayurveda Doctors</motion.h2>
        <motion.p variants={fadeIn()} className="text-brand-text-light max-w-3xl mx-auto mb-12">Get personalized consultations from our team of experienced Ayurvedic experts.</motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doc, i) => (
            <motion.div key={i} variants={fadeIn('up', i * 0.1)} className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
              <img src={doc.img} alt={doc.name} className="w-full h-56 object-cover object-center" />
              <div className="p-6">
                <h3 className="text-xl font-bold font-serif text-brand-text mb-1">{doc.name}</h3>
                <p className="text-brand-green">{doc.specialty}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// Why Choose Us Section
function WhyChooseUsSection() {
    const features = [
        { icon: Stethoscope, title: 'Expert Guidance', desc: 'Personalized care from certified Ayurvedic doctors.' },
        { icon: BookOpen, title: 'Ancient Wisdom', desc: 'Therapies based on authentic, traditional texts.' },
        { icon: ShieldCheck, title: 'Pure & Natural', desc: 'We use only high-quality organic herbs and oils.' },
    ];
  return (
    <AnimatedSection id="why-us" className="py-24">
      <div className="container mx-auto px-6 text-center">
        <motion.h2 variants={fadeIn()} className="text-3xl md:text-4xl font-serif font-bold text-brand-green-darkest mb-12">Why Choose Panchkarma Ayurveda?</motion.h2>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeIn('up', index*0.1)} className="flex flex-col items-center">
              <div className="bg-brand-green-light p-6 rounded-full mb-6 text-brand-green transition-all duration-300 hover:bg-brand-green hover:text-white hover:scale-110">
                <feature.icon size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold font-serif text-brand-text mb-2">{feature.title}</h3>
              <p className="text-brand-text-light">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// Testimonials Section
function TestimonialsSection() {
    return (
      <AnimatedSection className="py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.h2 variants={fadeIn()} className="text-3xl md:text-4xl font-serif font-bold text-brand-green-darkest mb-12">Stories of Healing</motion.h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeIn()} className="relative aspect-video rounded-lg overflow-hidden shadow-xl group">
                  <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=500&q=80" alt="Patient video" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <PlayCircle className="text-white h-20 w-20 transform group-hover:scale-110 transition-transform duration-300 cursor-pointer" />
                  </div>
              </motion.div>
              <motion.div variants={fadeIn()} className="text-left bg-white p-8 rounded-lg shadow-xl">
                <div className="flex text-yellow-400 mb-4">
                  <Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" />
                </div>
                <p className="text-lg italic text-brand-text-light mb-6">"This was a life-changing experience. I feel completely renewed and energetic after the Panchkarma treatment."</p>
                <p className="font-bold text-brand-text">- Anjali Sharma, Mumbai</p>
              </motion.div>
          </div>
        </div>
      </AnimatedSection>
    );
}

// Footer
function Footer() {
    return (
      <footer className="bg-brand-green-darkest text-white font-sans">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
              <div>
                <h3 className="text-xl font-serif font-bold mb-4">PurnAyu</h3>
                <p className="text-gray-300">Your path to holistic wellness.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul>
                  <li className="mb-2"><Link href="#doctors" className="hover:text-yellow-400">Doctors</Link></li>
                  <li className="mb-2"><Link href="#therapies" className="hover:text-yellow-400">Therapies</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Contact Us</h3>
                <p className="text-gray-300">Wellness City, India</p>
                <p className="text-gray-300">contact@purnayu.com</p>
              </div>
            </div>
            <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} PurnAyu. All Rights Reserved.</p>
            </div>
        </div>
      </footer>
    );
}