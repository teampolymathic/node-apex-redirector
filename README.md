node-apex-redirector
====================

So let's say you host your app on a subdomain over HTTPS. (www.example.com, for example.)

*Problem*: When the user hits https://example.com, you get a security warning.

*Solution*: Spin up a free ec2 instance at your Apex domain and clone this repo onto it.

Setup
-----

```bash
# 1) Set up a free Amazon Linux AMI
# 2) scp your server pem key and server cert to the box (for your apex domain)
scp server.key ec2-user@yourip.com
scp server.crt ec2-user@yourip.com

# 1)
git clone git@github.com:teampolymathic/node-apex-redirector /home/ec2-user

# 2)
sudo mv /home/ec2-user/node-apex-redirector /etc/init.d

# 3) Alias ports so that the node script doesn't have to run as root
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 4433


How it works
------------

The node-apex-redirector service simply keeps a node script up (/home/ec2-user/server.js) which spins up 2 webservers.

The first, on port 8080, which is aliased in iptables to 80,

The second, on port 4433, which is aliased in iptables to 443 (for HTTPS) and uses the certificate files (/home/ec2-user/server.key and /home/ec2-user/server.crt) to encrypt the brief connection.

