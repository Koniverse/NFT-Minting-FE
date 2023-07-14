import styled from 'styled-components';
import React, {useState} from 'react';
import {ThemeProps} from '../../types';
import {Welcome} from './Welcome';
import {ConnectWalletStep} from './ConnectWallet';

type Props = ThemeProps;

type ViewType = 'wellcome' | 'connect-wallet';
function Component({className}: ThemeProps): React.ReactElement<Props> {
  const [viewType, setViewType] = useState<ViewType>('wellcome');

  return (
    <>
      {viewType === 'wellcome' && <Welcome onClickButton={() => setViewType('connect-wallet')} />}
      {viewType === 'connect-wallet' && <ConnectWalletStep />}
    </>
  );
}

export const ConnectWallet = styled(Component)<Props>(({theme: {extendToken}}: Props) => {

  return {

  };
});
