import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ArticleController::index
* @see app/Http/Controllers/ArticleController.php:15
* @route '/articles'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/articles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleController::index
* @see app/Http/Controllers/ArticleController.php:15
* @route '/articles'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::index
* @see app/Http/Controllers/ArticleController.php:15
* @route '/articles'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleController::index
* @see app/Http/Controllers/ArticleController.php:15
* @route '/articles'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleController::index
* @see app/Http/Controllers/ArticleController.php:15
* @route '/articles'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleController::index
* @see app/Http/Controllers/ArticleController.php:15
* @route '/articles'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleController::index
* @see app/Http/Controllers/ArticleController.php:15
* @route '/articles'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\ArticleController::show
* @see app/Http/Controllers/ArticleController.php:49
* @route '/articles/{slug}'
*/
export const show = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/articles/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleController::show
* @see app/Http/Controllers/ArticleController.php:49
* @route '/articles/{slug}'
*/
show.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slug: args }
    }

    if (Array.isArray(args)) {
        args = {
            slug: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
    }

    return show.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::show
* @see app/Http/Controllers/ArticleController.php:49
* @route '/articles/{slug}'
*/
show.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleController::show
* @see app/Http/Controllers/ArticleController.php:49
* @route '/articles/{slug}'
*/
show.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleController::show
* @see app/Http/Controllers/ArticleController.php:49
* @route '/articles/{slug}'
*/
const showForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleController::show
* @see app/Http/Controllers/ArticleController.php:49
* @route '/articles/{slug}'
*/
showForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleController::show
* @see app/Http/Controllers/ArticleController.php:49
* @route '/articles/{slug}'
*/
showForm.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

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

const ArticleController = { index, show, store, update, destroy, togglePublish }

export default ArticleController