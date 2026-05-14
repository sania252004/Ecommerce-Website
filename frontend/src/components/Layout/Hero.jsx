import React from 'react'
import heroImg from '../../assets/rabbit-assets-main/assets/rabbit-hero.webp';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className='relative'>
      <img src={heroImg} alt="Rabbit" className='w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover' />
      <div className='absolute inset-0 bg-opacity-5 bg-black flex items-center justify-center'>
        <div className='text-center text-white p-6'>
          <h1 className='text-4xl md:text-9xl lg:text-12xl font-bold tracking-tighter uppercase mb-4'>
            Vacation <br/> Ready
          </h1>
          <p className='text-xs tracking-tighter md:text-xl lg:text-2xl mb-6'>Explore our collection of adorable rabbits with fast world wide shipping</p>
          <Link to ="#" className='bg-white text-black px-6 py-3 text-lg font-semibold hover:bg-gray-200 transition'>Shop Now</Link>
        </div>
      </div>
    </section>
  )
}

export default Hero 