const request = require("request");
const requestPromise = require("request-promise");
const cheerio = require("cheerio");

//Arrays

let empresasArray = [];
let paginationArray = [];
let resultObject = [];

//Function

(async() => {
    try {
        //get request para traernos el html
        let response = await requestPromise('https://chileservicios.com/industrias/tecnologias-de-la-informacion/');
        let $ = cheerio.load(response);
        const title = $("title").text();
        console.log(title);
        //seleccionar el último link de la paginación



    } catch (error) {
        console.error(error);
    }
})();