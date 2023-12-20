import React from "react";

interface UserNavbarProps {
  image?: string;
  imageLink?: string;
  logo: string;
  logoLink?: string;
  areasLink?: string;
  boardsLink?: string;
  isAreas?: boolean;
  isBoards?: boolean;
}

class UserNavbar extends React.Component<UserNavbarProps> {
  render() {
    return (
      <div className="py-7 pl-11 flex items-center justify-between">
        <a href={this.props.logoLink}>
          <img src={this.props.logo} alt="Area logo" />
        </a>
        <div className="pr-11 flex items-center justify-between space-x-14">
          <a href={this.props.boardsLink}>
            <button
              className={`text-4xl font-SpaceGrotesk hover:underline ${
                this.props.isBoards ? "underline" : ""
              }`}
            >
              Boards
            </button>
          </a>
          <a href={this.props.areasLink}>
            <button
              className={`text-4xl font-SpaceGrotesk hover:underline  ${
                this.props.isAreas ? "underline" : ""
              }`}
            >
              Areas
            </button>
          </a>
          <a href={this.props.imageLink}>
            <img src={this.props.image} alt="profile_logo" />
          </a>
        </div>
      </div>
    );
  }
}

export default UserNavbar;
