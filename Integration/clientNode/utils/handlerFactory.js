exports.createOne = async (Model, data) => {
  try {
    const doc = await Model.create(data);
    return doc;
  } catch (err) {
    console.error(err);
  }
};

exports.getOne = async (Model, filter) => {
  try {
    const doc = await Model.findOne(filter);
    return doc;
  } catch (err) {
    console.error(err);
  }
};

exports.getAll = async (Model, filter) => {
  try {
    const docs = await Model.find(filter);
    return docs;
  } catch (err) {
    console.error(err);
  }
};

exports.updateOne = async (Model, filter, data) => {
  try {
    const doc = await Model.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
    });
    return doc;
  } catch (err) {
    console.error(err);
  }
};

exports.updateAll = async (Model, filter, data) => {
  try {
    const doc = await Model.updateMany(filter, data);
    return doc;
  } catch (err) {
    console.error(err);
  }
};

exports.deleteOne = async (Model, filter) => {
  try {
    const doc = await Model.findOneAndDelete(filter);
    return doc;
  } catch (err) {
    console.error(err);
  }
};

exports.deleteAll = async (Model, filter) => {
  try {
    const docs = await Model.deleteMany(filter);
    return docs;
  } catch (err) {
    console.error(err);
  }
};
