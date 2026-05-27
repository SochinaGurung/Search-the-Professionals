export interface Experience {
    _id?: string;
  company: string;
  position: string;
  duration: string;
}

export interface User {
  specialization: string;
  _id: string;
  username: string;
  email: string;
  fullName:string;
  address:string;
  about?: string;
  profession: string,
  profileCompleted: boolean,
  skills?: string[];
  contact?: string;
  experience?: Experience[];
   profilePicture?: {
    url: string;
    public_id?: string;
  };
  linkedIn?: string;
  instagram?: string;
}