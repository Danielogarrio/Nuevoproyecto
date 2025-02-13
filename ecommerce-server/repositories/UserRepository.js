class UserRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    async getById(id) {
      return await this.dao.findById(id);
    }
  
    async getByEmail(email) {
      return await this.dao.findOne({ email });
    }
  
    async create(userData) {
      return await this.dao.create(userData);
    }
  }

  const UserRepository = require('../repositories/UserRepository');
const User = require('../models/User'); 

const userRepository = new UserRepository(User);
  
  module.exports = UserRepository;
