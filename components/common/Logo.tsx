/* eslint-disable @next/next/no-img-element */
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="absolute top-4 left-4 z-10">
      <img src="/asserts/svg/logo.svg" alt="Logo" className='w-[64px] h-[48px]' />
    </div>
  );
};

export default Logo;