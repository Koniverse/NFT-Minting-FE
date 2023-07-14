import {ThemeProps} from '../types';
import styled from 'styled-components';
import React, {useCallback, useContext} from 'react';
import {useNavigate} from 'react-router';
import {AppContext2} from '../contexts';
import {Button, Form, Input} from '@subwallet/react-ui';
import {isAddress, isEthereumAddress} from '@polkadot/util-crypto';
import {Wallet} from 'phosphor-react';
import {RuleObject} from '@subwallet/react-ui/es/form';

type Props = ThemeProps;

interface RecipientAddressInput {
  address?: string;
}

function Component({className}: ThemeProps): React.ReactElement<Props> {
  const navigate = useNavigate();
  const {mintCheckResult, isMinting, currentAddress, recipient, setRecipient} = useContext(AppContext2);
  const [form] = Form.useForm<RecipientAddressInput>();
  const formDefault: RecipientAddressInput = {
    address: recipient
  };

  const onSubmitRecipient = () => {
    const {address} = form.getFieldsValue();

    if (address) {
      setRecipient(address);
      navigate('/mint-detail');
    }
  };

  const accountAddressValidator = useCallback(
    (rule: RuleObject, value: string) => {

      if (!value) {
        return Promise.reject('Address is required');
      }

      if (!isAddress(value)) {
        return Promise.reject('Invalid address');
      } else if (isEthereumAddress(value)) {
        return Promise.reject('Address must be substrate type');
      }

      return Promise.resolve();
    },
    []
  );

  const renderResult = (() => {
    if (isMinting) {
      return (
        <>Your NFT is minting</>
      );
    }

    if (mintCheckResult) {
      if (mintCheckResult.requestId) {

        if (isEthereumAddress(currentAddress)) {

          return (
            <>
              <div>Must enter substrate address</div>

              <Form form={form} initialValues={formDefault} onFinish={onSubmitRecipient}>
                <Form.Item
                  name={'address'}
                  rules={[
                    {
                      validator: accountAddressValidator
                    }
                  ]}
                  statusHelpAsTooltip={true}
                >
                  <Input
                    placeholder={'Enter address'}
                    prefix={<Wallet size={24}/>}
                    type={'text'}
                  />
                </Form.Item>

                <Button
                  block
                  onClick={form.submit}
                  schema="primary"
                >
                  Start to mint
                </Button>
              </Form>
            </>
          );
        }

        return (
          <>
            Pass

            <Button onClick={() => {
              navigate('/mint-detail');
            }} className={'__button'}>
              Start to mint
            </Button>
          </>
        );
      } else {
        return (
          <>
            Not eligible to mint

            <pre>
          {JSON.stringify(mintCheckResult)}
        </pre>
          </>
        );
      }
    }

    return (
      <>checking...</>
    );
  })();

  return (
    <div className={className}>
      <div className={'__box'}>
        {renderResult}
      </div>
    </div>
  );
}

export const EligibilityCheck = styled(Component)<Props>(({theme: {token}}) => {
  return {
    '.__box': {
      paddingTop: 114,
      paddingBottom: 111,
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: token.colorBgDefault,
      boxShadow: '4px 4px 32px 0px rgba(34, 84, 215, 0.30)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
  };
});
