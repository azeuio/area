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

import { getAuth, signInWithEmailAndPassword, signOut, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, browserPopupRedirectResolver, getAdditionalUserInfo } from "firebase/auth";

function Login() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalText, setModalText] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSignIn = async () => {
        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                if (user.emailVerified === false) {
                    setModalText("Please verify your email before signing in.");
                    setIsModalOpen(true);
                    signOut(auth);
                    return;
                }
                navigate('/boards');
            })
            .catch((error) => {
                setModalText("Error while signing in, please verify your informations.");
                setIsModalOpen(true);
            });
    }

    const handleGoogleSignIn = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        await signInWithPopup(auth, provider, browserPopupRedirectResolver)
            .then(async (result) => {
                const isFirstLogin = getAdditionalUserInfo(result)?.isNewUser

                if (isFirstLogin) {
                    const userToken = await getAuth().currentUser?.getIdToken();

                    if (userToken === undefined) {
                        setIsModalOpen(true);
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
                        setModalText("Google Sign-In failed. Please try again later.");
                        return;
                    }
                }
                navigate('/boards');
            })
            .catch((error) => {
                setModalText("Error while signing in with Google, please try again later.");
                setIsModalOpen(true);
            });
    }

    const handleGithubSignIn = async () => {
        const auth = getAuth();
        const provider = new GithubAuthProvider();

        await signInWithPopup(auth, provider, browserPopupRedirectResolver)
            .then(async (result) => {
                const isFirstLogin = getAdditionalUserInfo(result)?.isNewUser

                if (isFirstLogin) {
                    const userToken = await getAuth().currentUser?.getIdToken();

                    if (userToken === undefined) {
                        setIsModalOpen(true);
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
                        setModalText("Google Sign-In failed. Please try again later.");
                        return;
                    }
                }
                navigate('/boards');
            })
            .catch((error) => {
                setModalText("Error while signing in with Github, please try again later.");
                setIsModalOpen(true);
            });
    }

    return (
        <div className='h-screen flex flex-col'>
            <GetStartedNavbar logo={area_logo} logoLink='/' loginLink='/login' exploreLink='/explore' buttonOnClick={() => {navigate("/register")}}/>
            <div className="flex flex-col items-center flex-grow justify-center">
                <div className='flex flex-col items-center justify-center'>
                    <p className="text-center text-7xl font-SpaceGrotesk py-8">Login</p>
                    <div className='space-y-7'>
                        <TextInput placeholder="email" textInputStyle="bg-[#00000] border-[#D9D9D9] text-[#8E8E93] focus:border-[#34A853]" onChange={(event) => {setEmail(event.target.value)}}/>
                        <TextInput placeholder="password" isPassword={true} textInputStyle="bg-[#00000] border-[#D9D9D9] text-[#8E8E93] focus:border-[#34A853]" onChange={(event) => {setPassword(event.target.value)}}/>
                    </div>
                    <div className='flex flex-row-reverse w-full pb-6'>
                        <a href='/forgot-password' className='text-xl font-SpaceGrotesk hover:underline'>Forgot password ?</a>
                    </div>
                    <CTA buttonText='Login' buttonStyle='bg-[#34A853] text-white text-5xl px-16' onClick={handleSignIn}/>
                </div>
                <p className='text-center text-3xl font-SpaceGrotesk py-6'>Or</p>
                <div className='space-x-12 flex flex-row items-center justify-center text-center'>
                    <LogoButton buttonLogo={google_logo} buttonStyle='bg-[#D9D9D9]' onClick={handleGoogleSignIn}/>
                    <LogoButton buttonLogo={github_logo} buttonStyle='bg-[#D9D9D9]' onClick={handleGithubSignIn}/>    
                </div>
                <p className='text-center text-3xl font-SpaceGrotesk py-6'>
                    Don't have an account ?
                    <a href='/register' className='px-3 hover:underline'>Register</a>
                </p>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}} children={<p>{modalText}</p>}/>
        </div>
    );
}

export default Login;
