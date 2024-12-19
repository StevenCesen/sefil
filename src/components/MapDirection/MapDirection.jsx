import { useEffect, useRef } from "react";

export default function MapDirection({center,zoom,height,points}) {
    const ref = useRef();

    useEffect(() => {
        const map=new window.google.maps.Map(ref.current, {
            center:{lat:Number(center.lat),lng:Number(center.lng)},
            zoom,
        });

        points.map(point=>{
            new google.maps.Marker({
                position:{lat:Number(point.point.lat),lng:Number(point.point.lng)},
                map,
                title: point.name,
            })
        });

    },[]);

    return <div style={{width:'100%',height:height,marginTop:10}} ref={ref} id="map" />;
}