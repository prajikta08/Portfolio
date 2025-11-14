import React from "react"
import { myProjects } from "../constants"
import { Marque } from "../components/Marque"

const Projects = () => {
  return (
    <section id="Project" className="relative projects-spacing ">
      <h2 className="text-heading c-space">My Projects</h2>
      <div className="bg-gradient-to-r from-transparent via-yellow-200 to-transparent h-[2px] w-full mt-12"></div>

      <Marque pauseOnHover className="mt-10">
  {myProjects.map((project) => (
    <a
      href={project.href}
      key={project.id}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div
        className="bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-4 w-[350px] h-[250px] 
        flex flex-col justify-between hover:scale-105 transition-transform duration-300 cursor-pointer"
      >
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-32 object-cover rounded-lg"
        />

        <h3 className="font-semibold text-lg mt-3">{project.title}</h3>
        <p className="text-sm opacity-80 line-clamp-2">{project.description}</p>
      </div>
    </a>
  ))}
</Marque>

    </section>
  )
}

export default Projects
