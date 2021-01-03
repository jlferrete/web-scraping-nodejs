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
        const pageNumber = parseInt(
            $('ul.pagination > li').last().prev().find('a').text()
        );
        for (let i = 0; i < pageNumber; i++) {
            if (paginationArray.length === 0) {
                paginationArray.push(
                    'https://chileservicios.com/industrias/tecnologias-de-la-informacion/'
                );
            } else {
                paginationArray.push(
                    `https://chileservicios.com/industrias/tecnologias-de-la-informacion/page/${i+1}`
                );
            }
        }

        console.log(
            `Pagination ARRAY has ${paginationArray.length} LINKS to scrape`
        );

        console.log(paginationArray);


        //seleccionar el último link de la paginación



    } catch (error) {
        console.error(error);
    }
})();