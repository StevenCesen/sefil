import { useEffect, useRef } from "react";

export default function MyMapComponent({center,zoom,height}) {
    const ref = useRef();

    useEffect(() => {
        const map=new window.google.maps.Map(ref.current, {
            center,
            zoom,
        });
        new google.maps.Marker({
            position: center,
            map,
            title: "Hello World!",
        });
    },[]);

    return <div style={{width:'100%',height:height,marginTop:10}} ref={ref} id="map" />;
}