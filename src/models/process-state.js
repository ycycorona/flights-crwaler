'use strict'
const dayjs = require('dayjs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const processStateSchema = new Schema({
  name: {
    type: String,
  },
  date: {
    unique: true,
    type: Date,
    default: dayjs().startOf('day').toDate()
  },
  batchCode: {
    type: Number,
    default: 0
  },
})

// Defines a pre hook for the document.
processStateSchema.pre('save', function(next) {

  next()
})

// 参数User 数据库中的集合名称, 不存在会创建.
const ProcessState = mongoose.model('process_state', processStateSchema)

module.exports = ProcessState
