import { readFileSync } from "fs";
import axios from 'axios';
const geoip = require('geoip-lite');

// fuck off typescript
declare global {
    interface String {
        replace_fr(target: string, replacement: string): string;
    }
}

interface Currency {
    code: string;
    currency: {
        symbol: string,
    };
    language: {
        code: string,
    };
}

String.prototype.replace_fr = function (target: string, replacement: string): string {
    const pattern = new RegExp('(?<![\'"`])\\b' + target + '\\b(?!["\'`])', 'g');
    
    return this.replace(pattern, replacement);
}

const currencies = JSON.parse(readFileSync('./src/utils/currencies.json', 'utf-8'))

async function get_currency() {
    const { country } = await get_country();
    const currency = currencies.find((el: Currency) => el.code === country)

    return currency.currency.symbol;
}

async function get_country() {
    const response = await axios.get('https://api64.ipify.org?format=json');
    const ip = response.data.ip;
    const geo = await geoip.lookup(ip);

    return geo;
}

export async function transcribe(code: string) {
    const currency = await get_currency();

    return code
        .replace_fr(";", '!')
        .replace_fr("be", '=')
        .replace_fr("this", 'let')
        .replace_fr("mf", 'const')
        .replace_fr("print", 'println')
        .replace_fr("fake", 'null')
        .replace_fr("nah", '!=')
        .replace_fr("fr", '==')
        .replace_fr("and", '&&')
        .replace_fr("or", '|')
        .replace_fr("function", 'fn')
        .replace_fr("nerd", 'math')
        .replace_fr("nocap", 'true')
        .replace_fr("cap", 'false')
        .replace_fr("fuck_around", 'try')
        .replace_fr("find_out", 'catch')
        .replace_fr("exec", 'exec')
        .replace_fr("yap", 'input')
        .replace(/\: number/g, '')
        .replace(/\: string/g, '')
        .replace(/\: object/g, '')
        .replace(/\: boolean/g, '')
        .replace(new RegExp(`${currency}{}`), '${}')
}
