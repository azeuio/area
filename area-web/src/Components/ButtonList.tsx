import React from 'react';

interface ButtonListProps<T> {
  items: T[];
  itemRenderer: (item: T) => JSX.Element;
  containerStyle?: string;
  itemContainerStyle?: string;
  itemStyle?: string;
  itemKey: (item: T) => string;
  itemColor?: (item: T) => string | null;
  onClick?: (item: T) => void;
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
        {items.map((item) => {
          return (
            <div
              key={itemKey(item)}
              className={` ${itemStyle ?? ''} cursor-pointer select-none`}
              onClick={() => onClick?.(item)}
              style={{
                backgroundColor: itemColor?.(item) ?? 'gray',
              }}
            >
              {itemRenderer(item)}
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default ButtonList;
