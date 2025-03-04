// src/app/portfolio.tsx

"use client"

import { useTheme } from "./theme-provider"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { motion } from "framer-motion"
import Image from "next/image"
import projectsData from '@/data/projects.json'
import skillsData from '@/data/skills.json'

export default function Portfolio() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="container mx-auto px-4 md:px-12 lg:px-24 py-10">
            {/* Theme Toggle Button */}
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="fixed top-4 right-4 p-3 rounded-lg bg-gray-200 dark:bg-gray-800 shadow-md"
            >
                {theme === "dark" ? "🌞" : "🌙"}
            </button>

            <div className="flex flex-col md:flex-row gap-12">
                {/* Left Sidebar */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="md:w-[30%] p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg text-center self-start"
                >
                    <Image
                        src="/img/photo.jpg"
                        width={120}
                        height={120}
                        alt="Profile Photo"
                        className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-300 dark:border-gray-600"
                    />
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2">
                        GrayCat
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Full Stack Developer / Music Arranger / Band Leader<br />FRC8585 Young Mentor
                    </p>
                    <div className="flex justify-center gap-6 my-4">
                        <FaGithub className="text-xl text-gray-600 dark:text-gray-300 hover:text-blue-500" />
                        <FaLinkedin className="text-xl text-gray-600 dark:text-gray-300 hover:text-blue-500" />
                        <FaTwitter className="text-xl text-gray-600 dark:text-gray-300 hover:text-blue-500" />
                    </div>
                </motion.div>

                {/* Right Content */}
                <div className="md:w-[70%] space-y-8">
                    {/* Skills Section */}
                    <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                            Skills
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {skillsData.skills.map((skill) => (
                                <motion.div
                                    key={skill.id}
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "100%" }}
                                    transition={{ duration: 0.5, delay: skill.id * 0.05 }}
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
                                            style={{ background: `linear-gradient(90deg, #60A5FA, #A78BFA)` }}
                                        ></motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Projects Section */}
                    <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                            Projects
                        </h2>
                        <div className="space-y-6">
                            {projectsData.projects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: project.id * 0.2, ease: "easeOut" }}
                                    className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                                >
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {project.description}<br />
                                        <a href={project.link} className="text-blue-500 hover:text-blue-700">
                                            {project.link}
                                        </a>
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {project.technologies.map((tech, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-sm rounded">
                                                {tech}
                                            </span>
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