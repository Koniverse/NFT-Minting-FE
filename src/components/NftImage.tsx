import CN from 'classnames';
import React, {SyntheticEvent, useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import {ThemeProps} from "../types";
import {Image} from "@subwallet/react-ui";

interface Props extends ThemeProps {
  src: string;
}

const Component: React.FC<Props> = (props: Props) => {
  const {
    className,
    src
  } = props;

  const [showImage, setShowImage] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  const handleImageError = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      setShowImage(false);
      setShowVideo(true);
    },
    [],
  );

  const handleVideoError = useCallback(() => {
    setShowVideo(false);
  }, []);

  useEffect(() => {
    setShowImage(true);
    setShowVideo(false);
  }, [src]);

  return (
    <div className={CN(className)}>
      {
        showImage
          ? (
            <Image
              className={'__image __decoration'}
              width={'100%'}
              height={'100%'}
              src={src}
              shape={'default'}
              onError={handleImageError}
            />
          )
          : showVideo
              ? (
                <div className="__video __decoration">
                  <video
                    autoPlay
                    loop
                    muted
                    onError={handleVideoError}
                    width={'100%'}
                    height={'100%'}
                  >
                    <source src={src} type='video/mp4' />
                  </video>
                </div>
            ) : (
              <Image
                className={'nft-image'}
                width={'100%'}
                height={'100%'}
                shape={'default'}
              />
            )
      }
    </div>
  );
};

const NftImage = styled(Component)<Props>(({ theme: { token } }: Props) => {
  return {
    '.__decoration': {
      borderRadius: 16,
      boxShadow: '4px 4px 32px 0px rgba(34, 84, 215, 0.30)',
    },

    '.__image': {

    },

    '.__video': {
      position: 'absolute',
      top: 0,
      boxSizing: "border-box",
      display: 'flex',
    },
  };
});

export default NftImage;
