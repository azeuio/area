import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import GlobalContext from '../GlobalContext';
import settings_icon from '../assets/settings_icon.svg';
import ButtonList from '../Components/ButtonList';
import { AreaDto, BoardDto } from '../types';
import Requester from '../Requester';
import Loading from '../Components/Loading';
import PromiseBuilder from '../Components/PromiseBuilder';
import Redirect from '../Components/Redirect';
import BrickStack from '../Components/BrickStack';
import Badge from '../Components/Badge';

interface BoardViewProps {
  data: {
    areas: Record<string, AreaDto>;
    boardId: string;
    board: BoardDto;
  };
}
function BoardView({ data: { areas, boardId, board } }: BoardViewProps) {
  const { getUser, backendUrl } = useContext(GlobalContext);
  const [areaChainList, setAreaChainList] = useState<
    (AreaDto & { id: string })[][]
  >([]);
  useEffect(() => {
    const getAreaChainList = async () => {
      const areasWithId = Object.entries(areas).map(([id, area]) => ({
        ...area,
        id,
      }));

      const chains = Object.values(areasWithId)
        .filter((area) => !area.child_id)
        .map((area) => [area]);

      const toSort = areasWithId.filter((area) => !!area.child_id);
      for (let i = 0; toSort.length > 0 && i < 100; i++) {
        for (const chainArea of Object.values(chains)) {
          const index = toSort.findIndex(
            (toSortArea) => toSortArea.child_id === chainArea[0].id,
          );
          if (index !== -1) {
            chainArea.splice(0, 0, toSort[index]);
            toSort.splice(index, 1);
          }
        }
      }
      setAreaChainList(chains);
    };
    getAreaChainList();
  }, [areas]);

  const deleteAreaChain = async (areaChainIdx: number) => {
    const areaChain = areaChainList[areaChainIdx];
    const user = await getUser();
    const userToken = await user?.getIdToken();
    for (const area of areaChain) {
      await new Requester()
        .authorization(userToken ?? '')
        .delete(`${backendUrl}/areas/area/${area.id}`);
    }
    areaChainList.splice(areaChainIdx, 1);
  };

  const style = {
    headerContainer: 'flex items-center justify-center flex-row',
    title:
      'text-5xl font-SpaceGrotesk font-bold text-center pt-20 username-margin',
    settingsIcon: 'h-10 w-10 ml-5 mt-8',
  };

  return (
    <div>
      <div className={style.headerContainer}>
        <p className={style.title}>{board.name}</p>
        <a href={`/manage-board/${boardId}`}>
          <img
            src={settings_icon}
            alt="Add board"
            className={style.settingsIcon}
          />
        </a>
      </div>
      <ButtonList
        items={areaChainList}
        itemKey={(chain) => chain[0].id}
        itemRenderer={(chain) => (
          <>
            <span
              className="material-symbols-outlined"
              onClick={() => {
                deleteAreaChain(
                  areaChainList.findIndex((c) => c === chain),
                ).then(() => setAreaChainList([...areaChainList]));
              }}
            >
              close
            </span>
            <BrickStack chain={chain} />
          </>
        )}
        itemColor={(chain) => 'transparent'}
      />
      <Badge color="gray-700" borderColor="gray-700">
        <a
          href={`/add-action/${boardId}`}
          className="material-symbols-outlined scale-150 "
        >
          add
        </a>
      </Badge>
    </div>
  );
}

function Board() {
  const navigate = useNavigate();
  const { getUser, backendUrl } = useContext(GlobalContext);
  const { boardId } = useParams();

  return (
    <PromiseBuilder
      promise={async () => {
        if (!boardId) {
          navigate('/boards');
          throw new Error('Board not found');
        }
        const user = await getUser();
        const userToken = await user?.getIdToken();
        if (!user || !userToken) {
          navigate('/login');
          throw new Error('User not logged in');
        }
        const boardResponse = await new Requester()
          .authorization(userToken)
          .get(`${backendUrl}/boards/${boardId}`);
        if (!boardResponse.ok) {
          navigate('/boards');
          throw new Error('Error getting board');
        }
        const board: BoardDto = await boardResponse.json();
        const areasResponse = await new Requester()
          .authorization(userToken)
          .get(`${backendUrl}/areas/${boardId}`);
        if (!areasResponse.ok) {
          console.log(areasResponse.status);

          navigate('/boards');
          throw new Error('Error getting actions');
        }

        const areas: Record<string, AreaDto> =
          (await areasResponse.json().catch(() => {})) ?? {};

        return { areas, boardId, board };
      }}
      deps={[]}
      loading={<Loading />}
      error={<Redirect to="/boards" />}
      onFail={(e) => console.log(e)}
      builder={(data) => <BoardView data={data} />}
    />
  );
}

export default Board;
