const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema(
  {
    cpu: {
      type: Number,
      required: [true, 'A host must have cpu usage.'],
    },
    memory: {
      type: Number,
      required: [true, 'A host must have memory usage.'],
    },
    ip: {
      type: String,
      required: [true, 'A host must have an IP address.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//tourSchema.index({ price: 1, ratingsAverage: -1 });
//tourSchema.index({ slug: 1 });
hostSchema.virtual('VMs', {
  ref: 'VM',
  foreignField: 'host', // the connecting fields name in the review database
  localField: '_id', // the connecting fields name in the current database
});
// DOCUMENT MIDDLEWARE, runs before .save() and .create()
// tourSchema.pre("save", function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

///////////////////// EMBEDDING ////////////////////////////
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
///////////////////////////////////////////////////////////

// runs after pre middlewares
// tourSchema.post('save', function (doc, next) {
//
//   next();
// });
// QUERY MIDDLEWARE
// tourSchema.pre(/^find/, function (next) {
//   this.find({
//     secretTour: { $ne: true },
//   });
//   this.start = Date.now();
//   next();
// });
// tourSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "guides",
//     select: "-__v -passwordChangedAt",
//   });
//   next();
// });
// tourSchema.post(/^find/, function (docs, next) {
//   // docs = docs returned after executing the query
//   //console.log(docs);
//   // console.log(Date.now() - this.start);
//   next();
// });
// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({
//     $match: {
//       secretTour: { $ne: true },
//     },
//   });
//   // console.log(this.pipeline());
//   next();
// });
const Host = mongoose.model('Host', hostSchema);
module.exports = Host;
