import React from 'react';
import { useNavigate } from "react-router-dom";

import GetStartedNavbar from '../Components/GetStartedNavbar';
import LogoButton from '../Components/LogoButton';
import TextInput from '../Components/TextInput';

import area_logo from '../assets/area_logo.svg';
import google_logo from '../assets/google_logo.svg';
import github_logo from '../assets/github_logo.svg';
import CTA from '../Components/CTA';
import Modal from '../Components/Modal';

import { getAuth, GoogleAuthProvider, GithubAuthProvider, browserPopupRedirectResolver, signInWithPopup, signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";

function Register() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalText, setModalText] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [navigateDestination, setNavigateDestination] = React.useState('');
    const [username, setUsername] = React.useState('');

    const handleRegistration = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8080/auth/register', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                email: email,
                password: password,
                }),
            });

            await response.text();
            if (response.status !== 201) {
                setIsModalOpen(true);
                setNavigateDestination("/register");
                setModalText("Error when creating your account, please verify your informations.");
                return;
            }

            const auth = getAuth();
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                sendEmailVerification(user)
                .then(() => {
                    // Success case
                    setIsModalOpen(true);
                    setModalText("Account created ! Please check your email to confirm your account.");
                    setNavigateDestination("/login");
                    signOut(auth);
                })
                .catch((error) => {
                    // Handle email verification error
                    console.error("Email verification error:", error);
                    setNavigateDestination("/register");
                    setIsModalOpen(true);
                    setModalText("Error sending email verification. Please try again.");
                });
            })
            .catch((error) => {
                // Handle sign-in errors
                console.error("Sign-in error:", error);
                setNavigateDestination("/register");
                setIsModalOpen(true);
                setModalText("Error when creating your account, please verify your informations.");
            });
        } catch (error: any) {
            console.log(error.code + " " + error.message);
            setIsModalOpen(true);
            setNavigateDestination("/register");
            setModalText("An error occured, please try again later.");
        }
    };

    const handleGoogleRegistration = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);

            const userToken = await getAuth().currentUser?.getIdToken();

            if (userToken === undefined) {
                setIsModalOpen(true);
                setNavigateDestination("/register");
                setModalText("Google Sign-In failed. Please try again later.");
                return;
            }

            const response = await fetch('http://127.0.0.1:8080/auth/create-user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + userToken,
                },
                body: JSON.stringify({
                    username: result.user.displayName,
                }),
            });

            if (await response.text() !== "OK") {
                setIsModalOpen(true);
                setNavigateDestination("/register");
                setModalText("Google Sign-In failed. Please try again later.");
                return;
            }

            navigate("/boards");
        } catch (error: any) {
            console.log(error.code + " " + error.message);
            setIsModalOpen(true);
            setNavigateDestination("/register");
            setModalText("Google Sign-In failed. Please try again later.");
        }
    };


    const handleGithubRegistration = async () => {
        try {
            const auth = getAuth();
            const provider = new GithubAuthProvider();
            const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);

            const userToken = await getAuth().currentUser?.getIdToken();

            if (userToken === undefined) {
                setIsModalOpen(true);
                setNavigateDestination("/register");
                setModalText("Github Sign-In failed. Please try again later.");
                return;
            }

            const response = await fetch('http://127.0.0.1:8080/auth/create-user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + userToken,
                },
                body: JSON.stringify({
                    username: result.user.displayName,
                }),
            });

            if (await response.text() !== "OK") {
                setIsModalOpen(true);
                setNavigateDestination("/register");
                setModalText("Github Sign-In failed. Please try again later.");
                return;
            }

            navigate("/boards");
        } catch (error: any) {
            console.log(error.code + " " + error.message);
            setIsModalOpen(true);
            setNavigateDestination("/register");
            setModalText("Github Sign-In failed. Please try again later.");
        }
    }

    return (
        <div className='h-screen flex flex-col'>
            <GetStartedNavbar logo={area_logo} logoLink='/' loginLink='/login' exploreLink='/explore' buttonOnClick={() => {navigate("/register")}}/>
            <div className="flex flex-col items-center flex-grow justify-center">
                <div className='space-y-8 flex flex-col items-center justify-center'>
                    <p className="text-center text-7xl font-SpaceGrotesk">Register</p>
                    <div className='space-y-7'>
                        <TextInput placeholder="email" textInputStyle="bg-[#00000] border-[#D9D9D9] text-[#8E8E93] focus:border-[#34A853]" onChange={(event) => {setEmail(event.target.value)}}/>
                        <TextInput placeholder="username" textInputStyle="bg-[#00000] border-[#D9D9D9] text-[#8E8E93] focus:border-[#34A853]" onChange={(event) => {setUsername(event.target.value)}}/>
                        <TextInput placeholder="password" isPassword={true} textInputStyle="bg-[#00000] border-[#D9D9D9] text-[#8E8E93] focus:border-[#34A853]" onChange={(event) => {setPassword(event.target.value)}}/>
                    </div>
                    <CTA buttonText='Get Started' buttonStyle='bg-[#34A853] text-white text-5xl px-14' onClick={handleRegistration}/>
                </div>
                <p className='text-center text-3xl font-SpaceGrotesk py-6'>Or</p>
                <div className='space-x-12 flex flex-row items-center justify-center text-center'>
                    <LogoButton buttonLogo={google_logo} buttonStyle='bg-[#D9D9D9]' onClick={handleGoogleRegistration}/>
                    <LogoButton buttonLogo={github_logo} buttonStyle='bg-[#D9D9D9]' onClick={handleGithubRegistration}/>    
                </div>
                <p className='text-center text-3xl font-SpaceGrotesk py-6'>
                    Already have an account ?
                    <a href='/login' className='px-3 hover:underline'>Log in</a>
                </p>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false); navigate(navigateDestination)}} children={<p>{modalText}</p>}/>
        </div>
    );
}

export default Register;
