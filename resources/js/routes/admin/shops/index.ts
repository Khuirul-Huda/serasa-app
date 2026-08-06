import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminDashboardController::verify
* @see app/Http/Controllers/AdminDashboardController.php:110
* @route '/admin/shops/{id}/verify'
*/
export const verify = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(args, options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/admin/shops/{id}/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::verify
* @see app/Http/Controllers/AdminDashboardController.php:110
* @route '/admin/shops/{id}/verify'
*/
verify.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return verify.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::verify
* @see app/Http/Controllers/AdminDashboardController.php:110
* @route '/admin/shops/{id}/verify'
*/
verify.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::verify
* @see app/Http/Controllers/AdminDashboardController.php:110
* @route '/admin/shops/{id}/verify'
*/
const verifyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verify.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::verify
* @see app/Http/Controllers/AdminDashboardController.php:110
* @route '/admin/shops/{id}/verify'
*/
verifyForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verify.url(args, options),
    method: 'post',
})

verify.form = verifyForm

/**
* @see \App\Http\Controllers\AdminDashboardController::permit
* @see app/Http/Controllers/AdminDashboardController.php:125
* @route '/admin/shops/{id}/permit'
*/
export const permit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: permit.url(args, options),
    method: 'post',
})

permit.definition = {
    methods: ["post"],
    url: '/admin/shops/{id}/permit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::permit
* @see app/Http/Controllers/AdminDashboardController.php:125
* @route '/admin/shops/{id}/permit'
*/
permit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return permit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::permit
* @see app/Http/Controllers/AdminDashboardController.php:125
* @route '/admin/shops/{id}/permit'
*/
permit.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: permit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::permit
* @see app/Http/Controllers/AdminDashboardController.php:125
* @route '/admin/shops/{id}/permit'
*/
const permitForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: permit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::permit
* @see app/Http/Controllers/AdminDashboardController.php:125
* @route '/admin/shops/{id}/permit'
*/
permitForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: permit.url(args, options),
    method: 'post',
})

permit.form = permitForm

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteMethod
* @see app/Http/Controllers/AdminDashboardController.php:508
* @route '/admin/shops/{id}'
*/
export const deleteMethod = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/admin/shops/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteMethod
* @see app/Http/Controllers/AdminDashboardController.php:508
* @route '/admin/shops/{id}'
*/
deleteMethod.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteMethod.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteMethod
* @see app/Http/Controllers/AdminDashboardController.php:508
* @route '/admin/shops/{id}'
*/
deleteMethod.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteMethod
* @see app/Http/Controllers/AdminDashboardController.php:508
* @route '/admin/shops/{id}'
*/
const deleteMethodForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteMethod
* @see app/Http/Controllers/AdminDashboardController.php:508
* @route '/admin/shops/{id}'
*/
deleteMethodForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteMethod.form = deleteMethodForm

/**
* @see \App\Http\Controllers\AdminDashboardController::bulkImport
* @see app/Http/Controllers/AdminDashboardController.php:480
* @route '/admin/shops/bulk-import'
*/
export const bulkImport = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkImport.url(options),
    method: 'post',
})

bulkImport.definition = {
    methods: ["post"],
    url: '/admin/shops/bulk-import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::bulkImport
* @see app/Http/Controllers/AdminDashboardController.php:480
* @route '/admin/shops/bulk-import'
*/
bulkImport.url = (options?: RouteQueryOptions) => {
    return bulkImport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::bulkImport
* @see app/Http/Controllers/AdminDashboardController.php:480
* @route '/admin/shops/bulk-import'
*/
bulkImport.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkImport.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::bulkImport
* @see app/Http/Controllers/AdminDashboardController.php:480
* @route '/admin/shops/bulk-import'
*/
const bulkImportForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkImport.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::bulkImport
* @see app/Http/Controllers/AdminDashboardController.php:480
* @route '/admin/shops/bulk-import'
*/
bulkImportForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkImport.url(options),
    method: 'post',
})

bulkImport.form = bulkImportForm

/**
* @see \App\Http\Controllers\AdminDashboardController::store
* @see app/Http/Controllers/AdminDashboardController.php:348
* @route '/admin/shops'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/shops',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::store
* @see app/Http/Controllers/AdminDashboardController.php:348
* @route '/admin/shops'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::store
* @see app/Http/Controllers/AdminDashboardController.php:348
* @route '/admin/shops'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::store
* @see app/Http/Controllers/AdminDashboardController.php:348
* @route '/admin/shops'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::store
* @see app/Http/Controllers/AdminDashboardController.php:348
* @route '/admin/shops'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AdminDashboardController::update
* @see app/Http/Controllers/AdminDashboardController.php:406
* @route '/admin/shops/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/shops/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::update
* @see app/Http/Controllers/AdminDashboardController.php:406
* @route '/admin/shops/{id}'
*/
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::update
* @see app/Http/Controllers/AdminDashboardController.php:406
* @route '/admin/shops/{id}'
*/
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::update
* @see app/Http/Controllers/AdminDashboardController.php:406
* @route '/admin/shops/{id}'
*/
const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::update
* @see app/Http/Controllers/AdminDashboardController.php:406
* @route '/admin/shops/{id}'
*/
updateForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const shops = {
    verify: Object.assign(verify, verify),
    permit: Object.assign(permit, permit),
    delete: Object.assign(deleteMethod, deleteMethod),
    bulkImport: Object.assign(bulkImport, bulkImport),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
}

export default shops