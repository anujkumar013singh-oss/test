import React, { useEffect, useRef, useState } from "react";

const MagicBento = () => {
  return (
    <section className="w-full bg-black text-white py-32">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="mb-24">
          <h2 className="bricolage-grotesque text-sm md:text-base font-extrabold uppercase tracking-[0.2em] text-white">
            More About Me
          </h2>
        </div>

        {/* Strict Swiss Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-40">

          <SwissItem
            value={30}
            suffix="+"
            label="Projects Completed"
            description="Completed multiple projects from concept to final implementation."
          />

          <SwissItem
            value={2}
            suffix="+"
            label="Years Experience"
            description="Web developer building scalable, high-performance applications under real-world constraints."
          />

          <SwissItem
            value={5000}
            suffix="+"
            label="Development Hours"
            description="Driven by consistent practice and strong full-stack development skills."
          />

          <SwissItem
            value={1}
            suffix="st"
            label="Systems First"
            description="Design architecture, APIs, and data models before implementing frontend interfaces."
          />

        </div>
      </div>
    </section>
  );
};

const SwissItem = ({ value, suffix, label, description }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
        }
      },
      { threshold: 0.4 } // Swiss: intentional visibility
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const animate = () => {
    const duration = 1200;
    const startTime = performance.now();

    const update = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  return (
    <div ref={ref} className="flex flex-col items-start">

      {/* Label */}
      <span className="mb-4 bricolage-grotesque text-xs md:text-sm font-extrabold uppercase tracking-[0.25em] text-white">
        {label}
      </span>

      {/* Number */}
      <h3 className="mb-6 bricolage-grotesque text-8xl md:text-9xl font-bold tracking-tight leading-none">
        {count.toLocaleString()}
        {suffix}
      </h3>

      {/* Description */}
      <p className="max-w-md google-sans text-lg md:text-xl font-medium leading-relaxed text-white/85">
        {description}
      </p>
    </div>
  );
};

export default MagicBento;
