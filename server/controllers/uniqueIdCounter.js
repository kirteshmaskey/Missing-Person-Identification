const { Counter } = require("../models/uniqueCounter");

const getCounterValue = async (user) => {
  const counterData = await Counter.findOne({ _id: user });
  let counter;

  if (counterData === null) {
    counter = 1001;
    const newCounter = new Counter({
      _id: user,
      uniqueId: counter,
    });
    await newCounter.save();
  } else {
    counter = Number(counterData.uniqueId) + 1;
    const id = { _id: user };
    const updatedData = {
      $set: { uniqueId: counter },
    };
    await Counter.updateOne(id, updatedData);
  }
  return counter;
};

module.exports = getCounterValue;