import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import GetStartedNavbar from '../Components/GetStartedNavbar';

import area_logo from '../assets/area_logo.svg';
import home_service_picture from '../assets/HomeServicePicture.svg';
import home_action_picture from '../assets/HomeActionPicture.svg';
import home_reaction_picture from '../assets/HomeReactionPicture.svg';
import home_board_picture from '../assets/HomeBoardPicture.svg';

import { getAuth, onAuthStateChanged } from "firebase/auth";

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/boards');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className='h-screen flex flex-col snap-y snap-mandatory overflow-scroll'>
            <div className='sticky top-0'>
                <GetStartedNavbar logo={area_logo} logoLink='/' loginLink='/login' exploreLink='/explore' buttonOnClick={() => {navigate("/register")}}/>
            </div>
            <div className="flex flex-col items-center flex-grow justify-center pt-20 pb-40 space-y-40">
                <div className='snap-center flex flex-col items-center justify-center w-3/4 space-y-20'>
                    <div>
                        <p className="text-center text-5xl font-SpaceGrotesk pb-3">Want to automate (almost) everything ?</p>  
                        <p className="text-center text-5xl font-SpaceGrotesk">Start by choosing between multiple services</p>
                    </div>
                    <img src={home_service_picture} alt="HomeService"/>
                </div>

                <div className='snap-center flex flex-col items-center justify-center w-3/4 space-y-20'>
                    <div>
                        <p className="text-center flex flex-col items-center justify-center text-5xl font-SpaceGrotesk h-24">Then select an action</p>
                    </div>
                    <img src={home_action_picture} alt="HomeAction"/>
                </div>

                <div className='snap-center flex flex-col items-center justify-center w-3/4 space-y-20'>
                    <div className='space-y-3'>
                        <p className="text-center text-5xl font-SpaceGrotesk">Almost there !</p>
                        <p className="text-center text-5xl font-SpaceGrotesk">Select a reaction to run when the action occurs</p>
                    </div>
                    <img src={home_reaction_picture} alt="HomeReaction"/>
                </div>

                <div className='snap-center flex flex-col items-center justify-center w-3/4 space-y-20'>
                    <div className='space-y-3'>
                        <p className="text-center text-5xl font-SpaceGrotesk">You're done !</p>
                        <p className="text-center text-5xl font-SpaceGrotesk">This reaction will run everytime the </p>
                        <p className="text-center text-5xl font-SpaceGrotesk">action happens !</p>
                    </div>
                    <img src={home_board_picture} alt="HomeBoard"/>
                </div>
            </div>
        </div>
    );
}

export default Home;
