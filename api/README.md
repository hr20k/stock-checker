## Mysql Settings

```
$ mysql -u root -p
> CREATE TABLE stock;
> CREATE USER stock@localhost IDENTIFIED BY 'stock2019';
> GRANT ALL PRIVILEGES ON `stock`.* TO stock@localhost;
```