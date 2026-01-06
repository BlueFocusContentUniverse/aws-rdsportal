import request from "../utils/request";
export const getProjectsPage = async (page, pageSize, filters) => {
    const params = { page, page_size: pageSize };
    if (filters.user_id)
        params.user_id = filters.user_id;
    if (filters.project_id)
        params.project_id = filters.project_id;
    if (filters.date_range) {
        params.start_time = filters.date_range[0];
        params.end_time = filters.date_range[1];
    }
    return request.get('/projects/list', { params });
};
