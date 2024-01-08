import React from 'react';
import Marquee from 'react-fast-marquee';
import { ReactComponent as BrickButtonSVG } from '../assets/brick_button.svg';
import './BrickButton.css';

interface BrickButtonProps {
  onClick?: () => void;
  text: string;
  color: string;
  logo?: string;
}

const BrickButton: React.FC<BrickButtonProps> = ({
  onClick,
  text,
  color,
  logo,
}) => {
  const spaces = '\u00A0'.repeat(5);

  return (
    <div className="brick-button-container">
      <div
        className="relative"
        style={{
          width: 315,
          height: 75,
        }}
      >
        <BrickButtonSVG
          onClick={onClick}
          className="absolute cursor-pointer"
          fill={color}
        />
        <div className="w-3/5">
          <Marquee
            className="top-7 left-5 font-SpaceGrotesk text-xxl"
            play={text.length > 14}
            direction="left"
          >
            {text + spaces}
          </Marquee>
        </div>
        <div
          className="absolute
        top-5
        left-60
        w-10
        h-10
        rounded-full
        bg-white"
        >
          <img className="w-10 h-10 rounded-full" src={logo} alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default BrickButton;
