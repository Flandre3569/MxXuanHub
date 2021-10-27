const connection = require('../app/database');

class AuthService {
  async checkResource(tableName, id, userId) {
    try {
      const statement = `SELECT * FROM ${tableName} WHERE id = ? AND user_id = ?;`;
      const [result] = await connection.execute(statement, [id, userId]);
      return result.length === 0 ? false : true;
      
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new AuthService();