export interface Experience {
    _id?: string;
  company: string;
  position: string;
  duration: string;
}

export interface User {
    _id: string;
  username: string;
  email: string;
  fullName:string;
  address:string;
  about?: string;
  profession: string,
  profileCompleted: boolean,
  skills?: string[];
   experience?: Experience[];
  
}