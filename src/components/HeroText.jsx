import React from 'react'
import { EncryptedText } from './EncryptedText'
import { motion } from 'motion/react';
import Button from './Button';

const HeroText = () => {
  return (
    <div className='z-10 mt-20 text-center md:mt-40 md:text-left rounded-3xl bg-clip-text'>

      {/* Desktop View */}
      <div className='flex-col hidden md:flex c-space'>
        <motion.h1 className='text-7xl font-medium' initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} >Hi I'm Prajikta</motion.h1>
        <div className='flex flex-col items-start'>
          <br />
          <p className='text-4xl font-medium text-neutral-200'>- a web developer, </p>
          <p className="text-3xl text-amber-100">who loves bringing ideas to life on the internet</p>
          <p className='text-2xl font-bold mt-8 text-amber-100'>3rd Year Computer Science Student & Full Stack developer</p>
          <p className='text-xl font-extralight mt-2'>Passionate about building reliable, efficient web solutions <br />Studying Computer Science with an emphasis on modern development practices.</p>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex flex-col items-center text-center md:hidden c-space mt-10 space-y-4">

        <p className="text-3xl font-semibold">Hi I'm Prajikta</p>

        <div className="space-y-2">
          <p className="text-xl text-neutral-200">- a web developer,</p>

          <p className="text-lg text-amber-100">
            who loves bringing ideas to life on the internet
          </p>

          <p className="text-base font-medium text-amber-100">
            3rd Year Computer Science Student & Full Stack Developer
          </p>

          <p className="text-sm text-neutral-300">
            Passionate about building reliable, efficient web solutions.
          </p>
        </div>
      </div>

      <div className=' md:flex buttons-container'>
        <Button />

      </div>

    </div>

  )
}

export default HeroText
