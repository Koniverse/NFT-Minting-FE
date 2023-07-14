// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {ScreenContext, Screens} from '../contexts';

const ScreenBreakpoint: Record<Screens, [number, number?]> = {
  [Screens.XS]: [0, 575],
  [Screens.SM]: [576, 767],
  [Screens.MD]: [768, 991],
  [Screens.LG]: [992, 1199],
  [Screens.XL]: [1200, 1599],
  [Screens.XXL]: [1600],
};

interface ScreenContextProviderProps {
  children?: React.ReactElement
}

export const ScreenContextProvider = ({ children }: ScreenContextProviderProps) => {
  const [screenType, setScreenType] = React.useState<`${Screens}`>(
    Screens.XL
  );

  const handleWindowResize = React.useCallback(() => {
    Object.keys(ScreenBreakpoint).map((breakpoint: string) => {
      const breakpointKey = breakpoint as `${Screens}`;
      const [lower, upper] = ScreenBreakpoint[breakpointKey];

      if (!upper) {
        if (lower <= window.innerWidth && screenType !== breakpoint) {
          setScreenType(breakpointKey);
        }

        return breakpoint;
      }

      if (
        lower <= window.innerWidth &&
        upper >= window.innerWidth &&
        screenType !== breakpoint
      ) {
        setScreenType(breakpointKey);
      }

      return breakpoint;
    });
  }, [screenType]);

  React.useEffect(() => {
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  return (
    <ScreenContext.Provider
      value={{
        screenType
      }}
    >
      {children}
    </ScreenContext.Provider>
  );
};
