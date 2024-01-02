import { getAuth } from 'firebase/auth';
import React from 'react';

interface UserNavbarProps {
  image?: string;
  imageLink?: string;
  logo: string;
  logoLink?: string;
  areasLink?: string;
  boardsLink?: string;
  isAreas?: boolean;
  isBoards?: boolean;
  style?: {
    height: string;
  };
}

class UserNavbar extends React.Component<UserNavbarProps> {
  logout = async () => {
    const auth = getAuth();
    await auth.signOut();
    localStorage.removeItem('token');
    window.location.reload();
  };
  render() {
    const height = this.props.style?.height || '10vh';
    const imageSize = 'h-[56px] w-[56px]';

    return (
      <div
        className={`py-7 pl-11 h-[${height}] flex items-center justify-between sticky top-0 z-50`}
      >
        <a href={this.props.logoLink}>
          <img src={this.props.logo} alt="Area logo" className={imageSize} />
        </a>
        <div className="pr-11 flex items-center justify-between space-x-14">
          <button
            className="text-4xl font-SpaceGrotesk hover:underline"
            onClick={this.logout}
          >
            Logout
          </button>
          <a href={this.props.boardsLink}>
            <button
              className={`text-4xl font-SpaceGrotesk hover:underline ${
                this.props.isBoards ? 'underline' : ''
              }`}
            >
              Boards
            </button>
          </a>
          <a href={this.props.areasLink}>
            <button
              className={`text-4xl font-SpaceGrotesk hover:underline  ${
                this.props.isAreas ? 'underline' : ''
              }`}
            >
              Areas
            </button>
          </a>
          <a href={this.props.imageLink}>
            <img
              src={this.props.image}
              alt="profile_logo"
              className={`${imageSize} rounded-full`}
            />
          </a>
        </div>
      </div>
    );
  }
}

export default UserNavbar;
