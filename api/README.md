## Development Mysql Settings

```
$ mysql -u root -p
> CREATE TABLE stock;
> CREATE USER stock@localhost IDENTIFIED BY 'stock2019';
> GRANT ALL PRIVILEGES ON `stock`.* TO stock@localhost;
```

## EC2 Setup

```
$ sudo yum update -y
$ sudo timedatectl set-timezone Asia/Tokyo
$ sudo localectl set-locale LANG=ja_JP.UTF-8
$ sudo localectl set-keymap jp106
$ curl -L git.io/nodebrew | perl - setup
$ vim .bash_profile
export PATH=$HOME/.nodebrew/current/bin:$PATH

$ source .bash_profile
$ nodebrew install v10.17.0
$ nodebrew use v10.17.0

$ sudo yum -y install gcc curl-devel expat-devel gettext-devel openssl-devel zlib-devel perl-ExtUtils-MakeMaker autoconf git

$ sudo yum remove mariadb-libs
$ sudo rm -rf /var/lib/mysql
$ sudo yum install -y https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
$ sudo yum-config-manager --disable mysql80-community
$ sudo yum-config-manager --enable mysql57-community
$ sudo yum install -y mysql-community-client
$ sudo amazon-linux-extras install nginx1
$ sudo systemctl enable nginx
$ sudo systemctl start nginx

$ sudo visudo
Defaults    secure_path = /sbin:/bin:/usr/sbin:/usr/bin:/usr/local/bin
#上記を下記に変更
Defaults    secure_path = /sbin:/bin:/usr/sbin:/usr/bin:/usr/local/bin:/home/ec2-user/.nodebrew/current/bin/

$ sudo su -
$ cd /opt
$ git clone https://github.com/hr20k/stock-checker.git
$ chown -R ec2-user:ec2-user stock-checker/
$ cd stock-checker/api
$ cp nginx.conf /etc/nginx/nginx.conf
$ nginx -s reload
$ npm install pm2 -g
$ npm install --unsafe-perm
$ vi config/production.json
#下記のような設定を記述
{
  "db": {
    "client": "mysql",
    "connection": {
      "host": "xxx",
      "user": "xxx",
      "password": "xxx",
      "database": "stock",
      "charset": "utf8mb4"
    }
  },
  "aws": {
    "s3": {
      "region": "ap-northeast-1",
      "bucketName": "xxx"
    }
  },
  "jwt": {
    "secretKey": "",
    "option": { "session": false },
    "expire": "12h"
  }
}

$ pm2 start ecosystem.json --env production
$ pm2 startup amazon
$ pm2 save
$ chkconfig --list
```
