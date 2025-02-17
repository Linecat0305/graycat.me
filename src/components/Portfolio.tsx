"use client"

import { useTheme } from "./theme-provider"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { motion } from "framer-motion"
import projectsData from '@/data/projects.json'
import skillsData from '@/data/skills.json'

export default function Portfolio() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="container mx-auto px-4">
            {/* Theme Toggle Button */}
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="fixed top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-800"
            >
                {theme === "dark" ? "🌞" : "🌙"}
            </button>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Sidebar */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="md:w-[30%] p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg"
                    style={{
                        position: "sticky",
                        top: "2rem",
                        height: "fit-content",
                    }}
                >
                    <div className="text-center">
                        <img
                            src="/img/photo.jpg"
                            alt="Profile"
                            className="w-32 h-32 rounded-full mx-auto mb-4"
                        />
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            GrayCat
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Full Stack Developer / Music Arranger / Band Leader<br />FRC8585 Young Mentor
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h2 className="font-bold text-gray-800 dark:text-white mb-2">Contact</h2>
                            <p className="text-gray-600 dark:text-gray-300">graycat@elements.tw</p>
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 dark:text-white mb-2">Location</h2>
                            <p className="text-gray-600 dark:text-gray-300">Taipei</p>
                        </div>
                    </div>
                    <br />
                    <div className="flex justify-center space-x-4 mb-6">
                        <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
                            <FaGithub size={24} />
                        </a>
                        <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
                            <FaLinkedin size={24} />
                        </a>
                        <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
                            <FaTwitter size={24} />
                        </a>
                    </div>
                </motion.div>

                {/* Right Content */}
                <div className="md:w-[70%] space-y-8 py-14">
                    {/* Skills Section */}
                    <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            Skills
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {skillsData.skills.map((skill) => (
                                <motion.div
                                    key={skill.id}
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "100%" }}
                                    transition={{ duration: 0.5, delay: skill.id * 0.05}}
                                    className="bg-white dark:bg-gray-700 p-4 rounded-lg"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-medium text-gray-800 dark:text-white">
                                            {skill.name}
                                        </h3>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {skill.level}%
                                        </span>
                                    </div>
                                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.level}%` }}
                                            transition={{ duration: 0.8, delay: skill.id * 0.1 }}
                                            className="h-full rounded-full"
                                            style={{
                                                background: `linear-gradient(90deg, 
                ${theme === 'dark' ? '#3B82F6' : '#60A5FA'} 0%, 
                ${theme === 'dark' ? '#8B5CF6' : '#A78BFA'} 100%)`
                                            }}
                                        ></motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Projects Section */}
                    <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            Projects
                        </h2>
                        <div className="space-y-6">
                            {projectsData.projects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: project.id * 0.2,
                                        ease: "easeOut"
                                    }}
                                    className="bg-white dark:bg-gray-700 p-4 rounded-lg transform hover:scale-[1.02] transition-transform"
                                >
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                                        {project.description}<br />
                                        Link : <a href={project.link} className="hover:text-blue-500 transition-colors">
                                            <u>{project.link}</u>
                                        </a>
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: project.id * 0.01 + index * 0.05
                                                }}
                                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 
                                     text-sm rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                                            >
                                                {tech}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}