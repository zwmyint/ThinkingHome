const DeviceTable = db.defineTable('Device', {
  columns: {
    Id: db.ColTypes.int(11).notNull().primaryKey().autoIncrement(),
    Name: db.ColTypes.varchar(100).notNull().unique(),
    DisplayName: db.ColTypes.varchar(100),
  },
});

const Device = {
};

module.exports = Device;