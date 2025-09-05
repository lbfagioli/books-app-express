const redis = require('redis');
let client = null;

(async () => {
    try {
        client = redis.createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' });
        await client.connect();
        console.log("✅ Redis detected, cache enabled");
        await client.flushAll();
        console.log("✅ Redis cache cleared");
    } catch (err) {
        console.log("❌ Redis not found, running without cache");
        client = null;
    }
})();
async function getCache(key) {
    if (!client) return null;
    return await client.get(key);
}

async function setCache(key, ttl = 3600, value) {
    if (!client) return;
    await client.set(key, JSON.stringify(value), { EX: ttl });
}

async function delCache(key) {
    if (!client) return;
    await client.del(key);
}

module.exports = { getCache, setCache, delCache };