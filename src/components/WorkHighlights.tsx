import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
const projects = [{
  id: 1,
  title: "Design System Creation",
  description: "A comprehensive design system for a Fortune 500 company, focusing on accessibility and consistency.",
  image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
  link: "#"
}, {
  id: 2,
  title: "E-commerce Platform",
  description: "End-to-end development of a modern e-commerce platform with seamless user experience.",
  image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  link: "#"
}, {
  id: 3,
  title: "Mobile App Design",
  description: "Award-winning mobile application design for a healthcare startup.",
  image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
  link: "#"
}];
const WorkHighlights = () => {
  return <section className="py-20 bg-secondary-dark">
      <div className="container px-4 mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 uppercase">FEATURED WORK</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            A showcase of my recent projects and collaborations, demonstrating my approach to design and problem-solving.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => <motion.div key={project.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }}>
              <a href={project.link} className="block group bg-white border-2 border-primary overflow-hidden">
                <div className="relative overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105 grayscale hover:grayscale-0" />
                  <div className="absolute top-0 right-0 bg-primary p-2">
                    <ExternalLink size={18} className="text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary-dark mb-2 uppercase group-hover:text-primary">
                    {project.title}
                  </h3>
                  <p className="text-secondary-dark/80 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                    View Project
                    <ArrowRight size={18} className="ml-1" />
                  </div>
                </div>
              </a>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default WorkHighlights;