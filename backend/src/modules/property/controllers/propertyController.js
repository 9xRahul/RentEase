const Property = require("../models/propertyModel");

// ✅ Add Property
exports.addProperty = async (req, res, next) => {
  try {
    if (!req.body.data) {
      return res.status(400).json({
        success: false,
        message: "Property data is required",
      });
    }

    // 🔥 Parse JSON string
    const propertyData = JSON.parse(req.body.data);

    // 🔥 Validate images
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Minimum 2 images required",
      });
    }

    if (req.files.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Maximum 10 images allowed",
      });
    }

    // Example: convert numbers manually (important!)
    propertyData.dailyCharge = Number(propertyData.dailyCharge);
    propertyData.weeklyCharge = Number(propertyData.weeklyCharge);
    propertyData.monthlyCharge = Number(propertyData.monthlyCharge);
    propertyData.securityDeposit = Number(propertyData.securityDeposit);
    propertyData.bedrooms = Number(propertyData.bedrooms);
    propertyData.bathroomsAttached = Number(propertyData.bathroomsAttached);
    propertyData.bathroomsCommon = Number(propertyData.bathroomsCommon);
    propertyData.areaSqFt = Number(propertyData.areaSqFt);

    const property = await Property.create({
      ...propertyData,
      photos: req.files.map((file) => file.originalname), // replace with cloudinary URLs
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Property added successfully",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get All + Search + Filter
exports.getProperties = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      state,
      district,
      pincode,
      minPrice,
      maxPrice,
      priceType = "monthly",
      bedrooms,
      propertyType,
      furnishingStatus,
      amenities,
      available,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Location filters
    if (state) query["address.state"] = state;
    if (district) query["address.district"] = district;
    if (pincode) query["address.pincode"] = pincode;

    // Price filter
    if (minPrice || maxPrice) {
      const field =
        priceType === "daily"
          ? "dailyCharge"
          : priceType === "weekly"
            ? "weeklyCharge"
            : "monthlyCharge";

      query[field] = {};
      if (minPrice) query[field].$gte = Number(minPrice);
      if (maxPrice) query[field].$lte = Number(maxPrice);
    }

    // Other filters
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (propertyType) query.propertyType = propertyType;
    if (furnishingStatus) query.furnishingStatus = furnishingStatus;

    if (available !== undefined) {
      query.isAvailable = available === "true";
    }

    if (amenities) {
      query.amenities = { $all: amenities.split(",") };
    }

    // Sorting
    const sortOption = {};
    sortOption[sortBy] = order === "asc" ? 1 : -1;

    const properties = await Property.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Property.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};
