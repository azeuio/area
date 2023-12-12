import React from 'react';

interface ServiceCardProps {
    serviceCardStyle: string;
    name: string;
    logo: string;
    onClick?: () => void;
}

class ServiceCard extends React.Component<ServiceCardProps> {
    render() {
      return (
        <div className={`rounded-[20px] ${this.props.serviceCardStyle} font-SpaceGrotesk  px-9 py-2 hover:scale-105 active:scale-100 cursor-pointer`} onClick={this.props.onClick}>
            <div className="py-8 flex items-center space-x-4 text-5xl">
                <img className='max-w-6 max-y-6' src={this.props.logo} alt={this.props.name} />
                <div className='w-52 text-left'>{this.props.name}</div>
            </div>
        </div>
      );
    }
}

export default ServiceCard;
