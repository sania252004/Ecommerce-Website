import mensCollection from '../../assets/rabbit-assets-main/assets/mens-collection.webp';
import womensCollection from '../../assets/rabbit-assets-main/assets/womens-collection.webp';
import React from 'react';
import { Link } from 'react-router-dom';

const GenderCollection = () => {
  return (
    <section className='py-16 px-4 md:px-8 lg:px-16'>
        <div className='container mx-auto flex flex-col md:flex-row gap-8'>
            {/* Women's Collection */}
            <div className='relative flex-1'>
                <img src={womensCollection} 
                alt="Women's Collection" 
                className='w-full h-[700px] object-cover' />
                <div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4'> 
                    <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                        Women's Collection
                    </h2>
                    <Link to="/collections/all?gender=women" 
                    className='text-sm font-medium text-gray-800 hover:underline'>
                        Shop Now
                    </Link>
                </div>
            </div>
            {/* Men's Collection */}
            <div className='relative flex-1'>
                <img src={mensCollection} 
                alt="Men's Collection" 
                className='w-full h-[700px] object-cover' />
                <div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4'> 
                    <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                        Men's Collection
                    </h2>
                    <Link to="/collections/all?gender=men" 
                    className='text-sm font-medium text-gray-800 hover:underline'>
                        Shop Now
                    </Link>
                </div>
            </div>
        </div>
    </section>
  )
}

export default GenderCollection 