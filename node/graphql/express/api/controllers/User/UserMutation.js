const {
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');
const merge = require('lodash.merge');

const UserType = require('../../models/User/UserType');
const User = require('../../models/User/User');

const updateUser = {
  type: UserType,
  description: 'The mutation that allows you to update an existing User by Id',
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLInt),
    },
    username: {
      name: 'username',
      type: GraphQLString,
    },
    email: {
      name: 'email',
      type: GraphQLString,
    },
  },
  resolve: async (user, { id, username, email }) => {
    const foundUser = await User.findById(id);

    if (!foundUser) {
      throw new Error('User not found');
    }

    const updatedUser = merge(foundUser, {
      username,
      email,
    });

    return foundUser.update(updatedUser);
  },
};

const deleteUser = {
  type: UserType,
  description: 'The mutation that allows you to delete a existing User by Id',
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: (user, { id }) => (
    User
      .delete()
      .where({
        id,
      })
  ),
};

module.exports = {
  updateUser,
  deleteUser,
};
