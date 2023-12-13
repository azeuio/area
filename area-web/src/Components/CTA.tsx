import React from 'react';

interface CTAProps {
    buttonText: string;
    onClick?: () => void;
    buttonStyle?: string;
}

class CTA extends React.Component<CTAProps> {
    render() {
      return (
        <div>
          <button onClick={this.props.onClick} className={`rounded-[50px] ${this.props.buttonStyle} font-SpaceGrotesk text-4xl px-9 py-2 hover:scale-105 active:scale-100`}>
            {this.props.buttonText}
          </button>
        </div>
      );
    }
}

export default CTA;
