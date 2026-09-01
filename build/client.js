import { authenticate, DEFAULT_API_URL } from './auth.js';
import { createRequester } from './http.js';
const DEFAULT_API_KEY = 'cof4Nc6D8saplXjE3h3HXqHH8m7VU2i1Gs0g85Sp';
function formData(values) {
    return new URLSearchParams(values);
}
export function createBringClient(options) {
    const session = Object.freeze({ ...options.session });
    const request = createRequester({
        baseUrl: options.baseUrl ?? DEFAULT_API_URL,
        fetch: options.fetch,
        headers: {
            authorization: `Bearer ${session.accessToken}`,
            'x-bring-user-uuid': session.userId,
            'x-bring-api-key': options.apiKey ?? DEFAULT_API_KEY,
            'x-bring-client': options.client ?? 'webApp',
            'x-bring-client-source': options.clientSource ?? 'webApp',
            'x-bring-country': options.country ?? 'DE'
        }
    });
    const client = {
        lists: Object.freeze({
            getAll: options => request(`bringusers/${encodeURIComponent(session.userId)}/lists`, {
                signal: options?.signal
            }),
            getItems: (input, options) => request(`bringlists/${encodeURIComponent(input.listId)}`, {
                signal: options?.signal
            }),
            getItemDetails: (input, options) => request(`bringlists/${encodeURIComponent(input.listId)}/details`, {
                signal: options?.signal
            }),
            saveItem: async (input, options) => {
                await request(`bringlists/${encodeURIComponent(input.listId)}`, {
                    method: 'PUT',
                    signal: options?.signal,
                    body: formData({
                        purchase: input.name,
                        recently: '',
                        specification: input.specification ?? '',
                        remove: '',
                        sender: 'null'
                    })
                });
            },
            removeItem: async (input, options) => {
                await request(`bringlists/${encodeURIComponent(input.listId)}`, {
                    method: 'PUT',
                    signal: options?.signal,
                    body: formData({
                        purchase: '',
                        recently: '',
                        specification: '',
                        remove: input.name,
                        sender: 'null'
                    })
                });
            },
            moveItemToRecent: async (input, options) => {
                await request(`bringlists/${encodeURIComponent(input.listId)}`, {
                    method: 'PUT',
                    signal: options?.signal,
                    body: formData({
                        purchase: '',
                        recently: input.name,
                        specification: '',
                        remove: '',
                        sender: 'null'
                    })
                });
            },
            getUsers: (input, options) => request(`bringlists/${encodeURIComponent(input.listId)}/users`, {
                signal: options?.signal
            })
        }),
        itemImages: Object.freeze({
            save: (input, options) => request(`bringlistitemdetails/${encodeURIComponent(input.itemId)}/image`, {
                method: 'PUT',
                signal: options?.signal,
                body: formData({ imageData: input.imageData })
            }),
            remove: async (input, options) => {
                await request(`bringlistitemdetails/${encodeURIComponent(input.itemId)}/image`, {
                    method: 'DELETE',
                    signal: options?.signal
                });
            }
        }),
        user: Object.freeze({
            getSettings: options => request(`bringusersettings/${encodeURIComponent(session.userId)}`, {
                signal: options?.signal
            })
        }),
        invitations: Object.freeze({
            getPending: options => request(`bringusers/${encodeURIComponent(session.userId)}/invitations?status=pending`, { signal: options?.signal })
        }),
        getSession: () => session
    };
    return Object.freeze(client);
}
export async function connectBring(credentials, options = {}) {
    const session = await authenticate(credentials, options);
    return createBringClient({ ...options, session });
}
//# sourceMappingURL=client.js.map