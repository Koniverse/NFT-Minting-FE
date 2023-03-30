import {NotificationContext} from "../contexts";
import {useContext} from "react";

export function useNotify() {
  const notify = useContext(NotificationContext);

  return notify;
}