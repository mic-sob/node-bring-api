export type Fetch = typeof globalThis.fetch;
export interface Credentials {
    readonly email: string;
    readonly password: string;
}
export interface BringSession {
    readonly userId: string;
    readonly accessToken: string;
    readonly refreshToken?: string;
    readonly userName?: string;
}
export interface ClientOptions {
    readonly baseUrl?: string;
    readonly fetch?: Fetch;
    readonly apiKey?: string;
    readonly client?: string;
    readonly clientSource?: string;
    readonly country?: string;
}
export interface CreateClientOptions extends ClientOptions {
    readonly session: BringSession;
}
export interface RequestOptions {
    readonly signal?: AbortSignal;
}
export interface ConnectOptions extends ClientOptions, RequestOptions {
}
export interface ShoppingItem {
    readonly specification: string;
    readonly name: string;
}
export interface ShoppingListItems {
    readonly uuid: string;
    readonly status: string;
    readonly purchase: readonly ShoppingItem[];
    readonly recently: readonly ShoppingItem[];
}
export interface ShoppingListSummary {
    readonly listUuid: string;
    readonly name: string;
    readonly theme: string;
}
export interface ShoppingLists {
    readonly lists: readonly ShoppingListSummary[];
}
export interface ItemDetails {
    readonly uuid: string;
    readonly itemId: string;
    readonly listUuid: string;
    readonly userIconItemId: string;
    readonly userSectionId: string;
    readonly assignedTo: string;
    readonly imageUrl: string;
}
export interface ListUser {
    readonly publicUuid: string;
    readonly name: string;
    readonly email: string;
    readonly photoPath: string;
    readonly pushEnabled: boolean;
    readonly plusTryOut: boolean;
    readonly country: string;
    readonly language: string;
}
export interface ListUsers {
    readonly users: readonly ListUser[];
}
export interface UserSetting {
    readonly key: string;
    readonly value: string;
}
export interface UserListSettings {
    readonly listUuid: string;
    readonly usersettings: readonly UserSetting[];
}
export interface UserSettings {
    readonly userSettings: readonly UserSetting[];
    readonly userlistsettings: readonly UserListSettings[];
}
export interface CatalogItem {
    readonly itemId: string;
    readonly name: string;
}
export interface CatalogSection {
    readonly sectionId: string;
    readonly name: string;
    readonly items: readonly CatalogItem[];
}
export interface Catalog {
    readonly language: string;
    readonly catalog: {
        readonly sections: readonly CatalogSection[];
    };
}
export interface PendingInvitations {
    readonly invitations: readonly unknown[];
}
export interface ListInput {
    readonly listId: string;
}
export interface ItemInput extends ListInput {
    readonly name: string;
}
export interface SaveItemInput extends ItemInput {
    readonly specification?: string;
}
export interface ItemImageInput {
    readonly itemId: string;
    readonly imageData: string;
}
export interface ItemImage {
    readonly imageUrl: string;
}
export interface ListsApi {
    getAll(options?: RequestOptions): Promise<ShoppingLists>;
    getItems(input: ListInput, options?: RequestOptions): Promise<ShoppingListItems>;
    getItemDetails(input: ListInput, options?: RequestOptions): Promise<readonly ItemDetails[]>;
    saveItem(input: SaveItemInput, options?: RequestOptions): Promise<void>;
    removeItem(input: ItemInput, options?: RequestOptions): Promise<void>;
    moveItemToRecent(input: ItemInput, options?: RequestOptions): Promise<void>;
    getUsers(input: ListInput, options?: RequestOptions): Promise<ListUsers>;
}
export interface ItemImagesApi {
    save(input: ItemImageInput, options?: RequestOptions): Promise<ItemImage>;
    remove(input: Pick<ItemImageInput, 'itemId'>, options?: RequestOptions): Promise<void>;
}
export interface UserApi {
    getSettings(options?: RequestOptions): Promise<UserSettings>;
}
export interface InvitationsApi {
    getPending(options?: RequestOptions): Promise<PendingInvitations>;
}
export interface BringClient {
    readonly lists: ListsApi;
    readonly itemImages: ItemImagesApi;
    readonly user: UserApi;
    readonly invitations: InvitationsApi;
    getSession(): Readonly<BringSession>;
}
//# sourceMappingURL=types.d.ts.map