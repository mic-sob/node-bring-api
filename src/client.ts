import { authenticate, DEFAULT_API_URL } from './auth.js';
import { createRequester } from './http.js';
import type {
    BringClient,
    ConnectOptions,
    CreateClientOptions,
    Credentials,
    InvitationsApi,
    ItemDetails,
    ItemImage,
    ItemImagesApi,
    ListsApi,
    ListUsers,
    PendingInvitations,
    ShoppingListItems,
    ShoppingLists,
    UserApi,
    UserSettings
} from './types.js';

const DEFAULT_API_KEY = 'cof4Nc6D8saplXjE3h3HXqHH8m7VU2i1Gs0g85Sp';

function formData(values: Record<string, string>): URLSearchParams {
    return new URLSearchParams(values);
}

export function createBringClient(options: CreateClientOptions): BringClient {
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

    const client: BringClient = {
        lists: Object.freeze<ListsApi>({
            getAll: options =>
                request<ShoppingLists>(`bringusers/${encodeURIComponent(session.userId)}/lists`, {
                    signal: options?.signal
                }),
            getItems: (input, options) =>
                request<ShoppingListItems>(`bringlists/${encodeURIComponent(input.listId)}`, {
                    signal: options?.signal
                }),
            getItemDetails: (input, options) =>
                request<readonly ItemDetails[]>(`bringlists/${encodeURIComponent(input.listId)}/details`, {
                    signal: options?.signal
                }),
            saveItem: async (input, options) => {
                await request<unknown>(`bringlists/${encodeURIComponent(input.listId)}`, {
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
                await request<unknown>(`bringlists/${encodeURIComponent(input.listId)}`, {
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
                await request<unknown>(`bringlists/${encodeURIComponent(input.listId)}`, {
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
            getUsers: (input, options) =>
                request<ListUsers>(`bringlists/${encodeURIComponent(input.listId)}/users`, {
                    signal: options?.signal
                })
        }),
        itemImages: Object.freeze<ItemImagesApi>({
            save: (input, options) =>
                request<ItemImage>(`bringlistitemdetails/${encodeURIComponent(input.itemId)}/image`, {
                    method: 'PUT',
                    signal: options?.signal,
                    body: formData({ imageData: input.imageData })
                }),
            remove: async (input, options) => {
                await request<unknown>(`bringlistitemdetails/${encodeURIComponent(input.itemId)}/image`, {
                    method: 'DELETE',
                    signal: options?.signal
                });
            }
        }),
        user: Object.freeze<UserApi>({
            getSettings: options =>
                request<UserSettings>(`bringusersettings/${encodeURIComponent(session.userId)}`, {
                    signal: options?.signal
                })
        }),
        invitations: Object.freeze<InvitationsApi>({
            getPending: options =>
                request<PendingInvitations>(
                    `bringusers/${encodeURIComponent(session.userId)}/invitations?status=pending`,
                    { signal: options?.signal }
                )
        }),
        getSession: () => session
    };

    return Object.freeze(client);
}

export async function connectBring(credentials: Credentials, options: ConnectOptions = {}): Promise<BringClient> {
    const session = await authenticate(credentials, options);
    return createBringClient({ ...options, session });
}
