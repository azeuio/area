import React from 'react';

interface ServiceCardProps {
  serviceCardStyle?: string;
  backgroundColor?: string;
  name: string;
  logo: string;
  onClick?: () => void;
  activated?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = (props) => {
  const style = {
    container: `rounded-xl w-72 flex items-center justify-center bg-[#1DB954] ${
      props.activated ? '' : 'grayscale'
    } transition-all duration-300 hover:scale-105 aspect-video h-[18vh]`,
    content: `rounded-xl flex items-center justify-center transition-all duration-300 p-10 gap-1 sm:gap-1 md:gap-3 lg:gap-5 xl:gap-6 2xl:gap-10`,
    text: `text-white font-SpaceGrotesk text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl min-[2000px]:text-6xl min-[3500px]:text-8xl max-[500px]:text-sm`,
    iconContainer: `rounded-full bg-[#fff] w-10 h-10 z-[2] flex items-center justify-center h-full sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 min-[2000px]:w-20 min-[2000px]:h-20 min-[3500px]:w-24 min-[3500px]:h-24 max-[500px]:w-6 max-[500px]:h-6`,
  };
  return (
    <div
      className={style.container}
      style={{
        backgroundColor: props.activated ? props.backgroundColor : 'gray',
      }}
      onClick={props.onClick}
    >
      <div className={style.content}>
        <div className={style.iconContainer}>
          <Icon logo={props.logo} name={props.name} />
        </div>
        <div
          className={style.text}
          style={{ color: props.activated ? 'white' : 'darkgray' }}
        >
          {props.name}
        </div>
      </div>
    </div>
  );
};

type IconProps = {
  logo: string;
  name: string;
};
function Icon(props: IconProps) {
  return (
    <div
      className={`rounded-full bg-[#fff] p-1 lg:p-2 min-[3000px]:p-3 w-5 h-5 absolute z-[2] flex items-center justify-center sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 min-[2000px]:w-20 min-[2000px]:h-20 min-[3500px]:w-24 min-[3500px]:h-24 max-[500px]:w-6 max-[500px]:h-6`}
    >
      <img className={`z-[3]`} src={props.logo} alt={props.name} />
    </div>
  );
}

export default ServiceCard;
