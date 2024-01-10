import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Colorful from '@uiw/react-color-colorful';

import CTA from '../Components/CTA';
import GlobalContext from '../GlobalContext';
import TextInput from '../Components/TextInput';
import DescriptionInput from '../Components/DescriptionInput';
import Modal from '../Components/Modal';

function AddBoard() {
  const navigate = useNavigate();
  const { getUser, backendUrl } = React.useContext(GlobalContext);
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [boardColor, setBoardColor] = useState('#ffffff');
  const [isNameValid, setIsNameValid] = useState(true);

  useEffect(() => {
    getUser().then((user) => {
      if (!user) {
        navigate('/login');
      }
    });
  }, [getUser, navigate]);

  const createBoard = async () => {
    if (boardName.trim() === '') {
      setIsNameValid(false);
      return;
    }
    try {
      const userToken = await getUser()?.then((user) => {
        return user?.getIdToken();
      });

      await fetch(`${backendUrl}/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          name: boardName,
          description: boardDescription,
          color: boardColor,
        }),
      });
      navigate('/boards');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-col items-center flex-grow space-y-10">
        <p className="text-5xl font-SpaceGrotesk font-bold text-center pt-20 username-margin">
          New board
        </p>
        <TextInput
          placeholder="Board name"
          onChange={(event) => {
            setBoardName(event.target.value);
          }}
        />
        <DescriptionInput
          placeholder="Board description"
          onChange={(event) => {
            setBoardDescription(event.target.value);
          }}
        />
        <div className="flex items-center">
          <p className="font-SpaceGrotesk text-4xl text-center w-1/2">
            Board color:
          </p>
          <Colorful
            color={boardColor}
            onChange={(color) => {
              setBoardColor(color.hex);
            }}
            disableAlpha={true}
          />
        </div>
        <CTA
          buttonText="Create"
          buttonStyle="bg-[#34A853] text-white text-2xl px-16"
          onClick={() => {
            createBoard();
          }}
        />
      </div>
      <Modal
        isOpen={!isNameValid}
        onClose={() => {
          setIsNameValid(true);
        }}
        children={<p>Board name cannot be empty</p>}
      />
    </div>
  );
}

export default AddBoard;
