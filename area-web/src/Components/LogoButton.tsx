import React from "react";

interface LogoButtonProps {
  buttonLogo: string;
  onClick?: () => void;
  buttonStyle?: string;
}

class LogoButton extends React.Component<LogoButtonProps> {
  render() {
    return (
      <div>
        <button
          onClick={this.props.onClick}
          className={`rounded-[10px] ${this.props.buttonStyle} font-SpaceGrotesk text-4xl p-4 hover:scale-105 active:scale-100`}
        >
          <img src={this.props.buttonLogo} alt="buttonLogo" />
        </button>
      </div>
    );
  }
}

export default LogoButton;
