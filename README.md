# zerotime
Contains wrapper methods that help you work with a MySQL database.

## Example Usage

Consider the following *pets* table:

|name   |owner  |species |sex      |birth|death     |
|-------|-------|--------|---------|-----|----------|
|Dread  |Bob    |bird    |\N       |1997-04-11|\N        |
|Scott  |Costas |lion    |\N       |1992-12-09|\N        |
|Pirate |Boson  |lion    |\N       |1980-04-15|\N        |
|Rodgers|Johnson|tiger   |\N       |1991-05-03|\N        |
|Steve  |Roberts|alligator|\N       |2001-11-01|\N        |
|Bushemi|Twizzler|crocodile|\N       |2010-01-03|\N        |

First, get an instance of zerotime:
```
const mysql = require("mysql2");
const createZerotime = require("zerotime");
const connection = mysql.createConnection({
  host: <host>,
  user: <user>,
  password: <your_password>,
  database: <your_database_name>,
});

const zerotime = await createZerotime(connection, <your_table_name>);
```

Methods are automatically created when zerotime is initialized that include your tables fields in them. Consider the following calls below.

### Get all records

`const records = await zerotime.find()`

### Get all records where species type is *lion*:

`const records= await zerotime.getSpecies("lion").find()`

### Get all records where the species is *lion* and name is *Costas*

`const records = await zerotime.getOwner("Costas").getSpecies("lion").find()`

### Add to your database

### Cleaning up

At the end of your program be sure to call the following to end your session:

`zerotime.kill()`