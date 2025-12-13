import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      trim: true,
      default: null
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    sku: {
      type: String,
      trim: true,
      default: null
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    min_stock_level: {
      type: Number,
      default: 10,
      min: 0
    },
    unit_price: {
      type: Number,
      required: true,
      min: 0
    },
    total_value: {
      type: Number,
      default: 0,
      get: function() {
        return this.quantity * this.unit_price;
      }
    }
  },
  {
    timestamps: true,
    toJSON: { getters: true }
  }
);

// Middleware to calculate total_value before saving
inventoryItemSchema.pre('save', function(next) {
  this.total_value = this.quantity * this.unit_price;
  next();
});

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

export default InventoryItem;
