// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react';

function getLocalStorage<T>(key: string, defaultValue: T) {
  const item =
    typeof window !== 'undefined' ? window.localStorage.getItem(key) : false;

    if (item) {
      try {
        return JSON.parse(item as string) as T;
      } catch (e) {}
    }

    return defaultValue;
}

export function useLocalStorage<T = string>(key: string, initialValue: T = '' as unknown as T): [T, (v: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(getLocalStorage<T>(key, initialValue));

  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}
