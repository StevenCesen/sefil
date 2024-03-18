import { useEffect, useRef } from "react";

export default function MyMapComponent({center,zoom}) {
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

    return <div style={{width:'100%',height:'300px',marginTop:10}} ref={ref} id="map" />;
}