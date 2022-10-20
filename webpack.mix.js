const mix = require('laravel-mix');
mix
    .sass('assets/scss/styles.scss', '.')
    .setPublicPath('public/dist');