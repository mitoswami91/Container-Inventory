import { environment } from "../../../../environments/environment.development";

export const Constant = {
    BASE_URL: environment.endpoint.base_url,
    AUTH: 'auth',
    ADD_CONTAINER: 'container/save',
    VIEW_CONTAINER_BY_USER_ID: 'container/findbyuserid',
    VIEW_ALL_CONTAINER: 'container/all'
}