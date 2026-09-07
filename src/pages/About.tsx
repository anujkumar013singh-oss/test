import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const About = () => {
  // Safe window height check for SSR
  const [vh, setVh] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );

  useEffect(() => {
    const updateVh = () => setVh(window.innerHeight);
    updateVh(); // Set on mount
    window.addEventListener("resize", updateVh);
    return () => window.removeEventListener("resize", updateVh);
  }, []);

  const { scrollY } = useScroll();

  // Scroll mapping: 
  // As the user scrolls from 0 to 100vh (the Hero height), 
  // the text precisely fades in and slides up. We stagger the start/end points.

  // Section 1: Context Label
  const y1 = useTransform(scrollY, [0, vh * 0.4], [80, 0]);
  const opacity1 = useTransform(scrollY, [0, vh * 0.3], [0, 1]);

  // Section 2: Education
  const y2 = useTransform(scrollY, [vh * 0.1, vh * 0.5], [80, 0]);
  const opacity2 = useTransform(scrollY, [vh * 0.1, vh * 0.4], [0, 1]);

  // Section 3: Experience
  const y3 = useTransform(scrollY, [vh * 0.2, vh * 0.6], [80, 0]);
  const opacity3 = useTransform(scrollY, [vh * 0.2, vh * 0.5], [0, 1]);

  // Section 4: Focus
  const y4 = useTransform(scrollY, [vh * 0.3, vh * 0.7], [80, 0]);
  const opacity4 = useTransform(scrollY, [vh * 0.3, vh * 0.6], [0, 1]);

  return (
    <section className="h-screen w-full bg-white text-black font-sans px-6 md:px-12 lg:px-16 overflow-hidden flex items-center justify-center relative">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-12 w-full max-w-[1600px] mx-auto">

        {/* Left Column: Context Label */}
        <motion.div
          className="md:col-span-3 lg:col-span-3 pt-2"
          style={{ y: y1, opacity: opacity1 }}
        >
          <h2 className="bricolage-grotesque text-sm md:text-base font-extrabold uppercase tracking-widest text-black">
            Background & Data
          </h2>
        </motion.div>

        {/* Right Column: The Data List */}
        <div className="md:col-span-9 lg:col-span-9 flex flex-col gap-10 md:gap-12">

          {/* 01. EDUCATION */}
          <motion.div style={{ y: y2, opacity: opacity2 }} className="flex flex-col gap-2">
            <h3 className="bricolage-grotesque text-sm md:text-base font-extrabold uppercase tracking-wide text-black mb-1">
              01. Education
            </h3>
            <div className="flex flex-col gap-6">
              <div>
                <p className="bricolage-grotesque text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-black">
                  Bachelor of Computer Applications
                </p>
                <p className="google-sans text-xl md:text-2xl lg:text-3xl font-medium text-black/80 leading-tight tracking-tight">
                  Galgotias University | In Progress
                </p>
              </div>
              <div>
                <p className="bricolage-grotesque text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-black">
                  Web Development Certification
                </p>
                <p className="google-sans text-xl md:text-2xl lg:text-3xl font-medium text-black/80 leading-tight tracking-tight">
                  Elevate Institute | 2025
                </p>
              </div>
              <div>
                <p className="bricolage-grotesque text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-black">
                  Computer Applications Certification
                </p>
                <p className="google-sans text-xl md:text-2xl lg:text-3xl font-medium text-black/80 leading-tight tracking-tight">
                  OM CTI | 2024
                </p>
              </div>
            </div>
          </motion.div>

          {/* 02. EXPERIENCE */}
          <motion.div style={{ y: y3, opacity: opacity3 }} className="flex flex-col gap-2">
            <h3 className="bricolage-grotesque text-sm md:text-base font-extrabold uppercase tracking-wide text-black mb-1">
              02. Experience
            </h3>

            <div className="flex flex-col gap-6">
              <div>
                <p className="bricolage-grotesque text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-black">
                  NickelFox Technologies
                </p>
                <p className="google-sans text-xl md:text-2xl lg:text-3xl font-medium text-black/80 leading-tight tracking-tight">
                  Frontend Developer Intern
                </p>
              </div>
            </div>
          </motion.div>

          {/* 03. FOCUS */}
          <motion.div style={{ y: y4, opacity: opacity4 }} className="flex flex-col gap-2">
            <h3 className="bricolage-grotesque text-sm md:text-base font-extrabold uppercase tracking-wide text-black mb-1">
              03. Focus
            </h3>
            <ul className="flex flex-col gap-2">
              <li className="bricolage-grotesque text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-black">
                Building Modern Web Interfaces
              </li>
              <li className="bricolage-grotesque text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-black">
                Integrating APIs & Backend Systems
              </li>
              <li className="bricolage-grotesque text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-black">
                Creating AI-Powered Features using LLMs
              </li>
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;