'use strict'
const dayjs = require('dayjs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const processStateSchema = new Schema({
  date: {
    unique: true,
    type: Date,
    default: dayjs().startOf('day').toDate()
  },
  batchCode: {
    type: Number,
    default: 0,
  },
})

processStateSchema.statics.initProcessState = async function() {
  const newProcessState = await ProcessState.findOneAndUpdate(
    {date: dayjs().startOf('day').toDate()},
    {
      $inc: { batchCode: 1 }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    })
  return newProcessState
}

processStateSchema.statics.getProcessState = async function() {
  const processState = await ProcessState.findOne(
    {date: dayjs().startOf('day').toDate()}).select()
  return processState
}

processStateSchema.query.filter = function(str) {
  let filter = 'date batchCode -_id'
  if(str) {
    filter = str
  }
  return this.select(filter)
}

// Defines a pre hook for the document.
processStateSchema.pre('save', function(next) {

  next()
})

// 参数User 数据库中的集合名称, 不存在会创建.
const ProcessState = mongoose.model('process_state', processStateSchema)

module.exports = ProcessState
