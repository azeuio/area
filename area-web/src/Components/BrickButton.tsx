import React from 'react';
import Marquee from "react-fast-marquee";
import { ReactComponent as BrickButtonSVG } from '../assets/brick_button.svg';
import './BrickButton.css';

interface BrickButtonProps {
  onClick: () => void;
  text: string;
  color: string;
  logo?: string;
}

const BrickButton: React.FC<BrickButtonProps> = ({ onClick, text, color, logo }) => {
  const spaces = '\u00A0'.repeat(5);

  return (
    <div
    className="brick-button-container"
    >
      <div
      className="relative"
      style={
        {
          width: 200,
          height: 75,
        }
      }
      >
        <BrickButtonSVG
        onClick={onClick}
        className='absolute cursor-pointer'
        fill={color}
        />
        <Marquee
        className="top-5 left-5 font-SpaceGrotesk text-xxl"
        play={text.length > 17}
        direction='left'
        delay={2}
        >
          {text + spaces}
        </Marquee>
        <div
        className="absolute
        top-5
        left-60
        w-10
        h-10
        rounded-full
        bg-white"
        >
          <img
          className="w-10 h-10 rounded-full"
          src={logo}
          alt="logo"
          />
        </div>
      </div>
    </div>
  );
};

export default BrickButton;
