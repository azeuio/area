import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GlobalContext from '../GlobalContext';
import ServiceModal from '../Components/ServiceModal';
import DescriptionInput from '../Components/DescriptionInput';
import Header from '../Components/Header';
import ButtonList from '../Components/ButtonList';

type TypesStr = 'string' | 'number' | 'boolean';
type Types = string | number | boolean;

export interface Option {
  type: TypesStr;
  default?: Types;
}
interface ActionInputType {
  name: string;
  description: string;
  type: string;
  optional: boolean;
}

interface Action {
  name: string;
  description: string;
  service_id: string;
  is_a_trigger: boolean;
  inputs_types?: ActionInputType[]; // i.e. ['string', 'number']
  outputs_types?: ActionInputType[]; // i.e. ['string', 'number']
  options?: Record<string, Option>; // i.e. { 'songId': 'value1', 'artistId': 'value2' }
}

interface Service {
  name: string;
  description: string;
  color: string;
  logo: string;
}

function AddReaction() {
  const navigate = useNavigate();
  const { getUser } = React.useContext(GlobalContext);
  const { backendUrl } = React.useContext(GlobalContext);
  const { boardid } = useParams() as { boardid: string };
  const { actionid } = useParams() as { actionid: string };
  const { serviceid } = useParams() as { serviceid: string };
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedService, setSelectedService] =
    React.useState<Service | null>();
  const [availableActions, setAvailableActions] = React.useState<Action[]>([]);
  const [selectedAction, setSelectedAction] = React.useState<Action | null>(
    null,
  );
  const [editedOptions, setEditedOptions] = React.useState<
    Record<string, Types>
  >({});

  // redirect to login if not logged in
  React.useEffect(() => {
    getUser().then((user) => {
      if (!user) {
        navigate('/login');
      }
    });
  }, [getUser, navigate]);

  function numericColorToHex(numericColor: number) {
    const hexColor = `#${numericColor.toString(16).slice(2).toUpperCase()}`;
    return hexColor;
  }

  const onOptionChange = (name: string, newValue: Types, option: Option) => {
    let verifiedValued: Types = newValue;

    if (newValue !== '') {
      console.log({ name, newValue, option });
      if (option.type === 'number') {
        verifiedValued = Number(newValue);
      } else if (option.type === 'boolean') {
        verifiedValued = newValue === 'true';
      }
    }

    const newInputValues = { ...editedOptions, [name]: verifiedValued };
    if (option.default !== undefined && newValue === '') {
      delete newInputValues[name];
      console.log('default value', newInputValues);
    }
    setEditedOptions(newInputValues);
  };

  const createArea = async () => {
    try {
      console.log('je sais pas quoi faire ici');
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchActionService = async () => {
      try {
        const response = await fetch(`${backendUrl}/services/` + serviceid, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const json = await response.json();
        setSelectedService(json);
      } catch (e) {
        console.log(e);
      }
    };

    const fetchActions = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/actions/from-service/` + serviceid,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );

        const json = await response.json();

        setAvailableActions(json);
      } catch (e) {
        console.log(e);
      }
    };
    fetchActionService();
    fetchActions();
  }, [serviceid, backendUrl, navigate]);

  const headerStyle = {
    content: `rounded-xl flex items-center justify-center transition-all duration-300 p-10 gap-1 sm:gap-1 md:gap-3 lg:gap-5 xl:gap-6 2xl:gap-10 pt-24`,
    text: `text-white font-SpaceGrotesk text-sm sm:text-lg md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl`,
    iconContainer: `rounded-full bg-[#fff] flex items-center justify-center h-full sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-34 2xl:h-34`,
    description:
      'font-SpaceGrotesk text-center w-full resize-none line-clamp-1',
  };

  return (
    <div className="h-screen absolute top-0">
      <Header
        color={numericColorToHex(Number(selectedService?.color ?? 0))}
        logo={selectedService?.logo ?? ''}
        title={selectedService?.name ?? ''}
        description={selectedService?.description ?? ''}
      />
      <ButtonList
        items={availableActions.filter((action) => !action.is_a_trigger)}
        itemKey={(action) => action.name}
        itemColor={(action) =>
          numericColorToHex(Number(selectedService?.color))
        }
        onClick={(action) => {
          setIsModalOpen(true);
          setSelectedAction(action);
        }}
        containerStyle="h-auto"
        itemContainerStyle="w-[75%]"
        itemStyle="rounded-xl w-[80%] flex items-center justify-center transition-all duration-300 hover:scale-105 aspect-video h-24"
        itemRenderer={(action) => (
          <div
            className="
            text-white font-SpaceGrotesk text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl min-[2000px]:text-6xl min-[3500px]:text-8xl max-[500px]:text-sm"
          >
            {action.name}
          </div>
        )}
      />
      <ServiceModal
        isOpen={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditedOptions({});
        }}
        onConfirm={() => {
          createArea().then(() => {
            setIsModalOpen(false);
          });
        }}
        className="max-h-[90vh]"
        title={selectedAction?.name ?? ''}
        description={selectedAction?.description ?? ''}
        options={selectedAction?.options}
        optionRenderer={(option, optionName) => (
          <div
            key={optionName}
            className="flex items-center justify-center flex-col w-[80%]"
          >
            {option.type !== 'boolean' && (
              <p className="font-SpaceGrotesk text-gray-700 whitespace-nowrap overflow-ellipsis overflow-hidden w-[90%]">
                {optionName}
              </p>
            )}
            <span className="flex flex-row items-center justify-center space-x-2 w-full">
              {option.type === 'boolean' ? (
                <BooleanField
                  name={optionName}
                  value={
                    editedOptions[optionName]
                      ? Boolean(editedOptions[optionName])
                      : selectedAction?.options?.[
                          optionName
                        ].default?.toString() === 'true'
                  }
                  onChange={(value) => {
                    onOptionChange(optionName, value.toString(), option);
                  }}
                />
              ) : (
                <DescriptionInput
                  placeholder={option.default?.toString() ?? ''}
                  descriptionInputStyle="w-full"
                  containerStyle="w-full"
                  onChange={(event) =>
                    onOptionChange(optionName, event.target.value, option)
                  }
                  descriptionValue={
                    editedOptions[optionName]
                      ? String(editedOptions[optionName])
                      : selectedAction?.options?.[
                          optionName
                        ].default?.toString() ?? ''
                  }
                  required={option.default === undefined}
                />
              )}
              {Object.hasOwn(editedOptions, optionName) && (
                <button
                  className="font-SpaceGrotesk text-4xl text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-300"
                  aria-label="undo"
                  onClick={() => {
                    const newInputValues = { ...editedOptions };
                    delete newInputValues[optionName];
                    setEditedOptions(newInputValues);
                  }}
                >
                  ⤺
                </button>
              )}
            </span>
          </div>
        )}
      />
    </div>
  );
}

const BooleanField = (props: {
  name: string;
  value?: boolean;
  default?: string;
  onChange: (value: boolean) => void;
}) => {
  return (
    <span className="cursor-pointer contents space-x-3">
      <p
        className={` font-SpaceGrotesk text-gray-700 whitespace-nowrap overflow-ellipsis overflow-hidden`}
        onClick={() => {
          props.onChange(!props.value);
        }}
      >
        {props.name}
      </p>
      <input
        type="checkbox"
        className="h-[1em] aspect-square"
        checked={
          props.value !== undefined
            ? props.value
            : props.default?.toString() === 'true'
        }
        onChange={(event) => props.onChange(event.target.checked)}
      />
    </span>
  );
};

export default AddReaction;
