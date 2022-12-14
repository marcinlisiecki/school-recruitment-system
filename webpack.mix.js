const mix = require('laravel-mix');
mix
    .js('assets/js/main.js', '.')
    .js('assets/js/schoolSelector.jsx', '.')
    .react()
    .sass('assets/scss/styles.scss', '.')
    .setPublicPath('public/dist');