import { useStorePush } from "../stores/useStorePush";

export default function sendpush({ title, message, type, timeout }) {
  const { setTitle, setMessage, setType, viewOn } = useStorePush.getState();

  setTitle(title);
  setMessage(message);
  setType(type);
  viewOn(timeout);
}