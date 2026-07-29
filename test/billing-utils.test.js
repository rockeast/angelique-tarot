import test from 'node:test';
import assert from 'node:assert/strict';

import {
    blocksNewSubscription,
    getSubscriptionUserId,
    hasPremiumAccess,
} from '../billing-utils.js';

test('only active and trialing subscriptions grant premium access', () => {
    assert.equal(hasPremiumAccess('active'), true);
    assert.equal(hasPremiumAccess('trialing'), true);
    assert.equal(hasPremiumAccess('past_due'), false);
    assert.equal(hasPremiumAccess('canceled'), false);
});

test('an existing non-terminal subscription blocks another checkout', () => {
    for (const status of ['active', 'trialing', 'past_due', 'unpaid', 'paused', 'incomplete']) {
        assert.equal(blocksNewSubscription(status), true, status);
    }

    for (const status of ['canceled', 'incomplete_expired', null, undefined]) {
        assert.equal(blocksNewSubscription(status), false, String(status));
    }
});

test('subscription user id is read safely from metadata', () => {
    assert.equal(getSubscriptionUserId({ metadata: { userId: 'user-123' } }), 'user-123');
    assert.equal(getSubscriptionUserId({ metadata: {} }), null);
    assert.equal(getSubscriptionUserId(null), null);
});
