FROM php:8.2-cli-alpine

WORKDIR /var/www/html

RUN apk add --no-cache $PHPIZE_DEPS libzip-dev oniguruma-dev curl-dev \
 && docker-php-ext-install pdo pdo_mysql

COPY . .

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
 && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
 && rm composer-setup.php \
 && composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 8000
CMD ["php","-S","0.0.0.0:8000","-t","public"]

