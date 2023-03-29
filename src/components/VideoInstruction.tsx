import {Button, Icon} from "@subwallet/react-ui";
import {PlayCircle} from "phosphor-react";
import {ENVIRONMENT} from "../utils/environment";

export function VideoInstruction() {
  return <Button
            schema={"secondary"}
            type={"ghost"}
            size={"xs"}
            icon={<Icon phosphorIcon={PlayCircle} weight={"fill"}/>}
            onClick={() => {
              window.open(ENVIRONMENT.INSTRUCTION_URL)
            }}
            block={true}>
      Video Instructions
    </Button>;
}