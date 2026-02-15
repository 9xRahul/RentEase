const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic Info
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    propertyType: {
      type: String,
      enum: ["Apartment", "Villa", "House", "Studio", "PG"],
      required: true,
    },

    furnishingStatus: {
      type: String,
      enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
      required: true,
    },

    // Charges
    dailyCharge: {
      type: Number,
      required: true,
    },

    weeklyCharge: {
      type: Number,
      required: true,
    },

    monthlyCharge: {
      type: Number,
      required: true,
    },

    securityDeposit: {
      type: Number,
      required: true,
    },

    // Rooms
    bedrooms: {
      type: Number,
      required: true,
    },

    bathroomsAttached: {
      type: Number,
      required: true,
    },

    bathroomsCommon: {
      type: Number,
      required: true,
    },

    hall: {
      type: Number,
      default: 1,
    },

    kitchen: {
      type: Number,
      default: 1,
    },

    workArea: {
      type: Boolean,
      default: false,
    },

    areaSqFt: {
      type: Number,
      required: true,
    },

    floorNumber: Number,
    totalFloors: Number,

    amenities: [String],

    photos: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length >= 2 && v.length <= 10;
        },
        message: "Minimum 2 and Maximum 10 images required",
      },
    },

    address: {
      state: { type: String, required: true },
      district: { type: String, required: true },
      location: { type: String, required: true },
      pincode: { type: String, required: true },
      fullAddress: { type: String, required: true },
    },

    availableFrom: {
      type: Date,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    ratingAverage: {
      type: Number,
      default: 0,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Text index for search
propertySchema.index({
  title: "text",
  description: "text",
  "address.location": "text",
  "address.district": "text",
  "address.state": "text",
});

module.exports = mongoose.model("Property", propertySchema);
