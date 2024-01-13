import React, { useEffect, useState } from 'react';

interface PromiseBuilderProps<T> {
  promise: () => Promise<T>;
  deps?: unknown[];
  loading: React.JSX.Element;
  error: React.JSX.Element | ((error: Error) => React.JSX.Element);
  onDone?: (data: T) => void;
  onFail?: (error: Error) => void;
  builder: (data: T) => React.JSX.Element;
}
/**
 * Akin to FutureBuilder in Flutter
 */
function PromiseBuilder<T>({
  promise,
  deps,
  loading,
  error,
  builder,
  onDone,
  onFail,
}: PromiseBuilderProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [errorState, setError] = useState<Error | null>(null);

  useEffect(() => {
    promise()
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promise, deps ?? []]);

  if (errorState) {
    if (onFail) {
      onFail(errorState);
    }
    if (typeof error === 'function') {
      return error(errorState);
    }
    return error;
  }
  if (!data) {
    return loading;
  }
  if (onDone) {
    onDone(data);
  }
  return builder(data);
}

export default PromiseBuilder;
