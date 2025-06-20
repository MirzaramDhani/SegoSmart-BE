module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define(
    "Menu",
    {
      id_menu: {
        type: DataTypes.CHAR(255),
        allowNull: false,
        primaryKey: true
      },
      nama_menu: {
        type: DataTypes.CHAR(255),
        allowNull: false,
      },
      kategori: {
        type: DataTypes.CHAR(255),
        allowNull: false
      },
      deskripsi:{
        type: DataTypes.TEXT,
        allowNull: false

      },
      gambar: {
        type: DataTypes.TEXT,
        allowNull: false

      },
      harga: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      stok:{
        type: DataTypes.INTEGER,
        allowNull:false
      }
    },
    {
      freezeTableName: true,
    }
  );
  return Menu;
};
