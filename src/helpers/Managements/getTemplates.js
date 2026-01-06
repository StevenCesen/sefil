export default async function getTemplates(){
    const endpoint = `${import.meta.env.VITE_URL_BASE}/templates${import.meta.env.VITE_GROUP_STATES}&per_page=${import.meta.env.VITE_PER_PAGE_STATES}`;

    const request = await fetch(endpoint,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (request.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
    }

    const response = await request.json();

    const userRole = localStorage.getItem('role');

    if (response && response.result) {
        let templates = Array.isArray(response.result)
            ? response.result
            : (response.result.data || []);

        const filteredTemplates = templates.filter(template => {
            if (!template.roles || template.roles === 'null' || template.roles === null) {
                return false;
            }

            let rolesArray = [];
            try {
                rolesArray = typeof template.roles === 'string'
                    ? JSON.parse(template.roles)
                    : template.roles;
            } catch (e) {
                console.error('Error parsing roles:', e);
                return false;
            }

            if (!rolesArray || rolesArray.length === 0) {
                return false;
            }

            return rolesArray.includes(userRole);
        });

        if (Array.isArray(response.result)) {
            response.result = filteredTemplates;
        } else if (response.result.data) {
            response.result.data = filteredTemplates;
        }
    }

    return response;
}