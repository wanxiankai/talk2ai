'use client';
import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Typist from 'react-typist-component';

const phrases = ['Free To Use', 'Open Source', 'Chat with AI'];

const TypingCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        autoplay: true,
        autoplaySpeed: 2000,
        nextArrow: <></>,
        prevArrow: <></>,
        beforeChange: (oldIndex: number, newIndex: number) => {
            setCurrentIndex(newIndex);
        },
    };

    return (
        <div className="text-[#F78C2A] text-5xl font-bold mt-4">
            <Slider {...settings}>
                {phrases.map((phrase, index) => {
                return (
                    <div key={index} className="flex items-center">
                        {currentIndex === index && (
                            <Typist cursor={'●'} hideCursorWhenDone={true} >
                                {phrase}
                            </Typist>
                        )}
                    </div>
                );
            })}
            </Slider>
        </div>
    );
};

export default TypingCarousel;