import React from 'react'
import { IoLogoInstagram } from 'react-icons/io5'
import { RiTwitterXLine } from 'react-icons/ri'
import { TbBrandMeta } from 'react-icons/tb'
import { FiPhoneCall } from 'react-icons/fi'
const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white w-full overflow-x-hidden">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-24 gap-y-12">

          {/* Newsletter */}
          <div className="max-w-sm">
            <h3 className="text-sm font-semibold uppercase mb-6">
              Newsletter
            </h3>

            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Be the first to know about new arrivals, special offers and upcoming events.
            </p>

            <p className="text-sm text-gray-300 mb-6 font-extrabold leading-relaxed">
              Signup to get 10% off on your first order!
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 text-black text-sm mb-6 focus:outline-none"
            />

            <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 text-sm">
              Subscribe
            </button>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase mb-6">
              Shop
            </h3>

            <ul className="space-y-4 text-sm text-gray-300">
              <li>Men</li>
              <li>Women</li>
              <li>Top Wear</li>
              <li>Bottom Wear</li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest mb-6">
              Customer Service
            </h3>

            <ul className="space-y-4 text-sm text-gray-300">
              {["Contact Us", "FAQs", "Shipping Policy", "Returns & Exchanges"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="relative inline-block
                        after:absolute after:left-0 after:-bottom-1
                        after:h-[1px] after:w-0 after:bg-white
                        hover:after:w-full after:transition-all after:duration-300"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-sm font-semibold uppercase mb-6">
              Follow Us
            </h3>

            <div className="flex items-center space-x-4 mb-6">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <TbBrandMeta className="h-6 w-6" />
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <IoLogoInstagram className="h-6 w-6" />
              </a>

              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <RiTwitterXLine className="h-5 w-6" />
              </a>
            </div>
            <p className="text-gray-200 mb-1">Call Us</p>
            <p className="text-sm">
              <FiPhoneCall className="inline-block mr-2" />
              +91 234 567 8901
            </p>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <p className="text-center text-sm text-black">
            © {new Date().getFullYear()} Rabbit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
export default Footer 
