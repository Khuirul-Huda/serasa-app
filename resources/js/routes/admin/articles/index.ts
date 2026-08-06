import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ArticleController::store
* @see app/Http/Controllers/ArticleController.php:66
* @route '/admin/articles'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/articles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ArticleController::store
* @see app/Http/Controllers/ArticleController.php:66
* @route '/admin/articles'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::store
* @see app/Http/Controllers/ArticleController.php:66
* @route '/admin/articles'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleController::store
* @see app/Http/Controllers/ArticleController.php:66
* @route '/admin/articles'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleController::store
* @see app/Http/Controllers/ArticleController.php:66
* @route '/admin/articles'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ArticleController::update
* @see app/Http/Controllers/ArticleController.php:101
* @route '/admin/articles/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/articles/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ArticleController::update
* @see app/Http/Controllers/ArticleController.php:101
* @route '/admin/articles/{id}'
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
* @see \App\Http\Controllers\ArticleController::update
* @see app/Http/Controllers/ArticleController.php:101
* @route '/admin/articles/{id}'
*/
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ArticleController::update
* @see app/Http/Controllers/ArticleController.php:101
* @route '/admin/articles/{id}'
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
* @see \App\Http\Controllers\ArticleController::update
* @see app/Http/Controllers/ArticleController.php:101
* @route '/admin/articles/{id}'
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

/**
* @see \App\Http\Controllers\ArticleController::destroy
* @see app/Http/Controllers/ArticleController.php:138
* @route '/admin/articles/{id}'
*/
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/articles/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ArticleController::destroy
* @see app/Http/Controllers/ArticleController.php:138
* @route '/admin/articles/{id}'
*/
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::destroy
* @see app/Http/Controllers/ArticleController.php:138
* @route '/admin/articles/{id}'
*/
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ArticleController::destroy
* @see app/Http/Controllers/ArticleController.php:138
* @route '/admin/articles/{id}'
*/
const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleController::destroy
* @see app/Http/Controllers/ArticleController.php:138
* @route '/admin/articles/{id}'
*/
destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\ArticleController::togglePublish
* @see app/Http/Controllers/ArticleController.php:146
* @route '/admin/articles/{id}/toggle-publish'
*/
export const togglePublish = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: togglePublish.url(args, options),
    method: 'post',
})

togglePublish.definition = {
    methods: ["post"],
    url: '/admin/articles/{id}/toggle-publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ArticleController::togglePublish
* @see app/Http/Controllers/ArticleController.php:146
* @route '/admin/articles/{id}/toggle-publish'
*/
togglePublish.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return togglePublish.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::togglePublish
* @see app/Http/Controllers/ArticleController.php:146
* @route '/admin/articles/{id}/toggle-publish'
*/
togglePublish.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: togglePublish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleController::togglePublish
* @see app/Http/Controllers/ArticleController.php:146
* @route '/admin/articles/{id}/toggle-publish'
*/
const togglePublishForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: togglePublish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleController::togglePublish
* @see app/Http/Controllers/ArticleController.php:146
* @route '/admin/articles/{id}/toggle-publish'
*/
togglePublishForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: togglePublish.url(args, options),
    method: 'post',
})

togglePublish.form = togglePublishForm

const articles = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    togglePublish: Object.assign(togglePublish, togglePublish),
}

export default articles