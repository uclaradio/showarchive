"use client";

import Image from 'next/image';
import React from 'react';
import GradientBackground from '../../components/GradientBackground';

const UCLAListenPage = () => {
  return (
    <GradientBackground>
      <div className="flex flex-col lg:flex-row items-start gap-12">
        <div className="flex-shrink-0">
          <Image
            src="/ucla-radio-flyer.png"
            alt="UCLA Radio Flyer"
            width={300}
            height={300}
            className="border-2 border-white rounded-md"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-4 text-pink-400">UCLA Radio Listens to Your Music!</h1>
          <h2 className="text-2xl font-medium mb-4">Music Department</h2>
          <div className="flex gap-3 mb-4">
            <span className="bg-[#2f2a44] px-4 py-1 rounded-full text-sm font-medium">music</span>
            <span className="bg-[#2f2a44] px-4 py-1 rounded-full text-sm font-medium">chatting</span>
            <span className="bg-[#2f2a44] px-4 py-1 rounded-full text-sm font-medium">culture</span>
          </div>
          <p className="text-md leading-relaxed">
            The UCLA Radio Music Department reviews and listens to real song submissions live on-air! Come listen for
            some fresh new tunes picked out by yours truly! Send your music to{' '}
            <a href="mailto:radio.music@media.ucla.edu" className="text-blue-300 underline">
              radio.music@media.ucla.edu
            </a>{' '}for consideration.<br />
            Hosted on Tuesday from 7 to 8 PM.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-16 text-left text-xl font-medium">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="hover:text-white text-gray-300">
            Week {i + 1}
          </div>
        ))}
      </div>
    </GradientBackground>
  );
};

export default UCLAListenPage;