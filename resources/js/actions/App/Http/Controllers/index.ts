import MarketplaceController from './MarketplaceController'
import ReviewController from './ReviewController'
import MerchantController from './MerchantController'
import AdminDashboardController from './AdminDashboardController'
import Settings from './Settings'

const Controllers = {
    MarketplaceController: Object.assign(MarketplaceController, MarketplaceController),
    ReviewController: Object.assign(ReviewController, ReviewController),
    MerchantController: Object.assign(MerchantController, MerchantController),
    AdminDashboardController: Object.assign(AdminDashboardController, AdminDashboardController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers