import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import shop from './shop'
import products from './products'
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

const merchant = {
    dashboard: Object.assign(dashboard, dashboard),
    shop: Object.assign(shop, shop),
    products: Object.assign(products, products),
}

export default merchant