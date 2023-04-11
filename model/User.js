import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

export default User;
