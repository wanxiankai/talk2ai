/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="absolute top-4 left-4 z-10">
      <Image src='/asserts/png/t2ai.png' alt='chat logo' width={92} height={23} />
    </div>
  );
};

export default Logo;