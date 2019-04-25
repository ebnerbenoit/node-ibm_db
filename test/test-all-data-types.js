var common = require("./common")
    , ibmdb = require("../")
    , assert = require("assert")
    , cn = common.connectionString;

const expectedData =
[ { C1: 1,
    C2: 2,
    C3: '456736789',
    C4: 1234,
    C5: '67',
    C6: '5689',
    C7: 56.239,
    C8: 34567890,
    C9: '45.234',
    C10: 'bimal     ',
    C11: 'kumar',
    C12: '50',
    C13: 'jha123456',
    C14: '2015-09-10',
    C15: '10:16:33',
    C16: '2015-09-10 10:16:33.770139',
    C17: 'abc',
    C18: true } ];

ibmdb.open(cn, function(err, conn) {
  if(err) console.log(err);
  assert.equal(err, null);

  try {
    conn.querySync("drop table mytab1");
  } catch (e) {}
  conn.querySync("create table mytab1 (c1 int, c2 SMALLINT, c3 BIGINT, c4 INTEGER, c5 DECIMAL(3), c6 NUMERIC, c7 float, c8 double, c9 decfloat, c10 char(10), c11 varchar(10), c12 char for bit data, c13 clob(10), c14 date, c15 time, c16 timestamp, c17 blob(10), c18 boolean) ccsid unicode");
  conn.querySync("insert into mytab1 values (1, 2, 456736789, 1234, 67.98, 5689, 56.2390, 34567890, 45.234, 'bimal', 'kumar', '\x50', 'jha123456', '2015-09-10', '10:16:33', '2015-09-10 10:16:33.770139', BLOB(x'616263'), true)");
  conn.query("select * from mytab1", function(err, data) {
      if(err) console.log(err);
      else {
        console.log("Data1 = ", data);
      }
      assert.deepEqual(data, expectedData);

      conn.querySync("delete from mytab1");
      var blobParam = {DataType: "BLOB", Data: new Buffer('abc')};
      err = conn.querySync("insert into mytab1 values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [1, 2, 456736789, 1234, 67.98, 5689, 56.2390, 34567890,
          45.234, 'bimal', 'kumar', '\x50', 'jha123456', '2015-09-10',
          '10:16:33', '2015-09-10 10:16:33.770139', blobParam, true]);
      if(err.length) { console.log("Err = ", err); }
      else {
        data = conn.querySync("select * from mytab1");
        console.log("Data2 = ", data);
        assert.deepEqual(data, expectedData);
      }
      conn.querySync("drop table mytab1");
      conn.closeSync();
  });
});
