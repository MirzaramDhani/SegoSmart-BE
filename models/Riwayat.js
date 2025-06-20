module.exports = (sequelize, DataTypes) => {
  const Riwayat = sequelize.define(
    "Riwayat",
    {
      total_temp: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_diskon: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_harga: {
       type: DataTypes.INTEGER,
        allowNull: false,
      }, 
      kepuasan: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      metode: {
        type: DataTypes.CHAR(255),
        allowNull:false
      },
      jenis_pesanan: {
        type: DataTypes.CHAR(255),
        allowNull:false
      }
    },
    {
      freezeTableName: true,
    }
  );

  return Riwayat;
};
