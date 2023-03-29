import {ENVIRONMENT} from "../utils/environment";
import {Image} from "@subwallet/react-ui";
import {NFTCollection, ThemeProps} from "../types";
import styled from "styled-components";

interface Props extends ThemeProps {
  collection: NFTCollection;
}
export function Component({collection, className}: Props) {
  return <Image className={className} width={'100%'} src={ENVIRONMENT.ARTZERO_IMAGE_PATTERN.replace('{{id}}', collection?.avatarImage)} shape={'default'}/>;
}

export const CollectionImage = styled(Component)<Props>(({theme: {token}}: ThemeProps) => ({
  '&.ant-image-img': {
    borderRadius: 16,
  }
}));

export default CollectionImage;