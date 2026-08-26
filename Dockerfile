FROM php:8.2-apache

# Enable PDO MySQL extension so PHP can talk to the database
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite in case clean URLs are needed later
RUN a2enmod rewrite

# Copy the backend code into the web server's root folder
COPY backend/ /var/www/html/

# Render expects the app to listen on port 10000 by default
RUN sed -i 's/80/10000/' /etc/apache2/ports.conf /etc/apache2/sites-enabled/000-default.conf

EXPOSE 10000
