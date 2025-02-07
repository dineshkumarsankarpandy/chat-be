import { User } from "src/core/interface/interface"; // Adjust the path based on where you define your User type

declare module 'express' {
  interface Request {
    user?: User; 
  }
}