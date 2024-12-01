import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { connect } from 'puppeteer-real-browser'

// puppeteer.use(StealthPlugin())


export const scrapeV1 = async (url: string) => {
    const browser = await (puppeteer as any).use(StealthPlugin()).launch({
        headless: false,
        args: ['--enable-javascript']
    });
    try {


        const page = await browser.newPage();



        await page.setRequestInterception(true);
        page.on('request', (request: any) => {
            if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
                request.abort();
            } else {
                request.continue();
            }
        });

        await page.goto(url, {
            waitUntil: 'networkidle0' // Wait until network is idle
        });

        // await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
        await page.waitForSelector('body');

        const structuredContent = await page.evaluate(() => document.body.textContent);


        return structuredContent
    } catch (e) {
        console.log(e)
    } finally {
        await browser.close()
        console.log('browser closed')

    }
}

export const scrape = async (url: string) => {
    const { page } = await (connect as any)({

        headless: 'auto',

        args: [],

        customConfig: {},

        skipTarget: [],

        fingerprint: true,

        turnstile: true,

        connectOption: {}

        // proxy:{
        //     host:'<proxy-host>',
        //     port:'<proxy-port>',
        //     username:'<proxy-username>',
        //     password:'<proxy-password>'
        // }

    })

    await page.setRequestInterception(true);
    page.on('request', (request: any) => {
        if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
            request.abort();
        } else {
            request.continue();
        }
    });

    await page.goto(url, {
        waitUntil: 'networkidle0' // Wait until network is idle
    });

    // await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    await page.waitForSelector('body');

    const structuredContent = await page.evaluate(() => document.body.textContent);


    return structuredContent
}

export const JobPostMessageTemplate = (htmlContent: string): string => {
    return `
        Below is the html content of a job posting:

        ${htmlContent}

        parse the information into the object with the following interface:(if the html content isnt a job posting return empty json)
        
        export interface IJobPost {
            jobTitle: string;
            company: string;
            jobDescription: string;
            jobRequirements: string;
            workingCondition: IWorkingConditions;
            location?: string
        }
        
        interface IWorkingConditions {
            condition: 'hybrid' | 'remote' | "onsite",
            furtherInformation?: string;
        }

        Output strictly in JSON format.
`
}
