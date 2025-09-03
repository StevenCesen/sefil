import { useEffect, useRef } from "react";

export default function MapDirection({center,zoom,height,points}) {
    const ref = useRef();

    useEffect(() => {
        const map=new window.google.maps.Map(ref.current, {
            center:{lat:(Number(center.lat)!==0) ? Number(center.lat) : -1.5302188329845647,lng:(Number(center.lng)!==0) ? Number(center.lng) : -78.64439322745602},
            zoom,
        });

        points.map(point=>{
            
            if(Number(point.point.lat)!==0 & point.point.lat!==""){
                new google.maps.Marker({
                    position:{lat:Number(point.point.lat),lng:Number(point.point.lng)},
                    map,
                    title: point.name,
                })
            }
        });

    },[points]);

    return <div style={{width:'100%',height:height,marginTop:10}} ref={ref} id="map" />;
}