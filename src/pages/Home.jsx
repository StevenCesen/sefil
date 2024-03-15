import CardDataList from "../components/CardDataList/CardDataList";
import CardDataShort from "../components/CardDataShort/CardDataShort";
import { Line,Doughnut} from 'react-chartjs-2';
import "./pages.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

import { useEffect, useState } from "react";
import useFormatterNumber from "../hooks/useFormatterNumber";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels:{
            font:{
                size:14
            }
        }
      },
      title: {
        display: true,
        text: 'Estado de cartera',
        font:{
            size:14
        }
      }
    },
  };

export const data_1 = {
    labels: ['Interes', 'Mora', 'Seguro Desgravamen', 'Gastos Judiciales', 'Gastos de cobranza','Otros valores','Saldo capital'],
    datasets: [
        {
        label: 'Valor ($)',
        data: [44954.81,95686.12, 2334.64, 11606.47, 18664.60,4.68,311424.23],
        backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(255, 0, 0, 0.4)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(100, 159, 100, 0.2)',
            'rgba(10, 225, 9, 0.2)',
            'rgba(255, 159, 100, 0.2)'
        ],
        borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 0, 0,1)',
            'rgba(153, 102, 255, 1)',
            'rgba(100, 159, 100, 1)',
            'rgba(10, 225, 9,1)',
            'rgba(255, 159, 100,1)'
        ],
        borderWidth: 1,
        }
    ],
};

const options_1={
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        labels:{
            font:{
                size:10
            }
        }
        }
    }
}
  
const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  
// export const data = {
//     labels,
//     datasets: [
//         {
//         label: 'Año 2024',
//         data: labels.map((label,index) =>Number(index)*Math.exp(1)+4),
//         borderColor: 'rgb(255, 99, 132)',
//         backgroundColor: 'rgba(255, 99, 132, 0.5)'
//         }
//     ]
// };

const months=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export default function Home(){

    const [vouchers,setVouchers]=useState();
    // const [condonations,setCondonatios]=useState();
    // const [restruct,setRestruct]=useState();
    const [totalDay,setTotal]=useState(0);
    // const [data,setData]=useState({});
    const [users,setUsers]=useState();

    const [totalMonth,setMonth]=useState(0);

    useEffect(()=>{

        // fetch("https://sefil.softsen.space/public/api/vouchers/reportAnual",{
        //     headers: {
        //         Accept: 'application/json',
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //     }
        // })
        //     .then((response) => response.json())  
        //     .then((data) =>{
        //         setData({
        //             labels,
        //             datasets: [
        //                 {
        //                 label: 'Año 2024',
        //                 data: data,
        //                 borderColor: 'rgb(255, 99, 132)',
        //                 backgroundColor: 'rgba(255, 99, 132, 0.5)'
        //                 }
        //             ]
        //         });
        //     });

        fetch(`https://sefil.softsen.space/public/api/vouchers?fecha=2024/02&order`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => setVouchers(data.data));

        // fetch("https://sefil.softsen.space/public/api/credit/condonar",{
        //     headers: {
        //         Accept: 'application/json',
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //     }
        // })
        //     .then((response) => response.json())  
        //     .then((data) => setCondonatios(data.data));

        // fetch("https://sefil.softsen.space/public/api/credit/estructurar",{
        //     headers: {
        //         Accept: 'application/json',
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //     }
        // })
        //     .then((response) => response.json())  
        //     .then((data) => setRestruct(data.data));

        fetch("https://sefil.softsen.space/public/api/vouchers/getTotalDay",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => setTotal(data));
        
        fetch("https://sefil.softsen.space/public/api/vouchers/getTotalMonth",{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => setMonth(data));

        // fetch("https://sefil.softsen.space/public/api/users/departaments",{
        //     headers: {
        //         Accept: 'application/json',
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //     }
        // })
        //     .then((response) => response.json())  
        //     .then((data) => setUsers(data));

    },[]);

    if(!vouchers) return <></>
    if(!totalMonth) return <></>
    // if(!condonations) return <></>
    // if(!restruct) return <></>
    // if(!data) return <></>
    // if(!users) return <></>

    return(
        <div className="Home">
            <div className="Home__head">
                <CardDataShort
                    title="Ingresos diarios"
                    subtitle={new Date().toLocaleDateString()}
                    data={`${useFormatterNumber({value:totalDay,currency:"USD"})}`}
                />
                {
                    totalMonth.map((total,index)=>(
                        <CardDataShort
                            title={`Ingresos | ${total.cartera}`}
                            subtitle={months[new Date().getMonth()]}
                            data={`${useFormatterNumber({value:total.total,currency:"USD"})}`}
                        />
                    ))
                }

                {
                    // users.data.map((user,index)=>(
                    //     <CardDataShort
                    //         key={index}
                    //         title="Usuarios"
                    //         status={"Creados"}
                    //         subtitle={user.name.toUpperCase()}
                    //         data={`${user.size}`}
                    //     />
                    // ))
                }
            </div>

            <div className="Home__stadisticOne">
                {/* <div>
                    <h3>Estado actual de cartera</h3>
                    <Doughnut
                        data={data_1}
                        options={options_1}
                    />
                </div> */}

                <div>
                    <div>
                        <h3>Monitoreo de llamadas</h3>
                    </div>

                    <div>
                        <h3>Monitorio WhatsApp</h3>

                    </div>
                </div>

                {/* <CardDataList
                    title={"Créditos reestructurados"}
                    subtitle={""}
                    data={restruct}
                    link={{text:"Ir a reporte de créditos",link:'/dashboard/reportes/creditos/estructuracion'}}
                />
                <CardDataList
                    title={"Créditos condonados"}
                    subtitle={""}
                    data={condonations}
                    link={{text:"Ir a reporte de créditos",link:'/dashboard/reportes/creditos/condonacion'}}
                /> */}
            </div>
        </div>
    );
}