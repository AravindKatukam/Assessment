const puppeteer = require('puppeteer');
const fs = require('fs');

async function start() {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto("https://teradek.com/collections/colr");
    await page.setDefaultNavigationTimeout(0);

    const grabUrls = await page.evaluate(()=>{
        let my_urls = document.querySelectorAll(".imagecontainer > a")
        const url_list =[...my_urls]
        const target_urls = url_list.map(h => 'https://teradek.com'+ h.getAttribute('href'))
        return target_urls
    })

    for(const target_url of grabUrls){
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(target_url);
        
        const grabData = await page.evaluate(()=>{
            const Name = document.querySelector("h1")
            const Price = document.querySelector("#current-price")
            const sku = document.querySelector(".sku")
            
            return {
                name : Name.innerText,
                price : Price.innerText,
                sku : sku.innerText 
            }
        })

        
        fs.writeFile("data.json", JSON.stringify(grabData,null,2) +'\n',{flag:"a"}, (err)=>{
            if (err) {
                console.error(err)
                return
            }
            //console.log("Success")
        })
        await browser.close();
    }
    await browser.close();
}

start()
