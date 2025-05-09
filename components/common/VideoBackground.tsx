import React from 'react'

export default function VideoBackground() {
    return (
        <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
        >
            <source src="/asserts/video/bg_video.mp4" type="video/mp4" />
        </video>
    );
}
