import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../GlobalContext';
import BoardCard from '../Components/BoardCard';
import add_icon from '../assets/add_icon.svg';
import Badge from '../Components/Badge';

function Boards() {
  const navigate = useNavigate();
  const { getUser, backendUrl } = useContext(GlobalContext);
  const [boards, setBoards] = useState<any[]>([]);

  useEffect(() => {
    getUser().then((user) => {
      if (!user) {
        navigate('/login');
      }
    });
  }, [getUser, navigate]);

  useEffect(() => {
    const getBoards = async () => {
      try {
        const userToken = await getUser()?.then((user) => {
          return user?.getIdToken();
        });

        const response = await fetch(`${backendUrl}/boards`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        const json = await response.json();
        setBoards(Object.entries(json));
      } catch (error) {
        console.log(error);
      }
    };
    getBoards();
  }, [getUser, backendUrl]);

  const style = {
    container: `flex flex-col items-center`,
    title: `text-5xl font-SpaceGrotesk font-bold text-center pt-20 username-margin`,
    boardGrid: 'flex flex-wrap justify-center',
    addIcon: 'fixed bottom-4 right-4',
  };

  const renderBoardGrid = () => {
    return (
      <div className={style.boardGrid}>
        {boards.map((board) => (
          <div key={board[0]}>
            <BoardCard
              title={board[1].name}
              description={board[1].description}
              backgroundColor={board[1].color}
              onClick={() => navigate(`${board[1].id}`)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={style.container}>
      <p className={style.title}>My boards</p>
      {renderBoardGrid()}
      <Badge bgColor="white" borderColor="gray-700">
        <a href={'/add-board'} className="material-symbols-outlined scale-150 ">
          add
        </a>
      </Badge>
    </div>
  );
}

export default Boards;
