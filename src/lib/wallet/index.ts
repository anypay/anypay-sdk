
import { match, P } from 'ts-pattern';

export class Wallet {

    async pay({ uri, currency }: { uri: string, currency: string }): Promise<any>;

    async pay({ uid, currency }: { uid: string, currency: string }): Promise<any>;

    async pay({ template, currency }: { template: any, currency: string }): Promise<any>;

    async pay(params: any): Promise<any> {

        return match(params)
            .with({
                uri: P.string,
                currency: P.string
            }, async ({ uri, currency }) => {
                console.log('pay with uri', uri, currency);
            })
            .with({
                uid: P.string,
                currency: P.string
            }, async ({ uid, currency }) => {
                console.log('pay with uid', uid, currency);
            })
            .with({
                template: P.any,
                currency: P.string
            }, async ({ template, currency }) => {
                console.log('pay with template', template, currency);
            })
            .exhaustive();
            
    }
}