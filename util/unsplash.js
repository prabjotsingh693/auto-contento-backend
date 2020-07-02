const Unsplash = require('unsplash-js').default;
const {toJson} = require('unsplash-js');
const fetch = require('node-fetch');

global.fetch = fetch;
const unsplash = new Unsplash({ accessKey: "Pr-OYdpGWMMeQwzGBA7aTYWpnKSZbu3CWYiVUH8i7xE" });

const getImages =  async(val) => {
    
    const imagesList = unsplash.search.photos(val, 1, 15).then(toJson).then(json => {
        return json
    })

    return await imagesList
}

module.exports = getImages;