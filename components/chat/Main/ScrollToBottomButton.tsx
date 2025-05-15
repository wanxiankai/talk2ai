/* eslint-disable react/display-name */
import DownArrow from '@/components/common/DownArrow';
import React from 'react';
import { useAtBottom, useScrollToBottom } from 'react-scroll-to-bottom';

const ScrollToBottomButton = React.memo(() => {
  const scrollToBottom = useScrollToBottom();
  const [atBottom] = useAtBottom();

  return (
    <button
      className={`cursor-pointer absolute right-6 bottom-[60px] md:bottom-[60px] z-10 rounded-full border border-gray-200 bg-gray-50 text-gray-600 ${
        atBottom ? 'hidden' : ''
      }`}
      aria-label='scroll to bottom'
      onClick={scrollToBottom as any}
    >
      <DownArrow />
    </button>
  );
});

export default ScrollToBottomButton;