const envVariables = {
  // DB configurations
  DB_USER: process.env.DB_USER || "chkxsdpddpovqb",
  DB_PASSWORD:process.env.DB_PASSWORD || "f1fb37c03e585a842508c5184de5dddc0b5ed3e81154d42610ee8dae577bdef1",
  DB_HOST: process.env.DB_HOST || "ec2-54-197-241-96.compute-1.amazonaws.com",
  DB_NAME: process.env.DB_NAME || "dv5n27cotvsdt",
  DB_SSL: process.env.DB_SSL || true,
  DB_PORT: process.env.DB_PORT || 5432,
  DB_MAX_POOL_SIZE: process.env.DB_MAX_POOL_SIZE || "5",
  //server configurations
  SERVER_PORT: process.env.SERVER_PORT || "8086",
  PORT: 8086,
    BODY_LIMIT: "100kb",
    CROS_HEADERS: ["Link"]
};
export default envVariables;
