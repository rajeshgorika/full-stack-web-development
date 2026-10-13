// Topic Practice: Mongoose Schema & Validation Example
const mongoose = require('mongoose');

// Schema Definition with Built-in & Custom Validators
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is mandatory'],
        trim: true,
        minlength: [3, 'Title must contain at least 3 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    sku: {
        type: String,
        required: true,
        uppercase: true,
        validate: {
            validator: function (v) {
                // Must be 3 letters followed by 4 digits e.g. PRO-1024
                return /^[A-Z]{3}-\d{4}$/.test(v);
            },
            message: props => `${props.value} is not a valid SKU format! (Expected format: ABC-1234)`
        }
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0.01, 'Price must be greater than zero']
    },
    inStock: {
        type: Boolean,
        default: true
    },
    tags: {
        type: [String],
        validate: {
            validator: function (val) {
                return val && val.length > 0;
            },
            message: 'Product must have at least one tag.'
        }
    }
}, {
    timestamps: true
});

// Pre-save middleware hook
productSchema.pre('save', function (next) {
    console.log(`[HOOK] Preparing to save product: ${this.title}`);
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
