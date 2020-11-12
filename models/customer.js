 
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    phone: {
        type: String,
       // required: true,
        minlength: 3,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Customer = mongoose.model("Customer",  customerSchema);


exports.customerSchema = customerSchema;
exports.Customer = Customer;