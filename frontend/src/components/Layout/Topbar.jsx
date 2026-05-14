import React from 'react'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io5'
import { RiTwitterXLine } from 'react-icons/ri'

function Topbar() {
  return (
    <div className="bg-rabbit-red text-white w-full">
        <div className="container mx-auto flex justify-between items-center py-2 px-4">
            <div className='hidden md:flex items-center space-x-4'>
                <a href = "#" className="hover:text-gray-300">
                  <TbBrandMeta className="h-5 w-5"/>
                </a>
                <a href = "#" className="hover:text-gray-300">
                   <IoLogoInstagram className="h-5 w-5"/>
                </a>
                <a href = "#" className="hover:text-gray-300">
                <RiTwitterXLine className="h-5 w-5"/>
                </a>
            </div>
            <div className='text-center text-sm flex-grow'> 
              <span>
                Delivering to your doorstep, worldwide! Free shipping on orders above Rs.1000 with discounts!!!
              </span>
            </div>
            <div className='text-sm hidden md:block'>
              <a href="tel:+912345678901" className="hover:text-gray-300">
                Call us: +91 234 567 8901
              </a>
            </div>
        </div>
    </div>
  )
}

export default Topbar 