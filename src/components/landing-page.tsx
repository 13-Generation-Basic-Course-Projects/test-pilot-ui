import React from "react";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileText,
  History,
  Monitor,
} from "lucide-react";
import heroImage from "../../public/hero_image.png";
import Image1 from "../../public/landing_img1.png";
import Image2 from "../../public/landing_img2.png";
import Logo from "../../public/logo.png";
import Image3 from "../../public/landing_img3.png";
import Image4 from "../../public/landing_img4.png";
import { FaCode, FaGithub, FaGoogle } from "react-icons/fa";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { SiShadcnui } from "react-icons/si";
import { BiLogoSpringBoot, BiLogoTypescript } from "react-icons/bi";
import Link from "next/link";

export default function LandingPageComponent() {
  return (
    <>
      {/* Section 1 - Hero */}
      <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 xl:py-20 2xl:py-24 flex items-center justify-center">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left">
            {/* Banner */}
            <div className="flex justify-center lg:justify-start">
              <div className="text-xs sm:text-sm md:text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 shadow-sm text-center sm:text-left bg-white/10 backdrop-blur-sm">
                <span>We're happy to announce our release today!</span>
                <a
                  href="#"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-xs sm:text-sm md:text-base transition-colors"
                >
                  Get started{" "}
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Simplify API Validation <br className="hidden sm:block" /> for
              Developers
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              Build, test, and monitor your APIs with our comprehensive platform
              designed to streamline your development workflow and ensure
              reliability.
            </p>

            {/* Buttons */}
            <div className="flex flex-col xs:flex-row gap-3 w-full xs:w-auto">
              <Link
                href="/login"
                className="w-full xs:w-auto min-w-[180px] sm:min-w-[200px]"
              >
                <button
                  className="
      bg-black hover:bg-gray-800 
      text-white 
      px-5 py-2.5 sm:px-6 sm:py-3 
      rounded-md 
      text-sm sm:text-base md:text-lg 
      transition-all 
      shadow-lg hover:shadow-xl 
      w-full
      text-center
    "
                >
                  Get Started
                </button>
              </Link>
              <button
                className="
    border border-gray-300 hover:border-gray-400 
    px-5 py-2.5 sm:px-6 sm:py-3 
    rounded-md 
    text-sm sm:text-base md:text-lg 
    transition-all 
    flex items-center justify-center gap-2 
    w-full xs:w-auto
    min-w-[180px] sm:min-w-[200px]
    hover:bg-gray-50
  "
              >
                <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
                GitHub
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center items-center order-first lg:order-last">
            <Image
              src={heroImage}
              alt="Hero Astronaut"
              width={600}
              height={600}
              className="max-w-[180px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] xl:max-w-[400px] 2xl:max-w-[450px]"
              priority
              quality={95}
            />
          </div>
        </div>
      </section>

      {/* Section 2 - Overlapping Images */}
      <section className="relative py-8 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-0">
            <div className="relative z-10 w-full max-w-4xl mx-auto">
              <Image
                src={Image1}
                alt="Dashboard screenshot"
                className="rounded-xl shadow-lg w-full"
                width={1200}
                height={800}
                quality={90}
              />
            </div>

            <div className="lg:absolute mt-5 lg:left-1/4 lg:top-1/3 z-20 w-full max-w-3xl lg:w-[65%] xl:w-[60%] mx-auto lg:mx-0  lg:mt-0 lg:-ml-8 xl:-ml-12 2xl:-ml-16">
              <Image
                src={Image2}
                alt="Features close-up"
                className="rounded-xl shadow-lg border-4 border-white w-full"
                width={1000}
                height={700}
                quality={90}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Features */}
      <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block border border-gray-300 rounded-md px-3 py-1.5 text-sm md:text-base text-gray-700 mb-4 md:mb-6">
            Last updated: 7 May 2025
          </div>

          <p className="text-gray-700 mb-8 md:mb-12 text-base md:text-lg lg:text-xl">
            Built with industry-standard tools and best practices
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8 text-sm md:text-base lg:text-lg text-gray-800 mb-12 md:mb-16 lg:mb-20">
            <div className="flex items-center space-x-2">
              <RiNextjsFill className="text-lg md:text-xl" />
              <span>
                NextJS <strong>15.3.2</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <BiLogoTypescript className="text-blue-500 text-lg md:text-xl" />
              <span>
                TypeScript <strong>5.4</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <BiLogoSpringBoot className="text-green-600 text-lg md:text-xl" />
              <span>
                Spring Boot <strong>3.4.5</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <RiTailwindCssFill className="text-blue-800 text-lg md:text-xl" />
              <span>
                Tailwind <strong>4.1.7</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <SiShadcnui className="text-lg md:text-xl" />
              <span>
                Shadcn <strong>2.5.0</strong>
              </span>
            </div>
          </div>

          {/* Features Cards */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 lg:mb-16">
              What We Provide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              <div className="p-6 sm:p-8 bg-white shadow-lg rounded-xl grid gap-4 sm:gap-6 text-left hover:shadow-xl transition-shadow">
                <FaCode className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                <h3 className="text-xl sm:text-2xl font-bold">API Testing</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Comprehensive validation with built-in and custom test cases
                  to ensure your API endpoints are reliable and performant.
                </p>
              </div>

              <div className="p-6 sm:p-8 bg-white shadow-lg rounded-xl grid gap-4 sm:gap-6 text-left hover:shadow-xl transition-shadow">
                <Monitor className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                <h3 className="text-xl sm:text-2xl font-bold">
                  Real-time Monitoring
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Live tracking of API performance metrics, error rates, and
                  usage patterns to quickly identify and resolve issues.
                </p>
              </div>

              <div className="p-6 sm:p-8 bg-white shadow-lg rounded-xl grid gap-4 sm:gap-6 text-left hover:shadow-xl transition-shadow">
                <History className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600" />
                <h3 className="text-xl sm:text-2xl font-bold">
                  Request History
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Detailed logs of all API requests and responses for debugging,
                  auditing, and performance analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Benefits */}
      <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              Why Choose TestPilot
            </h2>
            <p className="text-gray-600 text-base md:text-lg lg:text-xl max-w-3xl mx-auto">
              Designed specifically to enhance your API development workflow
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 md:gap-10 lg:gap-12 xl:gap-16">
            <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
                Comprehensive API Testing Solution
              </h3>
              <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 max-w-lg">
                TestPilot combines all the tools you need for thorough API
                validation, monitoring, and debugging in one intuitive platform.
              </p>
              <Image
                src={Image3}
                alt="Dashboard overview"
                className="rounded-xl shadow-lg w-full max-w-md"
                width={800}
                height={600}
                quality={90}
              />
            </div>

            <div className="lg:w-1/2 space-y-6 md:space-y-8">
              <div className="flex items-start gap-4 md:gap-6 p-5 sm:p-6 md:p-7 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <BadgeCheck className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0 text-green-600" />
                <div>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 md:mb-3">
                    Smart Validation
                  </h4>
                  <p className="text-gray-600 text-sm md:text-base">
                    Automatic detection of common API issues with intelligent
                    suggestions for fixes and optimizations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 md:gap-6 p-5 sm:p-6 md:p-7 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <FileText className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0 text-blue-600" />
                <div>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 md:mb-3">
                    Test Templates
                  </h4>
                  <p className="text-gray-600 text-sm md:text-base">
                    Pre-built test scenarios for common API patterns that can be
                    customized to your specific needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 md:gap-6 p-5 sm:p-6 md:p-7 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <ClipboardCheck className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0 text-orange-600" />
                <div>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 md:mb-3">
                    Detailed Reports
                  </h4>
                  <p className="text-gray-600 text-sm md:text-base">
                    Comprehensive test results with visualizations and export
                    options for sharing with your team.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 md:gap-6 p-5 sm:p-6 md:p-7 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
                  <Image
                    src={Image4}
                    alt="UI example"
                    className="rounded-lg object-cover w-full h-full"
                    width={100}
                    height={100}
                    quality={100}
                  />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 md:mb-3">
                    Intuitive Interface
                  </h4>
                  <p className="text-gray-600 text-sm md:text-base">
                    Clean, modern design that makes complex testing workflows
                    simple and accessible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-8 md:gap-12">
            <div className="lg:w-1/3">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 mb-6">
                <div className="flex-shrink-0 relative">
                  <Image
                    src={Logo}
                    alt="TestPilot Logo"
                    className="border-2 sm:border-[3px] md:border-4 border-white/90 rounded-xl drop-shadow-sm transition-all duration-300 hover:scale-105 hover:drop-shadow-md"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      objectFit: "contain",
                      objectPosition: "center",
                    }}
                    priority
                    quality={100}
                  />
                </div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base mb-6 md:mb-8">
                The complete solution for API testing, monitoring, and
                validation. Built by developers, for developers.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <FaGithub className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <FaGoogle className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:w-2/3">
              <div>
                <h4 className="text-lg font-semibold mb-4 md:mb-6">Product</h4>
                <ul className="space-y-2 md:space-y-3 text-sm sm:text-base text-gray-600">
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Releases
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 md:mb-6">Company</h4>
                <ul className="space-y-2 md:space-y-3 text-sm sm:text-base text-gray-600">
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 md:mb-6">Legal</h4>
                <ul className="space-y-2 md:space-y-3 text-sm sm:text-base text-gray-600">
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm sm:text-base text-gray-500">
              © 2025 TestPilot. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-sm sm:text-base text-gray-500 hover:text-gray-700 transition"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm sm:text-base text-gray-500 hover:text-gray-700 transition"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
