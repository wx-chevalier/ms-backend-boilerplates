const {
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');
const merge = require('lodash.merge');

const NoteType = require('../../models/Note/NoteType');
const Note = require('../../models/Note/Note');

const createNote = {
  type: NoteType,
  description: 'The mutation that allows you to create a new Note',
  args: {
    userId: {
      name: 'userId',
      type: new GraphQLNonNull(GraphQLInt),
    },
    note: {
      name: 'note',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (value, { userId, note }) => (
    Note.create({
      userId,
      note,
    })
  ),
};

const updateNote = {
  type: NoteType,
  description: 'The mutation that allows you to update an existing Note by Id',
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLInt),
    },
    userId: {
      name: 'userId',
      type: new GraphQLNonNull(GraphQLInt),
    },
    note: {
      name: 'note',
      type: GraphQLString,
    },
  },
  resolve: async (value, { id, userId, note }) => {
    const foundNote = await Note.findById(id);

    if (!foundNote) {
      throw new Error('Note not found');
    }

    const updatedNote = merge(foundNote, {
      userId,
      note,
    });

    return foundNote.update(updatedNote);
  },
};

const deleteNote = {
  type: NoteType,
  description: 'The mutation that allows you to delete a existing Note by Id',
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: (value, { id }) => (
    Note
      .delete()
      .where({
        id,
      })
  ),
};

module.exports = {
  createNote,
  updateNote,
  deleteNote,
};
