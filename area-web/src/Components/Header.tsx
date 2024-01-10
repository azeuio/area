import React from 'react';

interface HeaderProps {
  logo: string;
  title: string;
  description: string;
  color: string;
}
const Header = (props: HeaderProps) => {
  const headerStyle = {
    content: `rounded-xl flex items-center justify-center transition-all duration-300 p-10 gap-1 sm:gap-1 md:gap-3 lg:gap-5 xl:gap-6 2xl:gap-10 pt-24`,
    text: `text-white font-SpaceGrotesk text-sm sm:text-lg md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl`,
    iconContainer: `rounded-full bg-[#fff] flex items-center justify-center h-full sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-34 2xl:h-34`,
    description:
      'font-SpaceGrotesk text-center w-full resize-none line-clamp-1 text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl',
  };
  return (
    <div
      className="h-2/5 w-screen flex items-center justify-center sticky "
      style={{
        backgroundColor: props.color,
      }}
    >
      <div className={headerStyle.content}>
        <div className={headerStyle.iconContainer}>
          <img className={`w-3/5 h-3/5`} src={props.logo} alt={props.title} />
        </div>
        <div>
          <div className={headerStyle.text}>{props.title}</div>
          <p className={headerStyle.description + ' text-gray-300'}>
            {props.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
