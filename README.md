node-apex-redirector
====================

So let's say you host your app on a subdomain over HTTPS. (www.example.com, for example.)

*Problem*: When the user hits https://example.com, you get a security warning.

*Solution*: Spin up a free ec2 instance at your Apex domain and clone this repo onto it.

Setup locally first
-------------------

```bash
# 1) Set up a free Amazon Linux AMI
# 2) scp your server pem key and server cert to the box (for your apex domain)
scp server.key ec2-user@yourip.com
scp server.crt ec2-user@yourip.com

Setup on your instance
----------------------

# 0) Install node (if not present)

# 1) Download the repo flatly to /home/ec2-user
curl -JOLk https://github.com/teampolymathic/node-apex-redirector/archive/master.zip && unzip node-apex-redirector-master.zip && mv node-apex-redirector-master/* . && rm -rf node-apex-redirector-master*

# 2) Edit the server script to add your domain
# (change example.com to your)
vim server.js

# 3) Move the service into initscripts
sudo mv /home/ec2-user/node-apex-redirector /etc/init.d

# 4) Alias HTTP ports so that the node script doesn't have to run as root
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 4433

# 5) Install express
npm install express --save

# 6) Start the service
sudo service node-apex-redirector start
```

How it works
------------

The node-apex-redirector service simply keeps a node script up (`/home/ec2-user/server.js`) which spins up 2 webservers.

The first, on port 8080, which is aliased in iptables to 80,

The second, on port 4433, which is aliased in iptables to 443 (for HTTPS) and uses the certificate files (`/home/ec2-user/server.key` and `/home/ec2-user/server.crt`) to encrypt the brief connection.

Issues
------

Locked? run the following command: `sudo rm /var/lock/subsys/node-server`
