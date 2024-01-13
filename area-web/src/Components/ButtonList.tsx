import React from 'react';

interface ButtonListProps<T> {
  items: T[];
  itemRenderer: (item: T, idx: number, arr: T[]) => JSX.Element;
  containerStyle?: string;
  itemContainerStyle?: string;
  itemStyle?: string;
  itemKey: (item: T, idx: number, arr: T[]) => string;
  itemColor?: (item: T, idx: number, arr: T[]) => string | null;
  onClick?: (item: T, idx: number, arr: T[]) => void;
}
const ButtonList = <T,>({
  items,
  itemRenderer,
  containerStyle,
  itemContainerStyle,
  itemStyle,
  itemKey,
  onClick,
  itemColor,
}: ButtonListProps<T>) => {
  return (
    <div
      className={`flex w-screen items-center justify-center ${containerStyle}`}
    >
      <ul
        className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 place-items-center pt-20 ${itemContainerStyle}`}
      >
        {items.map((item, idx, arr) => {
          return (
            <div
              key={itemKey(item, idx, arr)}
              className={` ${itemStyle ?? ''} cursor-pointer select-none`}
              onClick={() => onClick?.(item, idx, arr)}
              style={{
                backgroundColor: itemColor?.(item, idx, arr) ?? 'gray',
              }}
            >
              {itemRenderer(item, idx, arr)}
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default ButtonList;
