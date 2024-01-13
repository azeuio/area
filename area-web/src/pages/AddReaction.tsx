import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GlobalContext from '../GlobalContext';
import ServiceModal from '../Components/ServiceModal';
import DescriptionInput from '../Components/DescriptionInput';
import Header from '../Components/Header';
import ButtonList from '../Components/ButtonList';
import Requester from '../Requester';
import {
  ActionDto,
  AreaDto,
  AreaOption,
  CreateAreaDto,
  ServiceDto,
  Types,
  WithId,
} from '../types';
import PromiseBuilder from '../Components/PromiseBuilder';
import Loading from '../Components/Loading';
import ErrorModal from '../Components/ErrorModal';

interface AddReactionViewProps {
  readonly data: {
    readonly accessToken: string;
    readonly selectedService: ServiceDto;
    readonly availableActions: ActionDto[];
    readonly parent?: WithId<AreaDto>;
  };
}
function AddReactionView({
  data: { accessToken, selectedService, availableActions, parent },
}: AddReactionViewProps) {
  const navigate = useNavigate();
  const { backendUrl } = React.useContext(GlobalContext);
  const { boardid, parentid } = useParams() as {
    boardid: string;
    serviceid: string;
    parentid: string;
  };
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedAction, setSelectedAction] = React.useState<ActionDto | null>(
    null,
  );
  const [editedOptions, setEditedOptions] = React.useState<
    Record<string, Types>
  >({});
  const [error, setError] = React.useState<{
    status: number;
    reason: string;
    type: string;
  } | null>(null);

  function numericColorToHex(numericColor: number) {
    const hexColor = `#${numericColor.toString(16).slice(2).toUpperCase()}`;
    return hexColor;
  }

  const onOptionChange = (
    name: string,
    newValue: Types,
    option: AreaOption,
  ) => {
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

  /* Send request to backend to create a new area */
  const createArea = async () => {
    try {
      const body: CreateAreaDto = {
        action: {
          id: selectedAction?.id ?? '',
          options: editedOptions,
        },
        board_id: boardid,
        parent_id: parentid,
        child_id: parent?.child_id,
      };
      const response = await new Requester()
        .authorization(accessToken ?? '')
        .body(body)
        .post(`${backendUrl}/areas`);
      if (response.ok) {
        const id = await response.text();
        if (parentid) {
          navigate(`/boards/${boardid}`);
          return;
        } else {
          navigate(`/link-reaction/${boardid}/${id}`);
          return;
        }
      } else {
        setError({
          status: response.status,
          reason: (await response.json()).message,
          type: response.statusText,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect(() => {
  //   const fetchActionService = async () => {
  //     try {
  //       const response = await fetch(`${backendUrl}/services/` + serviceid, {
  //         method: 'GET',
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       const json = await response.json();
  //       setSelectedService(json);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  //   /* Fetch list of actions we can add */
  //   const fetchActions = async () => {
  //     try {
  //       const response = await new Requester().get(
  //         `${backendUrl}/actions/from-service/${serviceid}`,
  //       );
  //       if (!response.ok) {
  //         return;
  //       }
  //       const json = await response.json();

  //       setAvailableActions(json);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };
  //   fetchActionService();
  //   fetchActions();
  // }, [serviceid, backendUrl, navigate]);

  return (
    <div className="h-screen absolute top-0">
      <Header
        color={numericColorToHex(Number(selectedService?.color ?? 0))}
        logo={selectedService?.logo ?? ''}
        title={selectedService?.name ?? ''}
        description={selectedService?.description ?? ''}
      />
      <ButtonList
        items={availableActions.filter(
          /* if no parent, this is a trigger */
          (action) => action.is_a_trigger !== Boolean(parentid),
        )}
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
      <ErrorModal
        error={`Error ${error?.status}`}
        message={error?.reason ?? 'An error occured'}
        isOpen={error !== null}
        onClose={() => setError(null)}
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

function AddReaction() {
  const { getUser, backendUrl } = React.useContext(GlobalContext);
  const { boardid, serviceid, parentid } = useParams() as {
    boardid: string;
    serviceid: string;
    parentid: string;
  };

  return (
    <PromiseBuilder
      loading={<Loading />}
      error={(error) => (
        <ErrorModal redirect={`/boards/${boardid}`} error={error} />
      )}
      promise={async () => {
        const user = await getUser();
        if (!user) {
          throw new Error('Not logged in');
        }
        const accessToken = await user.getIdToken();
        const activeServicesPromise = await new Requester()
          .authorization(accessToken)
          .get(`${backendUrl}/services/active`);
        const selectedServicePromise = await new Requester()
          .authorization(accessToken)
          .get(`${backendUrl}/services/${serviceid}`);
        const availableActionsPromise = await new Requester().get(
          `${backendUrl}/actions/from-service/${serviceid}`,
        );
        const responses = await Promise.all([
          activeServicesPromise,
          selectedServicePromise,
          availableActionsPromise,
        ]);
        if (responses.some((response) => !response.ok)) {
          throw new Error('Error while fetching data');
        }
        const [activeServices, selectedService, availableActions] =
          (await Promise.all(
            responses.map(async (response) => response.json()),
          )) as [(ServiceDto & { id: string })[], ServiceDto, ActionDto[]];
        if (
          !activeServices ||
          !activeServices.some((service) => service.id === serviceid)
        ) {
          console.log({ activeServices, serviceid });

          throw new Error('Service not activated');
        }
        const parentPromise = await new Requester()
          .authorization(accessToken)
          .get(`${backendUrl}/areas/area/${parentid}`);
        const parent = parentPromise.ok
          ? ((await parentPromise.json()) as WithId<AreaDto>)
          : undefined;
        return {
          accessToken,
          selectedService,
          availableActions,
          parent,
        };
      }}
      builder={(data) => <AddReactionView data={data} />}
      onFail={console.log}
      deps={[]}
    />
  );
}

export default AddReaction;
