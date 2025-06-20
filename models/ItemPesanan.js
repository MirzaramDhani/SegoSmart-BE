module.exports = (sequelize, DataTypes) => {
  const ItemPesanan = sequelize.define(
    "ItemPesanan",
    {
      id_riwayat: {
        type: DataTypes.CHAR(255),
        allowNull: false
      },
      id_menu: {
        type: DataTypes.CHAR(255),
        allowNull: false,
      },
      jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sub_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      diskon: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return ItemPesanan;
};
