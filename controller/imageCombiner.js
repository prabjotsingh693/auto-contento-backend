// const keywordExtractor = require("keyword-extractor");
const WordPOS = require("wordpos");

const unsplash = require("../util/unsplash");
const HttpError = require("../modal/http-error");

wordpos = new WordPOS();

const imageCombiner = (req, res, next) => {
  const { payload } = req.body;
  const data = JSON.parse(payload);
  const arryOfNouns = [];
  let tittle;
  let summary;

  if (data.length !== 0) {
    const templateId = "EBnMmzhMu";
    let counter = 0;

    data.map((val) => {
      tittle = val.title.trim().replace(/ /g, "%20");
      summary = val.summary.trim().replace(/ /g, "%20");

      wordpos.getNouns(val.summary, (result) => {
        counter++;
        arryOfNouns.push(...result);
        try {
          callbackNouns(arryOfNouns, counter);
        } catch (err) {
          console.log("err", err);
        }
      });
    });
    const callbackNouns = (result, index) => {
      if (data.length === index) {
        callbackImages(result.join(" "));
      }
    };

    const callbackImages = async (payload) => {
        let images;
        try{
          images = await unsplash(payload)
        }
        catch (er){
          const error = new HttpError("error while getting images", 500);
          return next(error);
        }

        
        const ogImages = images.results.map(val=>{ 
          const obj = {}
          obj["fullImg"] = `https://ssfy.sh/chrisvxd/og-impact@15fb26ce/image?&template=${templateId}&Title=${tittle}&Subtitle=${summary}&oRiEnT=center&urlImg=${val.urls.full}`;
          obj["thumImg"] = `https://ssfy.sh/chrisvxd/og-impact@15fb26ce/image?&template=${templateId}&Title=${tittle}&Subtitle=${summary}&oRiEnT=center&urlImg=${val.urls.thumb}`; 
          return obj
        })

        return  res.status(200).json({ imgs: ogImages });
    };
  }else {
    res.status(200).json({ imgs: "no images" });
  }
};

exports.imageCombiner = imageCombiner;
