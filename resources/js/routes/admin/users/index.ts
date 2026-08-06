import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminDashboardController::role
* @see app/Http/Controllers/AdminDashboardController.php:463
* @route '/admin/users/{id}/role'
*/
export const role = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: role.url(args, options),
    method: 'post',
})

role.definition = {
    methods: ["post"],
    url: '/admin/users/{id}/role',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::role
* @see app/Http/Controllers/AdminDashboardController.php:463
* @route '/admin/users/{id}/role'
*/
role.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return role.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::role
* @see app/Http/Controllers/AdminDashboardController.php:463
* @route '/admin/users/{id}/role'
*/
role.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: role.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::role
* @see app/Http/Controllers/AdminDashboardController.php:463
* @route '/admin/users/{id}/role'
*/
const roleForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: role.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::role
* @see app/Http/Controllers/AdminDashboardController.php:463
* @route '/admin/users/{id}/role'
*/
roleForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: role.url(args, options),
    method: 'post',
})

role.form = roleForm

/**
* @see \App\Http\Controllers\AdminDashboardController::store
* @see app/Http/Controllers/AdminDashboardController.php:324
* @route '/admin/users'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::store
* @see app/Http/Controllers/AdminDashboardController.php:324
* @route '/admin/users'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::store
* @see app/Http/Controllers/AdminDashboardController.php:324
* @route '/admin/users'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::store
* @see app/Http/Controllers/AdminDashboardController.php:324
* @route '/admin/users'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::store
* @see app/Http/Controllers/AdminDashboardController.php:324
* @route '/admin/users'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const users = {
    role: Object.assign(role, role),
    store: Object.assign(store, store),
}

export default users