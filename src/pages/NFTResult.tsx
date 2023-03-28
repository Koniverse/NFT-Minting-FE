import {Button, Image, Typography} from "@subwallet/react-ui";
import dotEventAfica from '../assets/dot-event-afica.png';
import {ThemeProps} from "../contexts/ThemeContext";
import styled from "styled-components";
import CN from "classnames";

type WelcomeProps = ThemeProps;
function Component({className}: ThemeProps): React.ReactElement<WelcomeProps> {
  return (<div className={CN('common-page', className)}>
    <div>
      <Typography.Title className={'mb-lg'} level={4}>
        Africa’s Polkadot Event
      </Typography.Title>
      <Image className={'mb-md'} width={262} src={dotEventAfica} shape={'default'}/>
      <Typography.Paragraph className={'project-description'}>
        Polkadot Safari will bring together an auspicious group of 400 people from Africa and around the world to learn
      </Typography.Paragraph>
    </div>
    <Button className={'mb-sm'} schema={"secondary"} ghost={true} block={true}>Successfully</Button>
  </div>)
}

const Welcome = styled(Component)<WelcomeProps>(({theme}) => {
  return {
    textAlign: 'center',
  }
});
export default Welcome;