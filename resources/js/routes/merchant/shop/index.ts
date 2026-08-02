import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MerchantController::register
* @see app/Http/Controllers/MerchantController.php:70
* @route '/merchant/shop'
*/
export const register = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

register.definition = {
    methods: ["post"],
    url: '/merchant/shop',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MerchantController::register
* @see app/Http/Controllers/MerchantController.php:70
* @route '/merchant/shop'
*/
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MerchantController::register
* @see app/Http/Controllers/MerchantController.php:70
* @route '/merchant/shop'
*/
register.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MerchantController::register
* @see app/Http/Controllers/MerchantController.php:70
* @route '/merchant/shop'
*/
const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: register.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MerchantController::register
* @see app/Http/Controllers/MerchantController.php:70
* @route '/merchant/shop'
*/
registerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: register.url(options),
    method: 'post',
})

register.form = registerForm

/**
* @see \App\Http\Controllers\MerchantController::update
* @see app/Http/Controllers/MerchantController.php:124
* @route '/merchant/shop'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/merchant/shop',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MerchantController::update
* @see app/Http/Controllers/MerchantController.php:124
* @route '/merchant/shop'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MerchantController::update
* @see app/Http/Controllers/MerchantController.php:124
* @route '/merchant/shop'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MerchantController::update
* @see app/Http/Controllers/MerchantController.php:124
* @route '/merchant/shop'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MerchantController::update
* @see app/Http/Controllers/MerchantController.php:124
* @route '/merchant/shop'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const shop = {
    register: Object.assign(register, register),
    update: Object.assign(update, update),
}

export default shop