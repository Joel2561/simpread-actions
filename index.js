const axios = require( 'axios' );

/**
 * Get now time
 * 
 * @return {string} return now, e.g. 2017年04月03日 11:43:53
 */
function now() {
    const date   = new Date(),
          format = value => value = value < 10 ? '0' + value : value;
    return date.getFullYear() + '/' + format( date.getUTCMonth() + 1 ) + '/' + format( date.getUTCDate() );
}

/**
 * Get Simpread Unreader Daily
 */
function getDaily() {
    const settings = {
        method: 'POST',
        url: 'https://simpread.ksria.cn/api/service/list',
        params: {
            token: process.env.SIMPREAD_TOKEN,
            id: process.env.SIMPREAD_ID,
            filter: 'daily'
        }
    },
    urls = [];

    axios( settings ).then( response => {
        if ( response && response.data.length > 0 ) {
            response.data.forEach( item => {
                urls.push( `[${ item.title }](${ item.url })` );
            });
            urls.length > 0 && sendTelegram( urls );
        } else {

        }
    }).catch( error => {
        console.error( error );
    });
}

/**
 * Send Telegram
 * 
 * @param {array} urls 
 */
function sendTelegram( urls ) {
    const text        = `
▎ 简悦 · 每日回顾 ${ now() }

{{urls}}

来自 [简悦](http://simpread.pro/)`,
    config = {
            url      : 'https://simpread-api-kenshin.vercel.app/api/service/telegram',
            method   : 'post',
            data     : {
                chat : process.env.TELEGRAM_CHAT,
                text : text.replace( '{{urls}}', urls.join( '\n' ))
            }
    };
    axios( config ).then( response => {
        res.json({ status: 201, response });
    }).catch( error => {
        res.json({ status: -1, error });
    });
}

getDaily();