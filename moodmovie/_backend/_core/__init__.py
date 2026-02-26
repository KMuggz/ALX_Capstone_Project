import pymysql

# inject PyMySQL to replace the missing mysqlclient headers
pymysql.install_as_MySQLdb()

# spoof the version to satisfy Django's internal check
pymysql.version_info = (2, 2, 1, 'final', 0)