import {useContext, useMemo} from "react";
import {ScreenContext} from "../contexts";


const useIsMobileSize = () => {
  const { screenType } = useContext(ScreenContext);

  return useMemo(() => {
    switch (screenType) {
      case 'lg':
      case 'xl':
      case 'xxl':
        return false;
      default:
        return true;
    }
  }, [screenType])
}

export default useIsMobileSize
