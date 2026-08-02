import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MarketplaceController::index
* @see app/Http/Controllers/MarketplaceController.php:22
* @route '/'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketplaceController::index
* @see app/Http/Controllers/MarketplaceController.php:22
* @route '/'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketplaceController::index
* @see app/Http/Controllers/MarketplaceController.php:22
* @route '/'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::index
* @see app/Http/Controllers/MarketplaceController.php:22
* @route '/'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MarketplaceController::index
* @see app/Http/Controllers/MarketplaceController.php:22
* @route '/'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::index
* @see app/Http/Controllers/MarketplaceController.php:22
* @route '/'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::index
* @see app/Http/Controllers/MarketplaceController.php:22
* @route '/'
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
* @see \App\Http\Controllers\MarketplaceController::shops
* @see app/Http/Controllers/MarketplaceController.php:69
* @route '/shops'
*/
export const shops = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shops.url(options),
    method: 'get',
})

shops.definition = {
    methods: ["get","head"],
    url: '/shops',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketplaceController::shops
* @see app/Http/Controllers/MarketplaceController.php:69
* @route '/shops'
*/
shops.url = (options?: RouteQueryOptions) => {
    return shops.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketplaceController::shops
* @see app/Http/Controllers/MarketplaceController.php:69
* @route '/shops'
*/
shops.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shops.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::shops
* @see app/Http/Controllers/MarketplaceController.php:69
* @route '/shops'
*/
shops.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: shops.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MarketplaceController::shops
* @see app/Http/Controllers/MarketplaceController.php:69
* @route '/shops'
*/
const shopsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: shops.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::shops
* @see app/Http/Controllers/MarketplaceController.php:69
* @route '/shops'
*/
shopsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: shops.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::shops
* @see app/Http/Controllers/MarketplaceController.php:69
* @route '/shops'
*/
shopsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: shops.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

shops.form = shopsForm

/**
* @see \App\Http\Controllers\MarketplaceController::shopDetail
* @see app/Http/Controllers/MarketplaceController.php:131
* @route '/shops/{id}'
*/
export const shopDetail = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shopDetail.url(args, options),
    method: 'get',
})

shopDetail.definition = {
    methods: ["get","head"],
    url: '/shops/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketplaceController::shopDetail
* @see app/Http/Controllers/MarketplaceController.php:131
* @route '/shops/{id}'
*/
shopDetail.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return shopDetail.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketplaceController::shopDetail
* @see app/Http/Controllers/MarketplaceController.php:131
* @route '/shops/{id}'
*/
shopDetail.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shopDetail.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::shopDetail
* @see app/Http/Controllers/MarketplaceController.php:131
* @route '/shops/{id}'
*/
shopDetail.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: shopDetail.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MarketplaceController::shopDetail
* @see app/Http/Controllers/MarketplaceController.php:131
* @route '/shops/{id}'
*/
const shopDetailForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: shopDetail.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::shopDetail
* @see app/Http/Controllers/MarketplaceController.php:131
* @route '/shops/{id}'
*/
shopDetailForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: shopDetail.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::shopDetail
* @see app/Http/Controllers/MarketplaceController.php:131
* @route '/shops/{id}'
*/
shopDetailForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: shopDetail.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

shopDetail.form = shopDetailForm

/**
* @see \App\Http\Controllers\MarketplaceController::productDetail
* @see app/Http/Controllers/MarketplaceController.php:191
* @route '/products/{id}'
*/
export const productDetail = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productDetail.url(args, options),
    method: 'get',
})

productDetail.definition = {
    methods: ["get","head"],
    url: '/products/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketplaceController::productDetail
* @see app/Http/Controllers/MarketplaceController.php:191
* @route '/products/{id}'
*/
productDetail.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return productDetail.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketplaceController::productDetail
* @see app/Http/Controllers/MarketplaceController.php:191
* @route '/products/{id}'
*/
productDetail.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productDetail.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::productDetail
* @see app/Http/Controllers/MarketplaceController.php:191
* @route '/products/{id}'
*/
productDetail.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productDetail.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MarketplaceController::productDetail
* @see app/Http/Controllers/MarketplaceController.php:191
* @route '/products/{id}'
*/
const productDetailForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: productDetail.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::productDetail
* @see app/Http/Controllers/MarketplaceController.php:191
* @route '/products/{id}'
*/
productDetailForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: productDetail.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::productDetail
* @see app/Http/Controllers/MarketplaceController.php:191
* @route '/products/{id}'
*/
productDetailForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: productDetail.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

productDetail.form = productDetailForm

/**
* @see \App\Http\Controllers\MarketplaceController::map
* @see app/Http/Controllers/MarketplaceController.php:104
* @route '/map'
*/
export const map = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: map.url(options),
    method: 'get',
})

map.definition = {
    methods: ["get","head"],
    url: '/map',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketplaceController::map
* @see app/Http/Controllers/MarketplaceController.php:104
* @route '/map'
*/
map.url = (options?: RouteQueryOptions) => {
    return map.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketplaceController::map
* @see app/Http/Controllers/MarketplaceController.php:104
* @route '/map'
*/
map.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: map.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::map
* @see app/Http/Controllers/MarketplaceController.php:104
* @route '/map'
*/
map.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: map.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MarketplaceController::map
* @see app/Http/Controllers/MarketplaceController.php:104
* @route '/map'
*/
const mapForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: map.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::map
* @see app/Http/Controllers/MarketplaceController.php:104
* @route '/map'
*/
mapForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: map.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::map
* @see app/Http/Controllers/MarketplaceController.php:104
* @route '/map'
*/
mapForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: map.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

map.form = mapForm

const MarketplaceController = { index, shops, shopDetail, productDetail, map }

export default MarketplaceController