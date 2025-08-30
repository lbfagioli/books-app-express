const { Client } = require('@opensearch-project/opensearch');
let client = null;

(async () => {
    try {
        client = new Client({ node: process.env.SEARCH_URL || 'http://opensearch:9200' });
        await client.ping();
        console.log("✅ OpenSearch detected, search enabled");
    } catch (err) {
        console.log("❌ OpenSearch not found, running without search");
        client = null;
    }
})();

//TODO: UPDATE FUNCTIONS TO MATCH WITH HOW WE STRUCTURE DB DATA

async function indexBook(book) {
    if (!client) return;
    await client.index({
        index: 'books',
        id: book._id.toString(),
        body: { title: book.title, summary: book.summary }
    });
}

async function indexReview(bookId, review) {
    if (!client) return;
    await client.index({
        index: 'reviews',
        id: review._id.toString(),
        body: { bookId, reviewText: review.reviewText }
    });
}

async function searchBooks(query) {
    if (!client) return [];
    const { body } = await client.search({
        index: 'books',
        body: {
            query: {
                multi_match: {
                    query,
                    fields: ['title', 'summary']
                }
            }
        }
    });
    return body.hits.hits.map(hit => hit._source);
}

module.exports = { indexBook, indexReview, searchBooks };
