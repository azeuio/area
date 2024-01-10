import React, { FC } from 'react';

interface BoardCardProps {
  backgroundColor: string;
  title: string;
  onClick: () => void;
  description?: string;
}

const BoardCard: FC<BoardCardProps> = (props) => {
  const hasDescription = props.description && props.description.trim() !== '';
  const style = {
    container: `flex felx-col items-center justify-center w-[450px] h-[250px] rounded-xl mx-10 my-10`,
    content: `flex flex-col items-center justify-center rounded-xl w-full h-full`,
    title: `text-4xl font-bold text-white font-SpaceGrotesk mb-2 m-4`,
    description: `text-2xl text-white font-SpaceGrotesk mt-2 m-4`,
  };

  return (
    <div
      className={style.container}
      style={{ backgroundColor: props.backgroundColor }}
    >
      <button className={style.content} onClick={props.onClick}>
        <p className={style.title}>{props.title}</p>
        {hasDescription && (
          <p className={style.description}>{props.description}</p>
        )}
      </button>
    </div>
  );
};

export default BoardCard;
