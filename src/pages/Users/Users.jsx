import { useEffect, useRef, useState } from "react";
import CardUsuarios from "../../components/CardUsuarios/CardUsuarios";
import CardEditUser from "../../components/CardEditUser/CardEditUser";
import Loader from "../../components/Loader/loader";
import BackButton from "../../components/BackButton/BackButton";
import useFetch from "../../hooks/useFetch";
import "./Users.css";
import sendpush from "../../helpers/sendpush";

export default function Users(){

    const { fetchWithAuth } = useFetch();
    const [users,setUsers]=useState([]);
    const content_users=useRef();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [new_change,setNewChange]=useState(false);
    const [loading,setLoading]=useState(true);

    const loadUsers = () => {
        fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/users`)
            .then((response) => response.json())
            .then((data) => {
                if (data.result && data.result.data && Array.isArray(data.result.data)) {
                    setUsers(data.result.data);
                } else if (Array.isArray(data)) {
                    setUsers(data);
                } else if (data.data && Array.isArray(data.data)) {
                    setUsers(data.data);
                } else {
                    setUsers([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                setUsers([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(()=>{
        loadUsers();
    },[]);

    if(loading) return <Loader/>

    return (
        <div className="Users" ref={content_users}>
            <BackButton>
                <button className="Users__addButton" onClick={() => setShowCreateModal(true)}>
                    Agregar usuario
                </button>
            </BackButton>

            <div className="Users__access">

                {
                    (new_change)
                    ?
                        <button
                            className="Users__saveChanges"
                            onClick={async (e)=>{
                                e.target.textContent = 'Guardando...';
                                e.target.disabled = true;

                                try {
                                    const usuarios = document.getElementsByClassName('CardUsuarios');
                                    const usuariosArray = Array.from(usuarios);

                                    for (const usuario of usuariosArray) {
                                        const id = usuario.children[0].dataset.id;
                                        const roleSelect = usuario.children[3].querySelector('select');
                                        const newRole = roleSelect ? roleSelect.value : usuario.children[3].textContent;

                                        await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/users/edit/${id}`, {
                                            method: 'PUT',
                                            body: new URLSearchParams({
                                                role: newRole
                                            })
                                        });
                                    }

                                    sendpush({
                                        title: 'Éxito',
                                        message: 'Permisos actualizados correctamente',
                                        type: 'Push--sucessful',
                                        timeout: 5000
                                    });
                                    
                                    setNewChange(false);

                                } catch (error) {
                                    alert('Error al actualizar permisos');
                                } finally {
                                    e.target.textContent = 'Guardar cambios';
                                    e.target.disabled = false;
                                }
                            }}
                        >Guardar cambios</button>
                    :   <></>
                }

            </div>

            <div className="Users__head">
                <p>ID</p>
                <p>Nombre</p>
                <p>Correo electrónico</p>
                <p>Perfil</p>
                <p>Permisos</p>
                <p>Acciones</p>
            </div>

            {
                users.length > 0 ? (
                    users.map((user, index) => (
                        <CardUsuarios
                            key={user.id || index}
                            id={user.id}
                            name={user.name}
                            email={user.username}
                            rol={user.role}
                            extension={user.extension}
                            phone={user.phone}
                            permission={user.permission}
                            setChange={setNewChange}
                            onUserUpdated={loadUsers}
                        />
                    ))
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        No hay usuarios registrados
                    </div>
                )
            }

            {showCreateModal && (
                <CardEditUser
                    user={null}
                    onClose={() => setShowCreateModal(false)}
                    onSave={() => {
                        loadUsers();
                        setShowCreateModal(false);
                    }}
                />
            )}

        </div>
    );
}
