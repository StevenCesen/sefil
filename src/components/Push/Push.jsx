import { useStorePush } from "../../stores/useStorePush";
import "./Push.css";

export default function Push() {
  const viewPush=useStorePush();

  return (
    (viewPush.isViewOn)
      ?
        <div 
          className={`${viewPush.type} Push`}
        >
          <strong>{viewPush.title}</strong>
          <p>{viewPush.message}</p>
        </div>
      : <></>
  );
}