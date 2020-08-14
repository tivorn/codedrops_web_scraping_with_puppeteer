const puppeteer = require('puppeteer');
const fs = require('fs');


let scrape = async () => {

    //To load a web browser puppeteer returns a promise, 
    //then await expression is needed
    
    // Launch a Chromium instance
    // Tip: Headless false option configure puppeteer to show up the browser launched
    const browser = await puppeteer.launch();

    // Instatiate Page object
    const page = await browser.newPage();
    // Methods from Page to interact with a single page tab
    // 1. goto: self-explained
    // 2. $$eval implicitly calls Array.from(document.querySelectorAll(selector))
    // Obs: evaluate method is executed inside the browser
    await page.goto('https://loja.minhabiblioteca.com.br/products/categories/679-informatica-e-tecnologia/all/books/list');

    const bookTitle = await page.$$eval('.short_title', titles => 
        titles.map(titles => titles.innerHTML));

    const bookAuthor = await page.$$eval('.sub-title a', authors =>
        authors.map(authors => authors.innerHTML));

    const bookImage = await page.$$eval('.cover img', images =>
        images.map( images => images.src))

    let bookList = bookTitle.map((item, index) => {
        return {
            title: bookTitle[index],
            author: bookAuthor[index],
            image: bookImage[index]
        };
    });

    // Storage data into a local file with fs module
    // Params:
    // 1. file name
    // 2. file configurable options
    // 3. callback error function
        fs.writeFile('books.json', JSON.stringify(bookList, null, 2), err => {
            if(err) throw new Error('something went wrong')

            console.log('well done!')
        })



    await browser.close();
    return bookList
};

scrape().then((value) => {
    console.log(value)
})
