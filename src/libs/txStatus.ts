
import {DispatchError, ExtrinsicStatus} from "@polkadot/types/interfaces";
import {NotificationInstance} from "@subwallet/react-ui/es/notification/interface";
export const FINALIZED = "Finalized";

interface TxResponseErrorHandlerProps {
  status: ExtrinsicStatus;
  dispatchError: DispatchError;
  notify: NotificationInstance;
}

export const txErrorHandler = (error: any) => {

  let message;

  const errStr = error.toString();

  if (errStr.includes("RpcError")) {
    message = errStr.slice(errStr.indexOf("RpcError") + 16);

    // return toast.error(message);
  }

  message = `Transaction is ${error.message.toLowerCase()} by user.`;

  // toast.error(message);
};

export const txResponseErrorHandler = async ({
                                               status,
                                               dispatchError,
                                               notify
                                             }: TxResponseErrorHandlerProps) => {
  const url = `https://test.azero.dev/#/explorer/query/`;
  // @ts-ignore
  const statusToHuman = Object.entries(status.toHuman());

  if (dispatchError) {

    if (dispatchError.isModule) {

      if (statusToHuman[0][0] === FINALIZED) {
        // notify.error({message: 'Payment has failed'});
      }
    } else {
      console.log("dispatchError.toString()", dispatchError.toString());
    }
  }

  if (!dispatchError && status) {
    if (statusToHuman[0][0] === FINALIZED) {
      console.log("Tx finalized at ", `${url}${statusToHuman[0][1]}`);
      notify.success({message: 'Payment was successful'});
    }
  }
};
