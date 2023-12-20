import React from "react";
import { useNavigate } from "react-router-dom";

import GetStartedNavbar from "../Components/GetStartedNavbar";
import TextInput from "../Components/TextInput";

import area_logo from "../assets/area_logo.svg";
import CTA from "../Components/CTA";
import Modal from "../Components/Modal";

import { sendPasswordResetEmail, getAuth } from "firebase/auth";

function ForgotPassword() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalText, setModalText] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [navigateDestination, setNavigateDestination] = React.useState("");

  const handlePasswordReset = async () => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setModalText("An email has been sent to you to reset your password");
      setNavigateDestination("/login");
      setIsModalOpen(true);
    } catch (error) {
      setModalText("An error occured while sending the email");
      setNavigateDestination("/forgot-password");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <GetStartedNavbar
        logo={area_logo}
        logoLink="/"
        loginLink="/login"
        exploreLink="/explore"
        buttonOnClick={() => {
          navigate("/register");
        }}
      />
      <div className="flex flex-col items-center flex-grow justify-center">
        <div className="space-y-10 flex flex-col items-center justify-center">
          <p className="text-center text-7xl font-SpaceGrotesk">
            Forgot your password ?
          </p>
          <p className="text-center w-4/5 text-[#8E8E93] text-2xl font-SpaceGrotesk">
            Enter your email below to receive an email to reset your password
          </p>
          <TextInput
            placeholder="email"
            textInputStyle="bg-[#00000] border-[#D9D9D9] text-[#8E8E93] focus:border-[#34A853]"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <CTA
            buttonText="Send email"
            buttonStyle="bg-[#34A853] text-white text-5xl px-14"
            onClick={handlePasswordReset}
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          navigate(navigateDestination);
        }}
        children={<p>{modalText}</p>}
      />
    </div>
  );
}

export default ForgotPassword;
