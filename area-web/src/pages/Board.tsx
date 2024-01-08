import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import GlobalContext from '../GlobalContext';
import settings_icon from '../assets/settings_icon.svg';

function Board() {
    const navigate = useNavigate();
    const { getUser, backendUrl } = useContext(GlobalContext);
    const { boardId } = useParams();
    const [board, setBoard] = useState<any>({});

    useEffect(() => {
        getUser().then((user) => {
            if (!user) {
                navigate('/login');
            }
        });
    }, [getUser, navigate]);

    useEffect(() => {
        const getBoard = async () => {
            try {
                const userToken = await getUser()?.then((user) => {
                    return user?.getIdToken();
                });
                const response = await fetch(`${backendUrl}/boards/${boardId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Board not found');
                }

                const json = await response.json();
                setBoard(json);
            } catch (error) {
                console.log(error);
                navigate('/boards');
            }
        }
        getBoard();
    }, [getUser, backendUrl, boardId, navigate]);

    const style = {
        container: 'flex items-center justify-center flex-row',
        title: 'text-5xl font-SpaceGrotesk font-bold text-center pt-20 username-margin',
        settingsIcon: 'h-10 w-10 ml-5 mt-8',
    };

    return (
        <div className={style.container}>
            <p className={style.title}>
                {board.name}
            </p>
            <a href={`/manage-board/${boardId}`}>
                <img src={settings_icon} alt="Add board" className={style.settingsIcon} />
            </a>
        </div>
    );
}

export default Board;
