export const PREMIUM_SUBSCRIPTION_STATUSES = new Set(['active', 'trialing']);

// These statuses still represent an existing subscription and must not be
// allowed to create a second recurring charge for the same account.
export const EXISTING_SUBSCRIPTION_STATUSES = new Set([
    'active',
    'trialing',
    'past_due',
    'unpaid',
    'paused',
    'incomplete',
]);

export function hasPremiumAccess(status) {
    return PREMIUM_SUBSCRIPTION_STATUSES.has(status);
}

export function blocksNewSubscription(status) {
    return EXISTING_SUBSCRIPTION_STATUSES.has(status);
}

export function getSubscriptionUserId(subscription) {
    return subscription?.metadata?.userId || null;
}
