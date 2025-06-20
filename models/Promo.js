
module.exports = (sequelize, DataTypes) => {
  const Promo = sequelize.define(
    "Promo",
    {
      id_menu: {
        type: DataTypes.CHAR(255),
        allowNull: false,
      },
      nama_promo: {
        type: DataTypes.CHAR(255),
        allowNull: false,
      },
      diskon: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      harga_akhir: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      potongan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      freezeTableName: true,
    }
  );
  return Promo;
};
