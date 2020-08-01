module.exports = {
    mongoUri: process.env.MONGODB_URI || "mongodb+srv://akshada:akshada@cluster0.nrgp3.gcp.mongodb.net/test?retryWrites=true&w=majority",
    PORT: process.env.PORT || 5000,
}