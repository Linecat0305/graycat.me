// src/app/portfolio.tsx

"use client"

import { useTheme } from "./theme-provider"
import { FaGithub, FaLinkedin, FaEnvelope, FaGraduationCap, FaCertificate, FaCode, FaLaptopCode } from "react-icons/fa"
import { motion } from "framer-motion"
import Image from "next/image"
import projectsData from '@/data/projects.json'
import skillsData from '@/data/skills.json'
import educationData from '@/data/education.json'
import experiencesData from '@/data/experiences.json'
import BlogNavButton from "@/components/BlogNavButton"

export default function Portfolio() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="container mx-auto px-4 md:px-12 lg:px-24 py-6 md:py-10">
            {/* Navigation component is now shared via BlogNavButton */}
            <BlogNavButton />

            <div className="flex flex-col md:flex-row gap-12">
                {/* Left Sidebar */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-full md:w-[30%] p-4 md:p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg text-center self-start md:sticky top-4 mb-6 md:mb-0"
                >
                    <div className="relative group mx-auto w-24 h-24 md:w-32 md:h-32 overflow-hidden animate-float">
                        <Image
                            src="/img/photo.jpg"
                            width={150}
                            height={150}
                            alt="Profile Photo"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-4 border-4 border-gray-300 dark:border-gray-600 transition-transform duration-500 transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/40 to-purple-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <h1 className="text-3xl font-semibold mb-2 text-gradient animate-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500">
                        GrayCat
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Full Stack Developer<br />FRC8585 Young Mentor
                    </p>
                    
                    <div className="flex justify-center gap-6 my-4">
                        <a href="https://github.com/linecat0305" target="_blank" rel="noopener noreferrer" className="group">
                            <FaGithub className="text-xl text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transform transition-transform group-hover:scale-125" />
                        </a>
                        <a href="https://linkedin.com/in/fuckme" target="_blank" rel="noopener noreferrer" className="group">
                            <FaLinkedin className="text-xl text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transform transition-transform group-hover:scale-125" />
                        </a>
                        <a href="mailto:me@graycat.me" className="group">
                            <FaEnvelope className="text-xl text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transform transition-transform group-hover:scale-125" />
                        </a>
                    </div>
                    
                    <div className="mt-6 text-left">
                        <div className="flex items-center gap-2 my-2">
                            <FaCode className="text-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300">全端開發</span>
                        </div>
                        <div className="flex items-center gap-2 my-2">
                            <FaLaptopCode className="text-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300">網頁設計/機器人程式設計</span>
                        </div>
                        <div className="flex items-center gap-2 my-2">
                            <FaGraduationCap className="text-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300">大安高工休學/新北非學資訊</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Content */}
                <div className="w-full md:w-[70%] space-y-6 md:space-y-8">
                    {/* About Me Section */}
                    <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="flex items-center mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 mr-3"></div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                關於我
                            </h2>
                        </div>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4"
                        >
                            你好！我是灰毛GrayCat，一名充滿熱情的全端開發者與機器人程式設計師。我擅長使用 Next.js、React 和 Express.js 開發現代化網頁應用程式，同時也具備豐富的程式開發經驗。
                        </motion.p>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-gray-600 dark:text-gray-300 leading-relaxed"
                        >
                            我相信學習新技術的目的是為了解決實際問題並創造價值。在休學期間，我積極參與各種開源項目和社群計畫，希望通過實踐來不斷提升自己的技術水準。
                        </motion.p>
                    </section>

                    {/* Experience Section */}
                    <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 mr-3"></div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                工作經驗
                            </h2>
                        </div>
                        <div className="space-y-8">
                            {experiencesData.experiences.map((experience) => (
                                <motion.div
                                    key={experience.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: experience.id * 0.1 }}
                                    className="relative pl-8 border-l-2 border-blue-400"
                                >
                                    <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-md"></div>
                                    <div className="mb-1 flex flex-col sm:flex-row sm:justify-between">
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-0">
                                            {experience.role}
                                        </h3>
                                        <span className="text-sm bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-blue-800 dark:text-blue-100 self-start">
                                            {experience.period}
                                        </span>
                                    </div>
                                    <h4 className="text-md text-blue-600 dark:text-blue-300 mb-2">
                                        {experience.company}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                                        {experience.description}
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-2 space-y-1">
                                        {experience.achievements.map((achievement, index) => (
                                            <li key={index} className="text-sm md:text-base">{achievement}</li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Education Section */}
                    <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 mr-3"></div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                教育背景
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {educationData.education.map((edu) => (
                                <motion.div
                                    key={edu.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: edu.id * 0.1 }}
                                    className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md"
                                >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                                {edu.institution}
                                            </h3>
                                            <p className="text-blue-600 dark:text-blue-300">{edu.degree}</p>
                                        </div>
                                        <span className="text-sm bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-blue-800 dark:text-blue-100 mt-1 sm:mt-0 self-start">
                                            {edu.period}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        {edu.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Certificates Section */}
                    <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 mr-3"></div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                證書
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {educationData.certificates.map((cert) => (
                                <motion.div
                                    key={cert.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: cert.id * 0.1 }}
                                    className="flex bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md items-center group hover:shadow-lg transition-shadow"
                                >
                                    <div className="mr-4">
                                        <FaCertificate className="text-3xl text-blue-500 group-hover:text-purple-500 transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                                            {cert.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {cert.issuer} • {cert.date}
                                        </p>
                                        <a 
                                            href={cert.credentialLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                                        >
                                            查看證書
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Skills Section */}
                    <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 mr-3"></div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                技能
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {skillsData.skills.map((skill) => (
                                <motion.div
                                    key={skill.id}
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "100%" }}
                                    transition={{ duration: 0.5, delay: skill.id * 0.05 }}
                                    className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
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
                        <div className="flex items-center mb-6">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 mr-3"></div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                專案
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {projectsData.projects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: project.id * 0.2, ease: "easeOut" }}
                                    className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-blue-500"
                                >
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                                        {project.description}
                                    </p>
                                    <a 
                                        href={project.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="link-hover text-blue-500 inline-block mb-3 group"
                                    >
                                        查看此專案 <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                                    </a>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {project.technologies.map((tech, index) => (
                                            <span 
                                                key={index} 
                                                className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-100 dark:bg-blue-900 text-xs sm:text-sm rounded-full text-blue-800 dark:text-blue-100"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 mr-3"></div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                聯絡我
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            如果你對我的經歷感興趣，或希望和我有進一步的合作關係，歡迎透過以下方式聯絡我：
                        </p>
                        <div className="flex flex-wrap gap-4 mt-6">
                            <a 
                                href="mailto:me@graycat.me" 
                                className="flex items-center gap-2 bg-white dark:bg-gray-700 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <FaEnvelope className="text-blue-500 group-hover:text-purple-500 transition-colors" />
                                <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base truncate max-w-[200px] md:max-w-none">me@graycat.me</span>
                            </a>
                            <a 
                                href="https://github.com/linecat0305" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 bg-white dark:bg-gray-700 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <FaGithub className="text-blue-500 group-hover:text-purple-500 transition-colors" />
                                <span className="text-gray-700 dark:text-gray-300">GitHub</span>
                            </a>
                            <a 
                                href="https://linkedin.com/in/fuckme"
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 bg-white dark:bg-gray-700 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <FaLinkedin className="text-blue-500 group-hover:text-purple-500 transition-colors" />
                                <span className="text-gray-700 dark:text-gray-300">LinkedIn</span>
                            </a>
                        </div>
                    </section>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="mt-20 py-8 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        © {new Date().getFullYear()} GrayCat. All rights reserved.
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                        Built with Next.js, TailwindCSS, and Framer Motion
                    </p>
                </div>
            </footer>
        </div>
    )
}