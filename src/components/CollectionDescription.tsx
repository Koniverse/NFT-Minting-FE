import {ENVIRONMENT} from "../utils/environment";
import {Typography} from "@subwallet/react-ui";
import {NFTCollection, ThemeProps} from "../types";
import styled from "styled-components";
import CN from "classnames";

interface Props extends ThemeProps {
  collection: NFTCollection;
}
export function Component({collection, className}: Props) {
  return <Typography.Paragraph className={CN(className, 'collection-description')}>
        {collection?.description},
        <a target={'_blank'} href={`${ENVIRONMENT.ARTZERO_PORTAL}/#/launchpad/${collection?.nftContractAddress}`} rel="noreferrer">see more</a>
      </Typography.Paragraph>;
}

export const CollectionDescription = styled(Component)<Props>(({theme: {token}}: ThemeProps) => ({
  marginBottom: 16,
  textAlign: "left",
  backgroundColor: token["gray-1"],
  padding: token.paddingXS,
  borderRadius: token.borderRadius
}));

export default CollectionDescription;