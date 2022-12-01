const mix = require('laravel-mix');
mix
    .js('assets/js/main.js', '.')
    .sass('assets/scss/styles.scss', '.')
    .setPublicPath('public/dist');