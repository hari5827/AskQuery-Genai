import { tavily as Tavily } from "@tavily/core"
import { buildCacheKey, getCache, setCache } from "./cache.service.js"

const tavily = Tavily({
    apiKey: process.env.TAVILY_API_KEY,
})


export const searchInternet = async ({ query }) => {
    const cacheKey = buildCacheKey("web-search", [query])

    const cached = await getCache(cacheKey)
    if (cached) {
        console.log("Cache hit for web search:", cacheKey)
        return JSON.stringify(cached)
    }

    const results = await tavily.search(query, {
        maxResults: 5,
    })

    // Short TTL - unlike the PDF answers, search results go stale
    // (news, prices, etc.), so we only save the repeated-API-call cost
    // for queries asked again within the same hour, not forever.
    await setCache(cacheKey, results, 60 * 60)

    return JSON.stringify(results)
}