import request from "../utils/request";

interface ProjectFilters {
    user_id?: string | null
    project_id?: string | null
    date_range?: [string, string] | null
}

export const getProjectsPage = async (
    page: number,
    pageSize: number,
    filters: ProjectFilters
) => {
    const params: any = { page, page_size: pageSize }

    if (filters.user_id) params.user_id = filters.user_id
    if (filters.project_id) params.project_id = filters.project_id
    if (filters.date_range) {
        params.start_time = filters.date_range[0]
        params.end_time = filters.date_range[1]
    }

    return request.get('/projects', { params })
}
