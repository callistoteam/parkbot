import config
from pypika import Query, Table, Field
import mysql.connector

mydb = mysql.connector.connect(
  host=config.host,
  user=config.user,
  password=config.password,
  database=config.database
)

mycursor = mydb.cursor()

def getUserData(id):
    users = Table('users')
    q = Query.from_(users).select('*').where(
        users.id == id
    )

    mycursor.execute(str(q).replace('"', '`'))

    myresult = mycursor.fetchone()

    if not myresult:
        return

    el = []

    for x in myresult:
        el.append(x)

    return {'premium': el[1], 'blacklist': el[3], 'color': el[4], 'point': el[5], 'pointtime': el[6], 'log': el[8]}
