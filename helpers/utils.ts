import https from "https";
import {ClientRequest} from "http";
import {serialize} from "cookie";
import {Cookie} from "next-auth/core/lib/cookie";
import type {NextApiResponse} from 'next';
import {Types, Ydb} from "ydb-sdk";
import {COLUMN_NAME_TOKEN, PRIMARY_KEY_TOKEN} from "../lib/decorators/column.decorators";
import {TABLE_NAME_TOKEN} from "../lib/decorators/entity.decorator";


interface Cookies {
    [Key: string]: { Value: string, Domain: string, Path: string, Expires: Date };
}

// export function getHost(req: NextApiRequest) {
//     const proto: string = req.headers["x-forwarded-proto"] ? "https" : "http";
//     const host: string = `${proto}://${req.headers.host}${req.url?.split('?')[0]}`;
// }

export function checkStatus(options: https.RequestOptions, data?: any): Promise<{ code: number | undefined, redirect: string | undefined }> {
    return new Promise((resolve, reject) => {
        if (data) {
            data = JSON.stringify(data);
            if (!options.headers)
                options.headers = {}
            options.headers['Content-Length'] = data.length;
            options.headers['Content-Type'] = 'application/json';
        }
        const req: ClientRequest = https.request(options, (res) => {
            resolve({code: res.statusCode, redirect: res.headers['location']});
        });

        req.on('error', (err) => {
            throw err;
        });
        if (data)
            req.write(data);
        req.end();
    });
}

export function setCookie(res: NextApiResponse, cookie: Cookie) {
    // Preserve any existing cookies that have already been set in the same session
    let setCookieHeader = res.getHeader("Set-Cookies") ?? [];
    // If not an array (i.e. a string with a single cookie) convert it into an array
    // if(!setCookieHeader)
    //     throw new Error("");
    if (!Array.isArray(setCookieHeader)) {
        setCookieHeader = [setCookieHeader.toString()];
    }
    const {name, value, options} = cookie;
    const cookieHeader = serialize(name, value, options);
    setCookieHeader.push(cookieHeader);
    res.setHeader("Set-Cookies", setCookieHeader);
}

export function redirect(res: NextApiResponse, url: string, cookies?: Cookie[]) {
    if (cookies)
        cookies.forEach((cookie) => setCookie(res, cookie));
    res.status(301).redirect(url);
}


export function getHost() {
    // If we detect a Vercel environment, we can trust the host
    // if (process.env.VERCEL) return forwardedHost
    // If `NEXTAUTH_URL` is `undefined` we fall back to "http://localhost:3000"
    // return process.env.NEXTAUTH_URL
    return process.env.VERCEL_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}


export const camelToSnakeCase = (str: string) =>
    str.replace(/^[A-Z]/g, letter => letter.toLowerCase())
        .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);


export function typeToString(type: Ydb.IType) {
    return Ydb.Type.PrimitiveTypeId[type.typeId ?? 0]
}

export function getEntityProperty(entity: any, property: string | symbol): string[] {
    return Reflect.ownKeys(entity).filter((key) => {
        return typeof key === 'string' && Reflect.hasMetadata(property, entity, key);
    }) as any;
}

export function sameMembers(arr1: any[], arr2: any[]): Boolean {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    return arr1.every(item => set2.has(item)) &&
        arr2.every(item => set1.has(item))
}

export function getTableName(entity: any) {

    return camelToSnakeCase(Reflect.getMetadata(TABLE_NAME_TOKEN, entity.constructor) ?? entity.constructor.name);
}

export function getColumnName(entity: any, key: string) {

    return camelToSnakeCase(Reflect.getMetadata(COLUMN_NAME_TOKEN, entity.constructor, key) ?? key);
}