const redis = require('redis');
let USE_CACHE = true;
let client = null;

async function connectRedis() {
    try {
        client = redis.createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' });
        await client.connect();
        console.log("✅ Redis detected, cache enabled");
        await client.flushAll();
        console.log("✅ Redis cache cleared");
    } catch (err) {
        console.log("⚠️ Redis not found, cache disabled");
        USE_CACHE = false;
    }    
}

async function getCache(key) {
    if (!client || !USE_CACHE) return null;
    try {
        return await client.get(key);
    } catch (err) {
        console.log("[Redis] getCache error, disabling cache", err);
        USE_CACHE = false;
        return null;
    }
}

async function setCache(key, ttl = 3600, value) {
    if (!client || !USE_CACHE) return;
    try {
        await client.set(key, JSON.stringify(value), { EX: ttl });
    } catch (err) {
        console.log("[Redis] setCache error, disabling cache", err);
        USE_CACHE = false;
    }
}

async function delCache(key) {
    if (!client || !USE_CACHE) return;
    try {
        await client.del(key);
    } catch (err) {
        console.log("[Redis] delCache error, disabling cache", err);
        USE_CACHE = false;
    }
}

module.exports = { USE_CACHE, connectRedis, getCache, setCache, delCache };