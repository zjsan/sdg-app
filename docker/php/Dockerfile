FROM php:8.3-fpm

WORKDIR /var/www/laravel

# set timezone
ENV TZ=Asia/Manila
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# install dependencies
RUN apt-get update \
    && apt-get install -y curl zip unzip git \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# install composer
RUN php -r "readfile('https://getcomposer.org/installer');" \
    | php -- --install-dir=/usr/bin/ --filename=composer

# create non-root user
RUN groupadd -g 1000 www \
    && useradd -u 1000 -ms /bin/bash -g www www

USER www

CMD ["php-fpm"]
