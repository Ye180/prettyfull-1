import { MongooseModule } from '@nestjs/mongoose';

export const mongooseConfig = MongooseModule.forRoot(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/prettyfull',
);
