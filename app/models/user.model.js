module.exports = (mongoose) =>
  mongoose.model(
    "user",
    mongoose.Schema(
      {
        // username: String,
        // password: String,
        // name: String,
        // telephone: String,
        userid: String,
        password: String,
        name: String,
        phone: String,
        birth: String,
        address: String,
      },
      { timestamps: true }
    )
  );
