import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MerchantController::dashboard
* @see app/Http/Controllers/MerchantController.php:26
* @route '/merchant/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/merchant/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MerchantController::dashboard
* @see app/Http/Controllers/MerchantController.php:26
* @route '/merchant/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MerchantController::dashboard
* @see app/Http/Controllers/MerchantController.php:26
* @route '/merchant/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MerchantController::dashboard
* @see app/Http/Controllers/MerchantController.php:26
* @route '/merchant/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MerchantController::dashboard
* @see app/Http/Controllers/MerchantController.php:26
* @route '/merchant/dashboard'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MerchantController::dashboard
* @see app/Http/Controllers/MerchantController.php:26
* @route '/merchant/dashboard'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MerchantController::dashboard
* @see app/Http/Controllers/MerchantController.php:26
* @route '/merchant/dashboard'
*/
dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboard.form = dashboardForm

/**
* @see \App\Http\Controllers\MerchantController::registerShop
* @see app/Http/Controllers/MerchantController.php:70
* @route '/merchant/shop'
*/
export const registerShop = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registerShop.url(options),
    method: 'post',
})

registerShop.definition = {
    methods: ["post"],
    url: '/merchant/shop',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MerchantController::registerShop
* @see app/Http/Controllers/MerchantController.php:70
* @route '/merchant/shop'
*/
registerShop.url = (options?: RouteQueryOptions) => {
    return registerShop.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MerchantController::registerShop
* @see app/Http/Controllers/MerchantController.php:70
* @route '/merchant/shop'
*/
registerShop.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registerShop.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MerchantController::registerShop
* @see app/Http/Controllers/MerchantController.php:70
* @route '/merchant/shop'
*/
const registerShopForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: registerShop.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MerchantController::registerShop
* @see app/Http/Controllers/MerchantController.php:70
* @route '/merchant/shop'
*/
registerShopForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: registerShop.url(options),
    method: 'post',
})

registerShop.form = registerShopForm

/**
* @see \App\Http\Controllers\MerchantController::updateShop
* @see app/Http/Controllers/MerchantController.php:124
* @route '/merchant/shop'
*/
export const updateShop = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateShop.url(options),
    method: 'put',
})

updateShop.definition = {
    methods: ["put"],
    url: '/merchant/shop',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MerchantController::updateShop
* @see app/Http/Controllers/MerchantController.php:124
* @route '/merchant/shop'
*/
updateShop.url = (options?: RouteQueryOptions) => {
    return updateShop.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MerchantController::updateShop
* @see app/Http/Controllers/MerchantController.php:124
* @route '/merchant/shop'
*/
updateShop.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateShop.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MerchantController::updateShop
* @see app/Http/Controllers/MerchantController.php:124
* @route '/merchant/shop'
*/
const updateShopForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateShop.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MerchantController::updateShop
* @see app/Http/Controllers/MerchantController.php:124
* @route '/merchant/shop'
*/
updateShopForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateShop.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateShop.form = updateShopForm

/**
* @see \App\Http\Controllers\MerchantController::addProduct
* @see app/Http/Controllers/MerchantController.php:159
* @route '/merchant/products'
*/
export const addProduct = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addProduct.url(options),
    method: 'post',
})

addProduct.definition = {
    methods: ["post"],
    url: '/merchant/products',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MerchantController::addProduct
* @see app/Http/Controllers/MerchantController.php:159
* @route '/merchant/products'
*/
addProduct.url = (options?: RouteQueryOptions) => {
    return addProduct.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MerchantController::addProduct
* @see app/Http/Controllers/MerchantController.php:159
* @route '/merchant/products'
*/
addProduct.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addProduct.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MerchantController::addProduct
* @see app/Http/Controllers/MerchantController.php:159
* @route '/merchant/products'
*/
const addProductForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addProduct.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MerchantController::addProduct
* @see app/Http/Controllers/MerchantController.php:159
* @route '/merchant/products'
*/
addProductForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addProduct.url(options),
    method: 'post',
})

addProduct.form = addProductForm

/**
* @see \App\Http\Controllers\MerchantController::toggleProduct
* @see app/Http/Controllers/MerchantController.php:215
* @route '/merchant/products/{id}/toggle'
*/
export const toggleProduct = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleProduct.url(args, options),
    method: 'put',
})

toggleProduct.definition = {
    methods: ["put"],
    url: '/merchant/products/{id}/toggle',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MerchantController::toggleProduct
* @see app/Http/Controllers/MerchantController.php:215
* @route '/merchant/products/{id}/toggle'
*/
toggleProduct.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleProduct.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MerchantController::toggleProduct
* @see app/Http/Controllers/MerchantController.php:215
* @route '/merchant/products/{id}/toggle'
*/
toggleProduct.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleProduct.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MerchantController::toggleProduct
* @see app/Http/Controllers/MerchantController.php:215
* @route '/merchant/products/{id}/toggle'
*/
const toggleProductForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleProduct.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MerchantController::toggleProduct
* @see app/Http/Controllers/MerchantController.php:215
* @route '/merchant/products/{id}/toggle'
*/
toggleProductForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleProduct.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggleProduct.form = toggleProductForm

/**
* @see \App\Http\Controllers\MerchantController::deleteProduct
* @see app/Http/Controllers/MerchantController.php:233
* @route '/merchant/products/{id}'
*/
export const deleteProduct = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteProduct.url(args, options),
    method: 'delete',
})

deleteProduct.definition = {
    methods: ["delete"],
    url: '/merchant/products/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MerchantController::deleteProduct
* @see app/Http/Controllers/MerchantController.php:233
* @route '/merchant/products/{id}'
*/
deleteProduct.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteProduct.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MerchantController::deleteProduct
* @see app/Http/Controllers/MerchantController.php:233
* @route '/merchant/products/{id}'
*/
deleteProduct.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteProduct.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MerchantController::deleteProduct
* @see app/Http/Controllers/MerchantController.php:233
* @route '/merchant/products/{id}'
*/
const deleteProductForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteProduct.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MerchantController::deleteProduct
* @see app/Http/Controllers/MerchantController.php:233
* @route '/merchant/products/{id}'
*/
deleteProductForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteProduct.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteProduct.form = deleteProductForm

const MerchantController = { dashboard, registerShop, updateShop, addProduct, toggleProduct, deleteProduct }

export default MerchantController