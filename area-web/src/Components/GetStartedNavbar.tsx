import React from 'react';
import CTA from './CTA';

interface GetStartedNavbarProps {
  buttonOnClick?: () => void;
  logo: string;
  logoLink?: string;
  exploreLink?: string;
  loginLink?: string;
  isExplore?: boolean;
  isLogin?: boolean;
  style?: {
    height: string;
  };
}

class GetStartedNavbar extends React.Component<GetStartedNavbarProps> {
  render() {
    const height = this.props.style?.height || '10vh';
    return (
      <div
        className={`py-7 pl-11 h-[${height}] flex items-center justify-between sticky top-0 z-50`}
      >
        <a href={this.props.logoLink}>
          <img src={this.props.logo} alt="Area logo" />
        </a>
        <div className="pr-11 flex items-center justify-between space-x-14">
          <a href={this.props.exploreLink}>
            <button
              className={`text-4xl font-SpaceGrotesk hover:underline ${
                this.props.isExplore ? 'underline' : ''
              }`}
            >
              Explore
            </button>
          </a>
          <a href={this.props.loginLink}>
            <button
              className={`text-4xl font-SpaceGrotesk hover:underline  ${
                this.props.isLogin ? 'underline' : ''
              }`}
            >
              Log in
            </button>
          </a>
          <CTA
            buttonText="Get started"
            buttonStyle="bg-[#D9D9D9] text-black"
            onClick={this.props.buttonOnClick}
          />
        </div>
      </div>
    );
  }
}

export default GetStartedNavbar;
