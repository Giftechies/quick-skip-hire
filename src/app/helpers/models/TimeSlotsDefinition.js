// models/TimeSlotDefinition.js
const mongoose = require('mongoose');

const DAY_ENUM = [
  'sunday','monday','tuesday','wednesday','thursday','friday','saturday'
];

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // "HH:mm" 24-hour strict

const TimeSlotDefinitionSchema = new mongoose.Schema({

  dayOfWeek: { type: String, enum: DAY_ENUM, required: true },

  startTime: { type: String, required: true, match: timeRegex },
  endTime:   { type: String, required: true, match: timeRegex },

  startMinutes: { type: Number, required: true, min: 0, max: 1439 },
  endMinutes:   { type: Number, required: true, min: 1, max: 1440 },

  isActive: { type: Boolean, default: true },

  label: { type: String }

}, { timestamps: true });


// Convert "HH:mm" -> minutes since midnight
function hhmmToMinutes(hhmm) {
  const [hh, mm] = hhmm.split(':').map(Number);
  return hh * 60 + mm;
}


// Pre-validation: Compute minutes + ensure start < end
TimeSlotDefinitionSchema.pre('validate', function(next) {
  try {
    this.startMinutes = hhmmToMinutes(this.startTime);
    this.endMinutes   = hhmmToMinutes(this.endTime);

    if (this.startMinutes >= this.endMinutes) {
      return next(new Error('startTime must be before endTime'));
    }

    next();
  } catch (e) {
    next(e);
  }
});


// Check if this slot overlaps another slot
TimeSlotDefinitionSchema.statics.overlapsExisting = async function({
  dayOfWeek,
  startMinutes,
  endMinutes,
  excludeId = null
}) {
  const query = {
    dayOfWeek,
    isActive: true,

    // Overlap logic:
    // existing.start < new.end AND existing.end > new.start
    startMinutes: { $lt: endMinutes },
    endMinutes:   { $gt: startMinutes }
  };

  if (excludeId) query._id = { $ne: excludeId };

  const found = await this.findOne(query).lean().exec();
  return !!found;
};

// Index for performance
TimeSlotDefinitionSchema.index({ dayOfWeek: 1 });

module.exports = mongoose.model('TimeSlotDefinition', TimeSlotDefinitionSchema);
