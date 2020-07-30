const Koa = require( 'koa' );
const app = new Koa();
const Router = require( 'koa-router' );
const fs = require('fs');
const path = require('path');
const router = new Router();

router.get( '/record', ( ctx, next ) => {
    ctx.response.body = fs.createReadStream(path.resolve(__dirname, '../lib/index.js'), 'utf8');;
    ctx.response.type = 'javascript';
} );

app
    .use( router.routes() )
    .use( router.allowedMethods() )

app.listen( 4001 );