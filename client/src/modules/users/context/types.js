/**
 * @typedef {import('@lib/api/types').User} User
 * @typedef {import('@lib/api/types').UserInput} UserInput
 */

/**
 * Everything the users feature shares. UI state (search, layout, the selected
 * user, the add-modal) and server state (the list + the create/save/delete
 * actions, which own their toasts and selection side-effects) live here, so the
 * feature's components read what they need instead of receiving it through props.
 * Genuinely local state — a form's draft fields, a dialog's phase — stays in the
 * component that owns it.
 * @typedef {object} UsersContextValue
 * @property {string} searchQuery
 * @property {(value: string) => void} setSearchQuery
 * @property {'table' | 'cards'} areaLayout
 * @property {(layout: 'table' | 'cards') => void} setAreaLayout
 * @property {User[]} users               the full list
 * @property {User[]} filtered            the list after the search filter
 * @property {number} count               total users
 * @property {number} cityCount           distinct city/state pairs
 * @property {boolean} isPending
 * @property {boolean} isError
 * @property {Error | null} error
 * @property {User | null} selected       the user shown in the drawer
 * @property {(user: User) => void} select
 * @property {() => void} clearSelected
 * @property {boolean} modalOpen
 * @property {() => void} openModal
 * @property {() => void} closeModal
 * @property {(input: UserInput) => Promise<User>} createUser   toasts on success; throws on failure
 * @property {boolean} creating
 * @property {(id: string, fields: Partial<UserInput>) => Promise<User>} saveUser   toasts + updates selection; throws on failure
 * @property {boolean} saving
 * @property {(user: User) => Promise<void>} deleteUser   toasts + clears selection; throws on failure
 * @property {boolean} deleting
 */

export {};
