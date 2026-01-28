import "./MenuNav.css";
import NavigationToggle from "../NavigationToggle/NavigationToggle";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import SectionManagement from "../../Management/SectionManagement/SectionManagement";
import SectionPayments from "../../Management/SectionPayments/SectionPayments";
import SectionNotes from "../../Management/SectionNotes/SectionNotes";
import SectionDirections from "../../Management/SectionDirections/SectionDirections";

export default function MenuNav({options}){

    const store_management=useStoreManagement();
    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'superadmin' || userRole === 'admin';

    if(!store_management.managements) return <></>

    return(
        <div className="MenuNav">
            <div className="MenuNav__sectionOptions">
                {
                    options.map(option=>(
                        <button 
                            key={option.name}
                            className={`${(option.default_option) ? "Credit__sectionOptions--activeButton" : ""}`}
                            onClick={(e)=>{
                                store_management.setSection(option.end_point);
                            }}    
                        >{option.name}</button>
                    ))
                }
            </div>
            {/* <div className="MenuNav__navigation">
                <h2>Registros</h2>
                <NavigationToggle
                    first_url={data.first_url}
                    prev_url={data.prev_page_url}
                    per_page={data.per_page}
                    next_url={data.next_page_url}
                    last_page={data.last_page_url}
                />
            </div> */}
            <div className="MenuNav__list">
                {
                    (store_management.section==='MANAGEMENTS')
                    ?
                        <SectionManagement
                            managements={store_management.managements}
                        />
                    :   (store_management.section==='PAYMENTS')
                        ?
                            <SectionPayments
                                payments={store_management.payments}
                                credit={store_management.credit}
                                view_complete_info={true}
                                is_admin={isAdmin}
                            />
                        :   (store_management.section==='CALLS')
                            ?
                                <div>
                                    {store_management.calls && store_management.calls.data && store_management.calls.data.length > 0 ? (
                                        store_management.calls.data.map((call, index) => (
                                            <div key={index} style={{padding: '10px', borderBottom: '1px solid #eee'}}>
                                                <p>Llamada #{index + 1}</p>
                                                {/* Aquí puedes agregar más detalles de la llamada */}
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{padding: '20px', textAlign: 'center'}}>No hay llamadas registradas</p>
                                    )}
                                </div>
                            :   (store_management.section==='NOTES')
                                ?
                                    <SectionNotes
                                        notes={store_management.notes}
                                    />
                                :   (store_management.section==='DIRECTIONS')
                                    ?
                                        <SectionDirections />
                                    :   <></>
                }
            </div>
        </div>
    );
}