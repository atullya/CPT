import mongoose, { Schema } from 'mongoose';

const jobHistorySchema = new Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    action: { type: String, required: true },
    // examples:
    // "job_created"
    // "job_updated"
    // "status_changed"
    // "remark_added"

    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },

    message: { type: String }, // For UI display message
  },
  { timestamps: true },
);

export const JobHistory = mongoose.model('JobHistory', jobHistorySchema);
