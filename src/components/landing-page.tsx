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
      {/* Section 1 */}
      <section className="min-h-screen px-6 sm:px-6 py-16 flex items-center justify-center">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-16 md:gap-16">
          {/* Left Content */}
          <div className="space-y-8 text-center md:text-left">
            {/* Banner */}
            <div className="flex justify-center">
              <div className="text-sm px-4 py-2 rounded-xl inline-flex flex-col sm:flex-row items-center gap-2 shadow-sm text-center sm:text-left">
                <span>We’re happy to announce that we released it today!</span>
                <a
                  href="#"
                  className="inline-flex items-center text-blue-800 underline hover:text-blue-900"
                >
                  Get started <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl text-center font-bold  text-gray-900 leading-tight">
              Simplify API Validation <br className="hidden sm:block" /> for
              Developers
            </h1>
            {/* Description */}
            <p className="text-gray-600  text-base  max-w-md ml-20 text-center ">
              We are build a testing API platform that make it easy to test your
              API. Now we will provide best solution for your development. it
              very faster and good for testing APIs.
            </p>
            {/* Buttons */}
            <div className="flex flex-col lg:justify-start sm:flex-row gap-4 justify-center items-center sm:text-lg mx-auto lg:ml-20 lg:text-left">
              <Link href={"/login"}>
                <button className="bg-black text-white px-6 py-3 rounded-md text-sm hover:bg-gray-800 transition shadow">
                  Get Started
                </button>
              </Link>
              <button className="border border-gray-300 px-6 py-3 rounded-md text-sm hover:bg-gray-100 transition flex items-center gap-2">
                <FaGithub className="w-4 h-4" />
                GitHub
              </button>
            </div>
          </div>
          {/* Right Image */}
          <div className="flex justify-center items-center">
            <Image
              src={heroImage}
              alt="Hero Astronaut"
              width={400}
              height={400}
              className="max-w-[270px] sm:max-w-[300px] md:max-w-[300px]"
              priority
            />
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="relative flex flex-col sm:flex-row py-10 sm:ps-14">
        <div className="relative z-10 mb-10 sm:mb-0 w-full sm:w-auto px-4 sm:px-0 sm:ms-10">
          <Image
            src={Image1}
            alt="Image 1"
            className="rounded-xl shadow-lg"
            width={1000}
            height={800}
          />
        </div>

        {/* Image 2 - Overlapping only on desktop/tablet */}
        <div className="sm:absolute sm:left-[30%] sm:top-[40%] z-11 w-full sm:w-auto px-4 sm:px-0 pr-6 sm:pr-0">
          <Image
            src={Image2}
            alt="Image 2"
            className="rounded-xl shadow-xl border-4 border-white mx-auto sm:mx-0"
            width={1000}
            height={800}
          />
        </div>
      </section>

      {/* Section 3 */}
      <section className="text-center mt-20 sm:mt-32 md:mt-48 px-4">
        <div className="inline-block border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 mb-3">
          Lasted updated: 7 May 2025
        </div>
        {/* Description */}
        <p className="text-gray-700 mb-6">
          Build with industry-standard tools and best practices
        </p>
        {/* Tech Stack Icons */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-800">
          {/* Next.js */}
          <div className="flex items-center space-x-2">
            <RiNextjsFill />
            <span>
              NextJS <strong>15.3.2</strong>
            </span>
          </div>

          {/* TypeScript */}
          <div className="flex items-center space-x-2">
            <BiLogoTypescript className="text-blue-500" />
            <span>
              TypeScript <strong>5.4</strong>
            </span>
          </div>

          {/* Spring Boot */}
          <div className="flex items-center space-x-2">
            {/* <img src="/icons/spring.svg" alt="Spring Boot" className="h-6 w-6" /> */}
            <BiLogoSpringBoot className="text-green-600" />
            <span>
              Spring boot <strong>3.4.5</strong>
            </span>
          </div>

          {/* Tailwind */}
          <div className="flex items-center space-x-2">
            <RiTailwindCssFill className="text-blue-800" />
            <span>
              tailwind <strong>4.1.7</strong>
            </span>
          </div>

          {/* Shadcn */}
          <div className="flex items-center space-x-2">
            <SiShadcnui />
            <span>
              Shadcn <strong>2.5.0</strong>
            </span>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center">
          <div className="text-center max-w-7xl ">
            <h1 className="text-4xl font-bold mb-8">We&apos;re provide :</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="p-6 bg-white shadow rounded-lg grid gap-4 text-left">
                <div>
                  <FaCode className="h-18 w-18 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold">API Testing</h2>
                <p className="text-gray-600">
                  Validate your API endpoints easily with build-in and custom
                  test cases to ensure reliability.
                </p>
              </div>
              {/* Card 2 */}
              <div className="p-6 bg-white shadow rounded-lg grid grid-rows-[auto_auto_1fr] gap-4 text-left">
                <div>
                  <Monitor className="h-18 w-18 text-red-600" />
                </div>
                <h2 className="text-xl font-bold">Real-time Monitoring</h2>
                <p className="text-gray-600">
                  Track APi performance, errors , and usage live. Instantly
                  identify issues and understand traffic patterns.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 bg-white shadow rounded-lg grid grid-rows-[auto_auto_1fr] gap-4 text-left">
                <div>
                  <History className="h-18 w-18 text-green-600" />
                </div>
                <h2 className="text-xl font-bold">View History</h2>
                <p className="text-gray-600">
                  Access detailed logs og past API requests and responses.
                  Easily debug issues and audit activity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section className="w-full bg-white py-8 md:py-16 space-y-30 ">
        <br />
        <br />
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold">It helps you more</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            TestPilot is very special for you
          </p>
        </div>
        <div className="container mx-auto px-4 mt-6 md:mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Column */}
            <div className="flex flex-col items-center justify-center space-y-4 sm:px-6 text-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 sm:ps-8">
                TestPilot for API testing offers several key advantages.
              </h1>
              <p className="text-gray-700 text-sm md:text-base sm:ps-14 max-w-md text-center">
                It provides more than what you see. It helps developers easily
                find better solutions than ever before.
              </p>
              <Image
                src={Image3}
                alt="Hero Astronaut"
                className="w-full max-w-[350px] h-auto rounded-lg sm:max-w-[200px] md:max-w-[300px] "
                width={500}
                height={600}
              />
            </div>

            {/* Cards Column */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm hover:shadow hover:bg-gray-100 transition-shadow">
                <div>
                  <BadgeCheck
                    className="w-12 h-12 md:w-14 md:h-14 text-purple-600"
                    strokeWidth={1}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">
                    Smart Field Validation
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Automatically validates data types such as 'Is Null', 'Is
                    Email', 'Is Undefined, etc. You can test your APIs with
                    TestPilot to ensure they are implemented correctly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm hover:shadow hover:bg-gray-100 transition-shadow">
                <div>
                  <FileText
                    className="w-12 h-12 md:w-14 md:h-14 text-orange-400"
                    strokeWidth={1}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">
                    Test Case Templates
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Quickly generate reusable test scenarios for common endpoint
                    patterns like Create / Read / Update / Delete.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm hover:shadow hover:bg-gray-100 transition-shadow">
                <div>
                  <ClipboardCheck
                    className="w-12 h-12 md:w-14 md:h-14 text-green-500"
                    strokeWidth={1}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">
                    Detailed Validation Reports
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Export test results with clear pass/fail summaries and error
                    messages. Ideal for QA teams and stakeholders.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm hover:shadow hover:bg-gray-100 transition-shadow">
                <div>
                  <Image
                    src={Image4}
                    alt="Hero Astronaut"
                    className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover "
                    width={100}
                    height={100}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">
                    User-Friendly Interface
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Clean, modern UI focused on productivity—built for testers
                    and developers to work efficiently without distractions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer of landing page */}
      <footer className="w-full bg-white px-6 pt-10 text-black">
        <div className="space-y-6 p-8">
          <div className=" items-center md:items-start gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src={Logo}
                alt="Destinize Logo"
                className="border-4 border-white rounded-xl"
                width={120}
                height={120}
              />
            </div>
            {/* Description */}
            <div className="max-w-md text-sm leading-relaxed text-gray-400 sm:text-left ">
              <p>
                Destinize adalah website atau layanan aplikasi yang membantu
                kamu memilih atau merekomendasikan tempat yang dijuluki ‘hidden
                gems’ agar lebih dikenal dan ramai.{" "}
                <strong className="text-blue-600 cursor-pointer">
                  Baca Selengkapnya
                </strong>
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-t border-gray-300" />

          {/* Bottom Section: Copyright & Icons */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4">
            <p className="text-gray-600">@Copyright 2025 TestPilot</p>
            <div className="flex items-center gap-4 text-black text-xl">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-gray-500"
              >
                <FaGithub />
              </a>
              <a
                href="https://google.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google"
                className="hover:text-gray-500"
              >
                <FaGoogle />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
