const request = require("request");
const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const fs = require('fs');
const { Parser } = require('json2csv');

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
        //seleccionar el último link de la paginación
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
        //Seleccionar las empresas y sacar data
        for (let url of paginationArray) {
            response = await requestPromise(url);
            $ = await cheerio.load(response);
            $('div[class="card-body"] > a').each(function() {
                empresasArray.push($(this).attr('href'))
            });
            //break;
        }

        console.log(
            `Empresas ARRAY has ${empresasArray.length} LINKS to scrape`
        );

        //Scrape data
        for (let url of empresasArray) {
            response = await requestPromise(url);
            $ = await cheerio.load(response);
            let title = $('div[class="card-header"] > h1').text();
            let description = $('#page > div > div > div.col-lg-8.my-2 > div > div.card-body > div > div.col-md-8.my-2')
                .text()
                .trim();

            let phone = $('#page > div > div > div.col-lg-4.my-2 > div > div > p:nth-child(2)')
                .text()
                .trim();

            let email = $('#page > div > div > div.col-lg-4.my-2 > div > div > p:nth-child(3)')
                .text()
                .trim();

            let webpage = $('#page > div > div > div.col-lg-4.my-2 > div > div > p:nth-child(4)')
                .text()
                .trim();

            resultObject.push({
                titulo: title,
                telefono: phone,
                correo: email,
                pagina: webpage,
                descripcion: description
            });

            let data = JSON.stringify(resultObject);
            fs.writeFileSync('resultObject.json', data);
            console.log(`${title} scraped OK`);

        }

        //Transformar data a CSV
        //Declaramos los campos
        const fields = ["titulo", "telefono", "correo", "pagina", "descripcion"];
        //Nueva instancia del Parser de json2csv
        const json2csvParser = new Parser({
            fields: fields,
            defaultValue: "No info",
        });
        //Transformacion
        const csv = json2csvParser.parse(resultObject);
        fs.writeFileSync(`./results.csv`, csv, "utf-8");
        console.log("DONE json2csv");

    } catch (error) {
        console.error(error);
    }
})();