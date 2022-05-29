const fs = require("fs");
const { capitalizeWord, pluralizeWord } = require("./helper");

const createZeroTime = async (connection, table) => {
  connection.connect();
  /** Generates SQL command from builder methods. */
  const createSqlCommand = (select, where) => {
    const selectCmd =
      select.length === 0
        ? `SELECT * FROM ${table}`
        : select
            .reduce((prev, curr, index) => {
              return prev
                .concat(index !== 0 && index !== select.length - 1 ? ", " : "")
                .concat(` ${select[index]}`);
            }, `SELECT`)
            .concat(` FROM ${table}`);

    return where
      .reduce((prev, curr, index) => {
        return prev
          .concat(index === 0 ? " WHERE" : "")
          .concat(index !== 0 ? " AND" : "")
          .concat(` ${where[index]}`);
      }, selectCmd)
      .concat(";");
  };

  const addFromCsv = (connection, file) => {
    connection.query(
      {
        sql:
          `LOAD DATA LOCAL INFILE '${file}' INTO TABLE pet ` +
          "FIELDS TERMINATED BY ',' " +
          "LINES TERMINATED BY '\n';",
        infileStreamFactory: () => fs.createReadStream(file),
      },
      (error, results, fields) => {
        if (error) throw error;
      }
    );
  };

  const describe = (connection, table) => {
    return new Promise((resolve, reject) => {
      const fields = [];
      connection.query(`DESCRIBE ${table};`, (error, results, _fields) => {
        if (error) reject({ error });
        results.forEach((res) => fields.push(res.Field));
        resolve(results);
      });
    });
  };

  /** Initialize zeroTime object,  */
  const zeroTime = {
    add: () => null,
    addFromCsv: (file) => addFromCsv(connection, file),
    clauses: {
      select: [],
      where: [],
    },
    connection,
    describe: () => describe(connection, table),
    fields: [],
    fieldNames: [],
    find: () => {
      const {
        clauses: { select, where },
      } = zeroTime;
      const cmd = createSqlCommand(select, where);

      return new Promise((resolve, reject) => {
        connection.query(cmd, (error, results, fields) => {
          if (error) reject({ error });
          resolve(results);
        });
      });
    },
    kill: () => connection.end(),
    table,
  };

  /** Generate where/get methods dynamically */
  try {
    const fields = await describe(connection, table);
    zeroTime.fields.push(fields);
    fields.forEach(({ Field: field }) => {
      //generate where
      const whereFunctionName = `where${capitalizeWord(field)}`;
      var whereFunction = (str) => {
        zeroTime.clauses.where.push(`${field}='${str}'`);
        return zeroTime;
      };
      zeroTime[whereFunctionName] = whereFunction;
      zeroTime.fieldNames.push(whereFunctionName);

      //generate select
      const selectFunctionName = `get${capitalizeWord(field)}`;
      var selectFunction = () => {
        zeroTime.clauses.select.push(field);
        return zeroTime;
      };
      zeroTime[selectFunctionName] = selectFunction;
      zeroTime.fieldNames.push(selectFunctionName);
    });
  } catch (error) {
    return { error };
  }
  return zeroTime;
};

module.exports = createZeroTime
