import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminDashboardController::index
* @see app/Http/Controllers/AdminDashboardController.php:31
* @route '/admin/dashboard'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::index
* @see app/Http/Controllers/AdminDashboardController.php:31
* @route '/admin/dashboard'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::index
* @see app/Http/Controllers/AdminDashboardController.php:31
* @route '/admin/dashboard'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::index
* @see app/Http/Controllers/AdminDashboardController.php:31
* @route '/admin/dashboard'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::index
* @see app/Http/Controllers/AdminDashboardController.php:31
* @route '/admin/dashboard'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::index
* @see app/Http/Controllers/AdminDashboardController.php:31
* @route '/admin/dashboard'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::index
* @see app/Http/Controllers/AdminDashboardController.php:31
* @route '/admin/dashboard'
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
* @see \App\Http\Controllers\AdminDashboardController::toggleVerifyShop
* @see app/Http/Controllers/AdminDashboardController.php:90
* @route '/admin/shops/{id}/verify'
*/
export const toggleVerifyShop = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleVerifyShop.url(args, options),
    method: 'post',
})

toggleVerifyShop.definition = {
    methods: ["post"],
    url: '/admin/shops/{id}/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::toggleVerifyShop
* @see app/Http/Controllers/AdminDashboardController.php:90
* @route '/admin/shops/{id}/verify'
*/
toggleVerifyShop.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleVerifyShop.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::toggleVerifyShop
* @see app/Http/Controllers/AdminDashboardController.php:90
* @route '/admin/shops/{id}/verify'
*/
toggleVerifyShop.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleVerifyShop.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::toggleVerifyShop
* @see app/Http/Controllers/AdminDashboardController.php:90
* @route '/admin/shops/{id}/verify'
*/
const toggleVerifyShopForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleVerifyShop.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::toggleVerifyShop
* @see app/Http/Controllers/AdminDashboardController.php:90
* @route '/admin/shops/{id}/verify'
*/
toggleVerifyShopForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleVerifyShop.url(args, options),
    method: 'post',
})

toggleVerifyShop.form = toggleVerifyShopForm

/**
* @see \App\Http\Controllers\AdminDashboardController::toggleShopPermit
* @see app/Http/Controllers/AdminDashboardController.php:105
* @route '/admin/shops/{id}/permit'
*/
export const toggleShopPermit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleShopPermit.url(args, options),
    method: 'post',
})

toggleShopPermit.definition = {
    methods: ["post"],
    url: '/admin/shops/{id}/permit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::toggleShopPermit
* @see app/Http/Controllers/AdminDashboardController.php:105
* @route '/admin/shops/{id}/permit'
*/
toggleShopPermit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleShopPermit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::toggleShopPermit
* @see app/Http/Controllers/AdminDashboardController.php:105
* @route '/admin/shops/{id}/permit'
*/
toggleShopPermit.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleShopPermit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::toggleShopPermit
* @see app/Http/Controllers/AdminDashboardController.php:105
* @route '/admin/shops/{id}/permit'
*/
const toggleShopPermitForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleShopPermit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::toggleShopPermit
* @see app/Http/Controllers/AdminDashboardController.php:105
* @route '/admin/shops/{id}/permit'
*/
toggleShopPermitForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleShopPermit.url(args, options),
    method: 'post',
})

toggleShopPermit.form = toggleShopPermitForm

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteShop
* @see app/Http/Controllers/AdminDashboardController.php:278
* @route '/admin/shops/{id}'
*/
export const deleteShop = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteShop.url(args, options),
    method: 'delete',
})

deleteShop.definition = {
    methods: ["delete"],
    url: '/admin/shops/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteShop
* @see app/Http/Controllers/AdminDashboardController.php:278
* @route '/admin/shops/{id}'
*/
deleteShop.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteShop.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteShop
* @see app/Http/Controllers/AdminDashboardController.php:278
* @route '/admin/shops/{id}'
*/
deleteShop.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteShop.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteShop
* @see app/Http/Controllers/AdminDashboardController.php:278
* @route '/admin/shops/{id}'
*/
const deleteShopForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteShop.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteShop
* @see app/Http/Controllers/AdminDashboardController.php:278
* @route '/admin/shops/{id}'
*/
deleteShopForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteShop.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteShop.form = deleteShopForm

/**
* @see \App\Http\Controllers\AdminDashboardController::bulkImport
* @see app/Http/Controllers/AdminDashboardController.php:250
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
* @see app/Http/Controllers/AdminDashboardController.php:250
* @route '/admin/shops/bulk-import'
*/
bulkImport.url = (options?: RouteQueryOptions) => {
    return bulkImport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::bulkImport
* @see app/Http/Controllers/AdminDashboardController.php:250
* @route '/admin/shops/bulk-import'
*/
bulkImport.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkImport.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::bulkImport
* @see app/Http/Controllers/AdminDashboardController.php:250
* @route '/admin/shops/bulk-import'
*/
const bulkImportForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkImport.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::bulkImport
* @see app/Http/Controllers/AdminDashboardController.php:250
* @route '/admin/shops/bulk-import'
*/
bulkImportForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkImport.url(options),
    method: 'post',
})

bulkImport.form = bulkImportForm

/**
* @see \App\Http\Controllers\AdminDashboardController::saveSettings
* @see app/Http/Controllers/AdminDashboardController.php:294
* @route '/admin/settings'
*/
export const saveSettings = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveSettings.url(options),
    method: 'post',
})

saveSettings.definition = {
    methods: ["post"],
    url: '/admin/settings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::saveSettings
* @see app/Http/Controllers/AdminDashboardController.php:294
* @route '/admin/settings'
*/
saveSettings.url = (options?: RouteQueryOptions) => {
    return saveSettings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::saveSettings
* @see app/Http/Controllers/AdminDashboardController.php:294
* @route '/admin/settings'
*/
saveSettings.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveSettings.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::saveSettings
* @see app/Http/Controllers/AdminDashboardController.php:294
* @route '/admin/settings'
*/
const saveSettingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveSettings.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::saveSettings
* @see app/Http/Controllers/AdminDashboardController.php:294
* @route '/admin/settings'
*/
saveSettingsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveSettings.url(options),
    method: 'post',
})

saveSettings.form = saveSettingsForm

/**
* @see \App\Http\Controllers\AdminDashboardController::toggleProduct
* @see app/Http/Controllers/AdminDashboardController.php:126
* @route '/admin/products/{id}/toggle'
*/
export const toggleProduct = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleProduct.url(args, options),
    method: 'post',
})

toggleProduct.definition = {
    methods: ["post"],
    url: '/admin/products/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::toggleProduct
* @see app/Http/Controllers/AdminDashboardController.php:126
* @route '/admin/products/{id}/toggle'
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
* @see \App\Http\Controllers\AdminDashboardController::toggleProduct
* @see app/Http/Controllers/AdminDashboardController.php:126
* @route '/admin/products/{id}/toggle'
*/
toggleProduct.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleProduct.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::toggleProduct
* @see app/Http/Controllers/AdminDashboardController.php:126
* @route '/admin/products/{id}/toggle'
*/
const toggleProductForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleProduct.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::toggleProduct
* @see app/Http/Controllers/AdminDashboardController.php:126
* @route '/admin/products/{id}/toggle'
*/
toggleProductForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleProduct.url(args, options),
    method: 'post',
})

toggleProduct.form = toggleProductForm

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteProduct
* @see app/Http/Controllers/AdminDashboardController.php:141
* @route '/admin/products/{id}'
*/
export const deleteProduct = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteProduct.url(args, options),
    method: 'delete',
})

deleteProduct.definition = {
    methods: ["delete"],
    url: '/admin/products/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteProduct
* @see app/Http/Controllers/AdminDashboardController.php:141
* @route '/admin/products/{id}'
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
* @see \App\Http\Controllers\AdminDashboardController::deleteProduct
* @see app/Http/Controllers/AdminDashboardController.php:141
* @route '/admin/products/{id}'
*/
deleteProduct.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteProduct.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteProduct
* @see app/Http/Controllers/AdminDashboardController.php:141
* @route '/admin/products/{id}'
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
* @see \App\Http\Controllers\AdminDashboardController::deleteProduct
* @see app/Http/Controllers/AdminDashboardController.php:141
* @route '/admin/products/{id}'
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

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteReview
* @see app/Http/Controllers/AdminDashboardController.php:157
* @route '/admin/reviews/{id}'
*/
export const deleteReview = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteReview.url(args, options),
    method: 'delete',
})

deleteReview.definition = {
    methods: ["delete"],
    url: '/admin/reviews/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteReview
* @see app/Http/Controllers/AdminDashboardController.php:157
* @route '/admin/reviews/{id}'
*/
deleteReview.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteReview.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteReview
* @see app/Http/Controllers/AdminDashboardController.php:157
* @route '/admin/reviews/{id}'
*/
deleteReview.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteReview.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteReview
* @see app/Http/Controllers/AdminDashboardController.php:157
* @route '/admin/reviews/{id}'
*/
const deleteReviewForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteReview.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteReview
* @see app/Http/Controllers/AdminDashboardController.php:157
* @route '/admin/reviews/{id}'
*/
deleteReviewForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteReview.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteReview.form = deleteReviewForm

/**
* @see \App\Http\Controllers\AdminDashboardController::addCategory
* @see app/Http/Controllers/AdminDashboardController.php:184
* @route '/admin/categories'
*/
export const addCategory = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addCategory.url(options),
    method: 'post',
})

addCategory.definition = {
    methods: ["post"],
    url: '/admin/categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::addCategory
* @see app/Http/Controllers/AdminDashboardController.php:184
* @route '/admin/categories'
*/
addCategory.url = (options?: RouteQueryOptions) => {
    return addCategory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::addCategory
* @see app/Http/Controllers/AdminDashboardController.php:184
* @route '/admin/categories'
*/
addCategory.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addCategory.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::addCategory
* @see app/Http/Controllers/AdminDashboardController.php:184
* @route '/admin/categories'
*/
const addCategoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addCategory.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::addCategory
* @see app/Http/Controllers/AdminDashboardController.php:184
* @route '/admin/categories'
*/
addCategoryForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addCategory.url(options),
    method: 'post',
})

addCategory.form = addCategoryForm

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteCategory
* @see app/Http/Controllers/AdminDashboardController.php:211
* @route '/admin/categories/{id}'
*/
export const deleteCategory = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteCategory.url(args, options),
    method: 'delete',
})

deleteCategory.definition = {
    methods: ["delete"],
    url: '/admin/categories/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteCategory
* @see app/Http/Controllers/AdminDashboardController.php:211
* @route '/admin/categories/{id}'
*/
deleteCategory.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteCategory.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteCategory
* @see app/Http/Controllers/AdminDashboardController.php:211
* @route '/admin/categories/{id}'
*/
deleteCategory.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteCategory.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteCategory
* @see app/Http/Controllers/AdminDashboardController.php:211
* @route '/admin/categories/{id}'
*/
const deleteCategoryForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteCategory.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::deleteCategory
* @see app/Http/Controllers/AdminDashboardController.php:211
* @route '/admin/categories/{id}'
*/
deleteCategoryForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteCategory.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteCategory.form = deleteCategoryForm

/**
* @see \App\Http\Controllers\AdminDashboardController::updateUserRole
* @see app/Http/Controllers/AdminDashboardController.php:233
* @route '/admin/users/{id}/role'
*/
export const updateUserRole = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateUserRole.url(args, options),
    method: 'post',
})

updateUserRole.definition = {
    methods: ["post"],
    url: '/admin/users/{id}/role',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminDashboardController::updateUserRole
* @see app/Http/Controllers/AdminDashboardController.php:233
* @route '/admin/users/{id}/role'
*/
updateUserRole.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateUserRole.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminDashboardController::updateUserRole
* @see app/Http/Controllers/AdminDashboardController.php:233
* @route '/admin/users/{id}/role'
*/
updateUserRole.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateUserRole.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::updateUserRole
* @see app/Http/Controllers/AdminDashboardController.php:233
* @route '/admin/users/{id}/role'
*/
const updateUserRoleForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateUserRole.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminDashboardController::updateUserRole
* @see app/Http/Controllers/AdminDashboardController.php:233
* @route '/admin/users/{id}/role'
*/
updateUserRoleForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateUserRole.url(args, options),
    method: 'post',
})

updateUserRole.form = updateUserRoleForm

const AdminDashboardController = { index, toggleVerifyShop, toggleShopPermit, deleteShop, bulkImport, saveSettings, toggleProduct, deleteProduct, deleteReview, addCategory, deleteCategory, updateUserRole }

export default AdminDashboardController