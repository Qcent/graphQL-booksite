const { AuthenticationError } = require('apollo-server-express');

const { signToken } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
    Query: {
        // get the information of the logged in user by JWT
        me: async(parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password');

                return userData;
            }
            throw new AuthenticationError('Not logged in!');
        },
        /*
        // get all users
        users: async() => {
            return User.find()
                .select('-__v -password')
                .populate('savedBooks');
        },
        // get a user by username
        user: async(parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('savedBooks');
        },
        */
    },
    Mutation: {
        addUser: async(parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async(parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async(parent, { input }, context) => {
            console.log("saving book: " + input.title);
            //console.dir(input);

            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(context.user._id, { $addToSet: { "savedBooks": input } }, { new: true })
                    .select('-__v -password');

                // lets calc our own bookCount, `cus who knows how to get this one liner of a virtual to fire on this?  
                updatedUser['bookCount'] = updatedUser.savedBooks.length;

                console.log(updatedUser);
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async(parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: bookId } }, { new: true }).populate('savedBooks');

                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },


    }
};

module.exports = resolvers;