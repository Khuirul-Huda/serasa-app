import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import shops from './shops'
import settings from './settings'
import products from './products'
import reviews from './reviews'
import categories from './categories'
import users from './users'
import articles from './articles'
/**
* @see \App\Http\Controllers\AdminDashboardController::dashboard
* @see app/Http/Controllers/AdminDashboardController.php:32
* @route '/admin/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::dashboard
* @see app/Http/Controllers/AdminDashboardController.php:32
* @route '/admin/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::dashboard
* @see app/Http/Controllers/AdminDashboardController.php:32
* @route '/admin/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::dashboard
* @see app/Http/Controllers/AdminDashboardController.php:32
* @route '/admin/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::dashboard
* @see app/Http/Controllers/AdminDashboardController.php:32
* @route '/admin/dashboard'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::dashboard
* @see app/Http/Controllers/AdminDashboardController.php:32
* @route '/admin/dashboard'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::dashboard
* @see app/Http/Controllers/AdminDashboardController.php:32
* @route '/admin/dashboard'
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

const admin = {
    dashboard: Object.assign(dashboard, dashboard),
    shops: Object.assign(shops, shops),
    settings: Object.assign(settings, settings),
    products: Object.assign(products, products),
    reviews: Object.assign(reviews, reviews),
    categories: Object.assign(categories, categories),
    users: Object.assign(users, users),
    articles: Object.assign(articles, articles),
}

export default admin