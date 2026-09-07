import { motion } from "framer-motion";
import FlowingMenu from "./FlowingMenu";

const skillCategories = [
  {
    link: "#",
    text: "Frontend Skills",
    items: [
      { name: "React", url: "https://cdn.simpleicons.org/react/61DAFB" },
      { name: "Next.js", url: "https://cdn.simpleicons.org/nextdotjs/ffffff" },
      { name: "HTML", url: "https://cdn.simpleicons.org/html5/E34F26" },
      { name: "Tailwind CSS", url: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
      { name: "JavaScript", url: "https://cdn.simpleicons.org/javascript/F7DF1E" },
      { name: "TypeScript", url: "https://cdn.simpleicons.org/typescript/3178C6" },
      { name: "Vue.js", url: "https://cdn.simpleicons.org/vuedotjs/4FC08D" },
      { name: "Vite", url: "https://cdn.simpleicons.org/vite/646CFF" },
      { name: "GSAP", url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782109284/pixora-uploads/pixora-bg-1782109284224-blb85v.png" },
      { name: "Vercel", url: "https://cdn.simpleicons.org/vercel/ffffff" },
      { name: "Netlify", url: "https://cdn.simpleicons.org/netlify/00C7B7" },
      { name: "Vanilla JS", url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782109516/pixora-uploads/pixora-bg-1782109516318-3jp46u.png" },
  ]
  },
  {
    link: "#",
    text: "Backend Skills",
    items: [
      { name: "Next.js", url: "https://cdn.simpleicons.org/nextdotjs/ffffff" },
      { name: "Node.js", url: "https://cdn.simpleicons.org/nodedotjs/5FA04E" },
      { name: "Express.js", url: "https://cdn.simpleicons.org/express/ffffff" },
      { name: "Github", url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782111671/pixora-uploads/pixora-bg-1782111671587-j2876u.png" },
      { name: "Prisma", url: "https://cdn.simpleicons.org/prisma/ffffff" },
      { name: "MongoDB", url: "https://cdn.simpleicons.org/mongodb/47A248" },
      { name: "MySQL", url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1788794646/pixora-uploads/pixora-bg-1788794646304-zv14c6.png" },
      { name: "Docker", url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1788794617/pixora-uploads/pixora-bg-1788794617213-nar11y.png" },
      { name: "Railway", url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782111943/pixora-uploads/pixora-bg-1782111943041-xh6ali.png" },
      { name: "Git", url: "https://cdn.simpleicons.org/git/F05032" },
      { name: "postgre sql", url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782109876/pixora-uploads/pixora-bg-1782109875978-ntckil.png" },
      { name: "Render", url: "https://cdn.simpleicons.org/render/46E3B7" },
    ]
  },
  {
    link: "#",
    text: "AI Tools & LLM",
    items: [
      { name: "Claude", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/960px-Claude_AI_symbol.svg.png" },
      { name: "Cursor", url: "https://cdn.simpleicons.org/cursor/ffffff" },
      { name: "Antigravity", url: "https://antigravity.google/assets/image/brand/antigravity-icon__white.png" },
      { name: "Open Code", url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782111156/pixora-uploads/pixora-bg-1782111156769-rbjkti.png" },
      { name: "Gemini", url: "https://cdn.simpleicons.org/googlegemini/8E75B2" },
      { name: "Manus", url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782111096/pixora-uploads/pixora-bg-1782111096872-y810y2.png" },
      { name: "Github Co-Pilot", url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782110081/pixora-uploads/pixora-bg-1782110081328-wwo2r2.png" },
      { name: "Notion", url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782110989/pixora-uploads/pixora-bg-1782110989470-jm088r.png" },
      { name: "Trae", url: "https://images.saasworthy.com/trae_51840_logo_1753948921_8ohgm.png" },
      { name: "Qwen", url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782110140/pixora-uploads/pixora-bg-1782110140415-pzkdgf.png" },
      { name: "Windsurf", url: "https://cdn.simpleicons.org/windsurf/2D9EFF" },
      { name: "Qoder", url: "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782110185/pixora-uploads/pixora-bg-1782110185354-l632jn.png" },
      { name: "Codex", url: "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/codex-color.png" },
    ]
  }
];

const SkillsPhilosophy = () => {
  return (
    // Unified layout using justify-center on all breakpoints to keep elements seamlessly grouped
    <section className="min-h-screen bg-white text-black font-sans flex flex-col justify-center">
      <div className="w-full px-6 md:px-12 lg:px-16 pt-24 pb-12 md:pt-12 md:pb-12 bg-white z-10 md:flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-y-8"
        >
          <div className="md:col-span-1">
            <h2 className="bricolage-grotesque text-xs font-bold uppercase tracking-widest">Skills & Philosophy</h2>
          </div>
          <div className="md:col-span-4">
            <blockquote className="bricolage-grotesque text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase leading-tight">
              “The only way to learn a new programming language is by writing programs in it.”
            </blockquote>
            <p className="google-sans mt-6">— Dennis Ritchie</p>
          </div>
        </motion.div>
      </div>

      <div className="w-full border-t border-black relative overflow-hidden">
        <FlowingMenu
          items={skillCategories}
          speed={3}
          marqueeBgColor="#000000"
        />
      </div>
    </section>
  );
};

export default SkillsPhilosophy;