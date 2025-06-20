module.exports = (sequelize, DataTypes) => {
  const Keranjang = sequelize.define(
    "Keranjang",
    {
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
  return Keranjang;
};
