import {Button, Icon, Typography} from "@subwallet/react-ui";
import {NFTCollection, ThemeProps} from "../types";
import styled from "styled-components";
import {ArrowSquareOut} from "phosphor-react";
import {ENVIRONMENT} from "../utils/environment";

interface Props extends ThemeProps {
  collection: NFTCollection;
}

export function Component({collection, className}: Props) {
  return <div className={className}>
    <Typography.Title className={'collection-title'} level={4}>
      {collection?.name}
    </Typography.Title>
    <Button
      icon={<Icon phosphorIcon={ArrowSquareOut} weight={'light'}/>} size={'xs'} type={'ghost'}
      onClick={() => {window.open(`${ENVIRONMENT.ARTZERO_PORTAL}/#/launchpad/${collection?.nftContractAddress}`)}}
    />
  </div>;
}

export const CollectionTitle = styled(Component)<Props>(({theme: {token}}: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  marginBottom: 18,

  '.collection-title': {
    flex: 1,
    marginBottom: 0
  }
}));

export default CollectionTitle;