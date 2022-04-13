const express = require('express');
const Parser = require('rss-parser');

const app = express();

const parser = new Parser({
    headers: { 'User-Agent': 'Chrome' },
    customFields: {
        item: [`media:content`],
    }   
});

const pulseFeedUrl = 'https://www.pulse.com.gh/news/rss'

const fetchRssFeed = async (feedUrl) => {
    let feed = await parser.parseURL(feedUrl);
    return feed.items.map(item => {
        return {
            title: item.title,
            image: item['media:content'].$.url,
        }
    });
}

//Routes
app.get('/', (req, res) => {
    const data = { response: "Welcome" }
    res.status(200).json(data)
})

app.get('/api/v1/feed', async (req, res) => {
    await fetchRssFeed(pulseFeedUrl)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                message: 'An error occurred when fetching news'
            })
        })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})