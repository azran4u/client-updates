# uninstall
dpkg -l | grep postgres
sudo apt-get --purge remove postgresql postgresql-13 postgresql-client-13 postgresql-common postgresql-client-common postgresql-contrib

# install
# go to https://www.postgresql.org/download/linux/ubuntu/
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql

# change password
sudo -u postgres psql postgres
ALTER USER postgres with encrypted password 'postgres';

# check
sudo systemctl restart postgresql.service && sudo systemctl status postgresql.service && pg_lsclusters

