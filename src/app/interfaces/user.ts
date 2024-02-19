export interface UserInterface {
  id: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  photo: userPhoto;
  role: string;
}

export interface userPhoto {
  image: string;
  createdAt: string;
  updatedAt: string;
}
export interface UserState {
  user: UserInterface | null;
  accessToken?: string;
}
