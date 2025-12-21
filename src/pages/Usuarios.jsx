import { useEffect, useRef, useState } from "react";
import CardUsuarios from "../components/CardUsuarios/CardUsuarios";
import CardEditUser from "../components/CardEditUser/CardEditUser";
import Loader from "../components/Loader/loader";
import useFetch from "../hooks/useFetch";

export default function Usuarios(){

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
                console.log('API Response:', data);
                // Manejar estructura de respuesta paginada
                if (data.result && data.result.data && Array.isArray(data.result.data)) {
                    setUsers(data.result.data);
                } else if (Array.isArray(data)) {
                    setUsers(data);
                } else if (data.data && Array.isArray(data.data)) {
                    setUsers(data.data);
                } else {
                    console.error('Formato de respuesta inesperado:', data);
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
        <div className="pageUsuarios" ref={content_users}>

            <div className="pageUsuarios__access">
                <button onClick={() => setShowCreateModal(true)}>
                    Agregar usuario
                </button>

                {
                    (new_change)
                    ?
                        <button
                            className="pageUsuarios__saveChanges"
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

                                    alert('Permisos actualizados correctamente');
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

            <div className="pageUsuarios__head">
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