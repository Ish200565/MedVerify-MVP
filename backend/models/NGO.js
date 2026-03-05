//For NGO Schema
const mongoose=require('mongoose');
const bcrypt =require('bcryptjs');

const NgoSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add admin name']
    },
    ngoName:{
        type:String,
        required:[true,'Please add NGO name']
    },
    state:{
        type:String,
        required:[true,'Please add state']
    },
    phone:{
        type:String,
        required:[true,'Please add NGO phone number']
    },
    email:{
        type:String,
        required:[true,'Please add an email'],
        unique:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/, 'Please add a valid email']
    },
    password:{
        type:String,
        required:[true,'Please add a password'],
        minlength:6,
        select:false    
    },
    ngoKey:{
        type:String,
        unique:true //Auto-generated
    },
    role:{
        type:String,
        default:'ngo',
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});
//Generate NGO key before saving
NgoSchema.pre('save', async function(next){
    //Generate ngoKey if not exists
    if(!this.ngoKey){
        this.ngoKey = this.ngoName.substring(0,3).toUpperCase() + '-' + Date.now().toString().slice(-6);
    }

  // Hash password
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password
NgoSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Ngo', NgoSchema);