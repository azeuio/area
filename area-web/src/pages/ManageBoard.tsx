import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import GlobalContext from '../GlobalContext';
import settings_icon from '../assets/settings_icon.svg';
import TextInput from '../Components/TextInput';
import DescriptionInput from '../Components/DescriptionInput';
import Colorful from '@uiw/react-color-colorful';
import { hsvaToHex } from '@uiw/color-convert';
import CTA from '../Components/CTA';
import Modal from '../Components/Modal';
import ConfirmationModal from '../Components/ConfirmationModal';

function ManageBoard() {
  const navigate = useNavigate();
  const { getUser, backendUrl } = useContext(GlobalContext);
  const { boardId } = useParams();
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [boardColor, setBoardColor] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [wantToDelete, setWantToDelete] = useState(false);

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
        setBoardName(json.name);
        setBoardDescription(json.description);
        setBoardColor(json.color);
      } catch (error) {
        console.log(error);
        navigate('/boards');
      }
    };
    getBoard();
  }, [getUser, backendUrl, boardId, navigate]);

  const updateBoard = async () => {
    if (boardName.trim() === '') {
      setIsNameValid(false);
      return;
    }
    try {
      const userToken = await getUser()?.then((user) => {
        return user?.getIdToken();
      });

      await fetch(`${backendUrl}/boards/${boardId}`, {
        method: 'PATCH',
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
      navigate(`/boards/${boardId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBoard = async () => {
    try {
      const userToken = await getUser()?.then((user) => {
        return user?.getIdToken();
      });

      await fetch(`${backendUrl}/boards/${boardId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
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
          Manage board
        </p>
        <TextInput
          placeholder="Board name"
          onChange={(event) => {
            setBoardName(event.target.value);
          }}
          textInputValue={boardName}
        />
        <DescriptionInput
          placeholder="Board description"
          onChange={(event) => {
            setBoardDescription(event.target.value);
          }}
          descriptionValue={boardDescription}
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
        <div className="flex">
          <CTA
            buttonText="Delete"
            buttonStyle="bg-[#EA4335] text-white text-2xl px-16 mr-4"
            onClick={() => {
              setWantToDelete(true);
            }}
          />
          <CTA
            buttonText="Update"
            buttonStyle="bg-[#34A853] text-white text-2xl px-16"
            onClick={updateBoard}
          />
        </div>
      </div>
      <Modal
        isOpen={!isNameValid}
        onClose={() => {
          setIsNameValid(true);
        }}
        children={<p>Board name cannot be empty</p>}
      />
      <ConfirmationModal
        isOpen={wantToDelete}
        onClose={() => {
          setWantToDelete(false);
        }}
        onConfirm={deleteBoard}
        children={<p>Are you sure you want to delete this board?</p>}
      />
    </div>
  );
}

export default ManageBoard;
